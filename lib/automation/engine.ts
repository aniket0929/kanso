import { db } from "@/lib/db";
import { CommunicationService } from "@/lib/services/communication";

export const AUTOMATION_EVENTS = {
    BOOKING_CREATED: "booking.created",
    FORM_SUBMITTED: "form.submitted",
    INVENTORY_LOW: "inventory.low",
    INCOMING_MESSAGE: "message.incoming",
};

export class AutomationEngine {
    private workspaceId: string;
    private comms: CommunicationService;

    constructor(workspaceId: string) {
        this.workspaceId = workspaceId;
        this.comms = new CommunicationService(workspaceId);
    }

    async trigger(event: string, payload: any) {
        console.log(`[Automation Engine] Triggered: ${event}`, payload);

        // Hardcoded rules for prototype (Strategy Pattern would be better for complex apps)
        switch (event) {
            case AUTOMATION_EVENTS.BOOKING_CREATED:
                await this.handleBookingCreated(payload);
                break;
            case AUTOMATION_EVENTS.FORM_SUBMITTED:
                await this.handleFormSubmitted(payload);
                break;
            case AUTOMATION_EVENTS.INVENTORY_LOW:
                await this.handleInventoryLow(payload);
                break;
            case AUTOMATION_EVENTS.INCOMING_MESSAGE:
                await this.handleIncomingMessage(payload);
                break;
        }
    }

    private async handleBookingCreated(payload: any) {
        // payload: Booking & { contact: Contact, service: Service }
        const { contact, service, startTime } = payload;

        // 0. Notify Business Owner
        const workspace = await db.workspace.findUnique({
            where: { id: this.workspaceId },
            select: { contactEmail: true, name: true }
        });

        if (workspace?.contactEmail) {
            await this.comms.sendEmail({
                to: workspace.contactEmail,
                subject: `New Booking: ${contact.name} - ${service.name}`,
                replyTo: contact.email || undefined, // Reply directly to customer
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>New Booking Received! 🎉</h2>
                        <p>You have a new appointment scheduled.</p>
                        <hr />
                        <p>👤 <strong>Customer:</strong> ${contact.name} (${contact.email || "No email"} | ${contact.phone || "No phone"})</p>
                        <p>🛠 <strong>Service:</strong> ${service.name}</p>
                        <p>📅 <strong>Time:</strong> ${new Date(startTime).toLocaleString()}</p>
                        <hr />
                        <p>Login to your dashboard to view more details.</p>
                    </div>
                `
            });
        }
        // 1. Send Email Confirmation with In-Person Details
        if (contact.email) {
            await this.comms.sendEmail({
                to: contact.email,
                subject: `Confirmed: ${service.name}`,
                replyTo: workspace?.contactEmail || undefined, // Customer replies go to Business Owner
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Your Appointment is Confirmed!</h2>
                        <p>Hi ${contact.name},</p>
                        <p>We are looking forward to seeing you for <strong>${service.name}</strong>.</p>
                        <hr />
                        <p>📅 <strong>When:</strong> ${new Date(startTime).toLocaleString()}</p>
                        <p>📍 <strong>Where:</strong> ${service.address || "Our Office"}</p>
                        ${service.arrivalInstructions ? `<p>ℹ️ <strong>Instructions:</strong> ${service.arrivalInstructions}</p>` : ""}
                        <hr />
                        <p>If you need to reschedule, please contact us directly.</p>
                        <p><em>- The ${service.name} Team</em></p>
                    </div>
                `,
            });

            // 2. Trigger Post-Booking Follow-up Form
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            await this.comms.sendEmail({
                to: contact.email,
                subject: "Important: Please complete your intake form",
                html: `
                    <p>Hi ${contact.name},</p>
                    <p>To prepare for your visit, please fill out this additional information form:</p>
                    <p><a href="${baseUrl}/forms/intake?b=${payload.bookingId}" style="padding: 10px 20px; background: #000000; color: white; text-decoration: none; border-radius: 99px; font-weight: bold;">Complete Form</a></p>
                `
            });
        }

        // 3. Send SMS Confirmation
        if (contact.phone) {
            await this.comms.sendSms({
                to: contact.phone,
                body: `Confirmed: ${service.name} on ${new Date(startTime).toLocaleDateString()}. Address: ${service.address || "Check your email"}`,
            });
        }
    }

    private async handleFormSubmitted(payload: any) {
        // payload: { email: string, name: string, message: string } or { contactEmail, contactName }
        const email = payload.email || payload.contactEmail;
        const name = payload.name || payload.contactName || "Customer";

        if (email) {
            await this.comms.sendEmail({
                to: email,
                subject: "We received your message",
                html: `
                    <div style="font-family: serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="font-size: 24px;">Thank you for reaching out.</h2>
                        <p>Hi ${name},</p>
                        <p>Your response has been securely recorded. Our team will review the information and get back to you shortly.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Powered by Kanso</p>
                    </div>
                `
            });
        }
    }

    private async handleInventoryLow(payload: any) {
        // payload: Resource
        // Create Alert
        await db.alert.create({
            data: {
                workspaceId: this.workspaceId,
                type: "low_inventory",
                severity: "warning",
                title: `Low Stock: ${payload.name}`,
                message: `Current stock: ${payload.currentStock} (Threshold: ${payload.lowStockThreshold})`,
                linkTo: `/dashboard/inventory`
            }
        });
    }

    private async handleIncomingMessage(payload: any) {
        // payload: { message: Message, contact: Contact, conversation: Conversation }
        const { message, contact } = payload;

        // Notify staff via Dashboard Alert
        await db.alert.create({
            data: {
                workspaceId: this.workspaceId,
                type: "missed_message",
                severity: "warning",
                title: `New Message from ${contact.name}`,
                message: message.content.substring(0, 100) + "...",
                linkTo: `/dashboard/inbox`
            }
        });
    }
}
