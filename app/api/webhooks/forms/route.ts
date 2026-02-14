import { db } from "@/lib/db";
import { AutomationEngine, AUTOMATION_EVENTS } from "@/lib/automation/engine";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // 1. Identify Workspace
        // We look for workspaceId in the query params: /api/webhooks/forms?wid=...
        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("wid");

        if (!workspaceId) {
            return NextResponse.json({ error: "Missing workspace ID (wid)" }, { status: 400 });
        }

        const workspace = await db.workspace.findUnique({ where: { id: workspaceId } });
        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        // 2. Smart Field Mapping
        // We try to find name, email, and message in common field variants
        const findField = (keys: string[]) => {
            for (const key of keys) {
                const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
                for (const payloadKey of Object.keys(payload)) {
                    const payloadNormalized = payloadKey.toLowerCase().replace(/[^a-z0-9]/g, "");
                    if (normalized === payloadNormalized || payloadKey.toLowerCase().includes(normalized)) {
                        return payload[payloadKey];
                    }
                }
            }
            return null;
        };

        const name = findField(["name", "full_name", "user_name", "first_name", "fullname"]) || "External Lead";
        const email = findField(["email", "mail", "email_address", "contact_email"]);
        const message = findField(["message", "msg", "body", "comments", "description", "content", "note"]) || "Submitted via external form";

        if (!email) {
            return NextResponse.json({ error: "Could not identify email field in payload" }, { status: 400 });
        }

        // 3. Process as Lead (Reuse core logic)
        // Find or create Contact
        let contact = await db.contact.findFirst({
            where: { workspaceId: workspace.id, email: email }
        });

        if (!contact) {
            contact = await db.contact.create({
                data: {
                    workspaceId: workspace.id,
                    name: name,
                    email: email,
                    source: "external_form"
                }
            });
        }

        // Create Conversation
        const conversation = await db.conversation.create({
            data: {
                workspaceId: workspace.id,
                contactId: contact.id,
                status: "active",
            }
        });

        // Create Message
        await db.message.create({
            data: {
                conversationId: conversation.id,
                channel: "email",
                direction: "inbound",
                content: message,
                status: "received",
                senderType: "contact",
                senderName: name
            }
        });

        // 4. Trigger Automation
        const engine = new AutomationEngine(workspace.id);
        await engine.trigger(AUTOMATION_EVENTS.FORM_SUBMITTED, {
            email: email,
            name: name,
            message: message
        });

        return NextResponse.json({ success: true, leadId: contact.id });
    } catch (error: any) {
        console.error("[External Form Webhook Error]:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
