"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { AutomationEngine, AUTOMATION_EVENTS } from "@/lib/automation/engine";

export async function createForm(data: any, workspaceId?: string) {
    const { userId, orgId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    let workspace;
    if (workspaceId) {
        workspace = await db.workspace.findUnique({ where: { id: workspaceId } });
    } else if (orgId) {
        workspace = await db.workspace.findUnique({ where: { clerkOrgId: orgId } });
    }

    if (!workspace) throw new Error("Workspace not found");

    const form = await db.form.create({
        data: {
            workspaceId: workspace.id,
            name: data.name,
            description: data.description,
            fields: JSON.stringify(data.fields || [
                { id: "name", type: "text", label: "Full Name", required: true },
                { id: "email", type: "email", label: "Email Address", required: true },
                { id: "message", type: "textarea", label: "Message", required: true }
            ]),
        },
    });

    await db.workspace.update({
        where: { id: workspace.id },
        data: { onboardingStep: Math.max(4, 4) }
    });

    revalidatePath("/dashboard/forms");
    return form;
}

export async function updateForm(formId: string, data: any) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) throw new Error("Unauthorized");

    const form = await db.form.update({
        where: { id: formId },
        data: {
            name: data.name,
            description: data.description,
            fields: data.fields,
        },
    });

    revalidatePath("/dashboard/forms");
    revalidatePath(`/dashboard/forms/${formId}/edit`);
    return form;
}


export async function submitContactForm(slug: string, data: any) {
    // Public action
    const workspace = await db.workspace.findUnique({ where: { slug } });
    if (!workspace) throw new Error("Workspace not found");

    // 1. Find or create Contact
    let contact = await db.contact.findFirst({
        where: { workspaceId: workspace.id, email: data.email }
    });

    if (!contact) {
        contact = await db.contact.create({
            data: {
                workspaceId: workspace.id,
                name: data.name,
                email: data.email,
                source: "contact_form"
            }
        });
    }

    // 2. Create Conversation
    const conversation = await db.conversation.create({
        data: {
            workspaceId: workspace.id,
            contactId: contact.id,
            status: "active",
        }
    });

    // 3. Create Message
    await db.message.create({
        data: {
            conversationId: conversation.id,
            channel: "email",
            direction: "inbound", // Customer -> Business
            content: data.message,
            status: "received",
            senderType: "contact",
            senderName: data.name
        }
    });

    // 4. Trigger Automation
    const engine = new AutomationEngine(workspace.id);
    await engine.trigger(AUTOMATION_EVENTS.FORM_SUBMITTED, {
        email: data.email,
        name: data.name,
        message: data.message,
        workspaceSlug: workspace.slug,
        workspaceName: workspace.name
    });

    return true;
}

export async function submitFormResponse(formId: string, data: any) {
    try {
        const form = await db.form.findUnique({
            where: { id: formId },
            include: { workspace: true }
        });

        if (!form) throw new Error("Form not found");

        // 1. Try to find/create contact
        // We look for common email/name field keys
        const emailKey = Object.keys(data).find(k => k.toLowerCase().includes('email'));
        const nameKey = Object.keys(data).find(k => k.toLowerCase().includes('name'));
        const email = emailKey ? data[emailKey] : null;
        const name = nameKey ? data[nameKey] : "Unknown Lead";

        let contact = await db.contact.findFirst({
            where: {
                workspaceId: form.workspaceId,
                ...(email ? { email } : { name })
            }
        });

        if (!contact) {
            contact = await db.contact.create({
                data: {
                    workspaceId: form.workspaceId,
                    name: name,
                    email: email,
                    source: "form_submission"
                }
            });
        }

        // 2. Create the Form Submission
        await db.formSubmission.create({
            data: {
                formId: form.id,
                contactId: contact.id,
                data: JSON.stringify(data),
                status: "completed",
                completedAt: new Date()
            }
        });

        // 3. Create a Message in their conversation for visibility
        let conversation = await db.conversation.findFirst({
            where: { contactId: contact.id }
        });

        if (!conversation) {
            conversation = await db.conversation.create({
                data: {
                    workspaceId: form.workspaceId,
                    contactId: contact.id,
                    status: "active",
                    subject: `Submission: ${form.name}`
                }
            });
        } else {
            // Update timestamp
            await db.conversation.update({
                where: { id: conversation.id },
                data: { updatedAt: new Date() }
            });
        }

        await db.message.create({
            data: {
                conversationId: conversation.id,
                channel: "system",
                direction: "inbound",
                content: `New form submission: ${form.name}`,
                senderType: "system",
                status: "received"
            }
        });

        // 4. Trigger Automation
        const engine = new AutomationEngine(form.workspaceId);
        await engine.trigger(AUTOMATION_EVENTS.FORM_SUBMITTED, {
            formName: form.name,
            contactName: name,
            contactEmail: email,
            workspaceSlug: form.workspace.slug,
            workspaceName: form.workspace.name,
            submissionData: data
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit form:", error);
        throw error;
    }
}

export async function submitIntakeResponse(bookingId: string, data: any) {
    try {
        const booking = await db.booking.findUnique({
            where: { id: bookingId },
            include: {
                contact: true,
                service: true,
                workspace: true
            }
        });

        if (!booking) throw new Error("Booking not found");

        // 1. Create a Form Submission for this booking
        // We find the first form linked to this service, or use a "General Intake" label
        const formLink = await db.formServiceLink.findFirst({
            where: { serviceId: booking.serviceId },
            include: { form: true }
        });

        await db.formSubmission.create({
            data: {
                formId: formLink?.formId || "general_intake", // Fallback if no specific form linked
                contactId: booking.contactId,
                bookingId: booking.id,
                data: JSON.stringify(data),
                status: "completed",
                completedAt: new Date()
            }
        });

        // 2. Mark booking as completed
        await db.booking.update({
            where: { id: bookingId },
            data: { formsCompleted: true }
        });

        // 3. Create a Message in their conversation for visibility
        let conversation = await db.conversation.findFirst({
            where: { contactId: booking.contactId }
        });

        if (!conversation) {
            conversation = await db.conversation.create({
                data: {
                    workspaceId: booking.workspaceId,
                    contactId: booking.contactId,
                    status: "active",
                    subject: `Intake: ${booking.service.name}`
                }
            });
        }

        await db.message.create({
            data: {
                conversationId: conversation.id,
                channel: "system",
                direction: "inbound",
                content: `Patient completed intake form for ${booking.service.name}.`,
                senderType: "system",
                status: "received"
            }
        });

        // 4. Trigger Automation (Thank you email)
        const engine = new AutomationEngine(booking.workspaceId);
        await engine.trigger(AUTOMATION_EVENTS.FORM_SUBMITTED, {
            contactEmail: booking.contact.email,
            contactName: booking.contact.name,
            formName: "Clinical Intake"
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit intake:", error);
        throw error;
    }
}

