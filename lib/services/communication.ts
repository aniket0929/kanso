import { db } from "@/lib/db";

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    replyTo?: string; // The business owner's email
}

interface SmsOptions {
    to: string;
    body: string;
}

export class CommunicationService {
    private workspaceId: string;

    constructor(workspaceId: string) {
        this.workspaceId = workspaceId;
    }

    private async getConfigs() {
        const workspace = await db.workspace.findUnique({
            where: { id: this.workspaceId },
            select: { emailConfig: true, smsConfig: true },
        });
        return workspace;
    }

    async sendEmail(options: EmailOptions) {
        const config = await this.getConfigs();

        // Log the attempt
        console.log(`[Email Service] To: ${options.to} | Subject: ${options.subject}`);

        // Create a conversation/message record
        const contact = await db.contact.findFirst({
            where: { workspaceId: this.workspaceId, email: options.to }
        });

        if (contact) {
            let conversation = await db.conversation.findFirst({
                where: { contactId: contact.id }
            });

            if (!conversation) {
                conversation = await (db.conversation as any).create({
                    data: {
                        workspaceId: this.workspaceId,
                        contactId: contact.id,
                        status: "open",
                        subject: options.subject
                    }
                });
            }

            await db.message.create({
                data: {
                    conversationId: conversation!.id,
                    direction: "outbound",
                    channel: "email",
                    content: options.html,
                    senderType: "system",
                    senderName: "CareOps AI",
                    status: "sent"
                }
            });
        }

        // Real integration (Resend)
        if (config?.emailConfig) {
            try {
                const { apiKey } = JSON.parse(config.emailConfig);
                const resendApiKey = apiKey || process.env.RESEND_API_KEY; // Fallback to env

                if (resendApiKey) {
                    // Initialize Resend
                    const resend = new (require("resend").Resend)(resendApiKey);

                    await resend.emails.send({
                        from: 'CareOps <notifications@careops.com>', // Verify this domain in Resend!
                        to: options.to,
                        reply_to: options.replyTo,
                        subject: options.subject,
                        html: options.html
                    });

                    console.log(`[Email Service] Sent via Resend to ${options.to}`);
                }
            } catch (e) {
                console.error("[Email Service] Failed to parse email config", e);
            }
        }

        return true;
    }

    async sendSms(options: SmsOptions) {
        const config = await this.getConfigs();
        console.log(`[SMS Service] To: ${options.to} | Body: ${options.body}`);

        const contact = await db.contact.findFirst({
            where: { workspaceId: this.workspaceId, phone: options.to }
        });

        if (contact) {
            let conversation = await db.conversation.findFirst({
                where: { contactId: contact.id }
            });

            if (!conversation) {
                conversation = await (db.conversation as any).create({
                    data: {
                        workspaceId: this.workspaceId,
                        contactId: contact.id,
                        status: "open",
                        subject: "SMS Conversation"
                    }
                });
            }

            await db.message.create({
                data: {
                    conversationId: conversation!.id,
                    direction: "outbound",
                    channel: "sms",
                    content: options.body,
                    senderType: "system",
                    senderName: "CareOps AI",
                    status: "sent"
                }
            });
        }

        // Real integration (Twilio)
        if (config?.smsConfig) {
            try {
                const { accountSid, authToken, phoneNumber } = JSON.parse(config!.smsConfig!);
                if (accountSid && authToken) {
                    // In a real app, you'd use the Twilio client here.
                    console.log(`[SMS Service] Simulating Twilio API call from ${phoneNumber}`);
                }
            } catch (e) {
                console.error("[SMS Service] Failed to parse SMS config", e);
            }
        }

        return true;
    }
}
