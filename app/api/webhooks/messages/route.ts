import { db } from "@/lib/db";
import { AutomationEngine, AUTOMATION_EVENTS } from "@/lib/automation/engine";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // This structure varies by provider (Resend vs Twilio)
        // For prototype, we'll assume a generic structure or Resend's inbound
        const { from, to, subject, text, html, channel = "email" } = payload;

        if (!from) return NextResponse.json({ error: "Missing sender" }, { status: 400 });

        // 1. Identify Workspace (based on the 'to' address or header)
        // In reality, each workspace gets a unique inbound address like workspace_123@inbound.careops.com
        // For prototype, we'll try to find any workspace that might match or use a global catcher
        const workspace = await db.workspace.findFirst(); // Simplified: using first workspace for demo
        if (!workspace) return NextResponse.json({ error: "No workspace found" }, { status: 404 });

        // 2. Find/Match Contact
        let contact = await db.contact.findFirst({
            where: {
                workspaceId: workspace.id,
                OR: [
                    { email: from },
                    { phone: from }
                ]
            }
        });

        // If unknown contact, we create a new one! (New Lead)
        if (!contact) {
            contact = await db.contact.create({
                data: {
                    workspaceId: workspace.id,
                    name: "Unknown Contact",
                    email: channel === "email" ? from : null,
                    phone: channel === "sms" ? from : null,
                    source: "inbound_message"
                }
            });
        }

        // 3. Find/Match Conversation
        let conversation = await db.conversation.findFirst({
            where: { contactId: contact.id, status: "active" },
            orderBy: { updatedAt: "desc" }
        });

        if (!conversation) {
            conversation = await db.conversation.create({
                data: {
                    workspaceId: workspace.id,
                    contactId: contact.id,
                    status: "active"
                }
            });
        }

        // 4. Create Message
        const message = await db.message.create({
            data: {
                conversationId: conversation.id,
                channel: channel,
                direction: "inbound",
                content: text || html || "Empty message",
                senderType: "contact",
                senderName: contact.name,
                status: "received"
            }
        });

        // 5. Update Conversation Metadata
        await db.conversation.update({
            where: { id: conversation.id },
            data: {
                lastMessageAt: new Date(),
                unreadCount: { increment: 1 }
            }
        });

        // 6. Trigger Automation Engine (e.g. for Staff Notifications)
        const engine = new AutomationEngine(workspace.id);
        await engine.trigger(AUTOMATION_EVENTS.INCOMING_MESSAGE, {
            message,
            contact,
            conversation
        });

        return NextResponse.json({ success: true, messageId: message.id });
    } catch (error) {
        console.error("[Webhook Error]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
