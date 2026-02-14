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
        const resendApiKey = process.env.RESEND_API_KEY;
        let finalApiKey = resendApiKey;
        let fromEmail = 'CareOps <onboarding@resend.dev>'; // Default Resend testing email

        if (config?.emailConfig) {
            try {
                const parsed = JSON.parse(config.emailConfig);
                if (parsed.apiKey) finalApiKey = parsed.apiKey;
                if (parsed.fromEmail) fromEmail = parsed.fromEmail;
            } catch (e) {
                console.error("[Email Service] Failed to parse email config", e);
            }
        }

        if (finalApiKey) {
            try {
                // Initialize Resend
                const resend = new (require("resend").Resend)(finalApiKey);

                await resend.emails.send({
                    from: fromEmail,
                    to: options.to,
                    reply_to: options.replyTo,
                    subject: options.subject,
                    html: options.html
                });

                console.log(`[Email Service] Sent via Resend to ${options.to}`);
            } catch (error) {
                console.error("[Email Service] Resend Error:", error);
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
        const twilioSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
        const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

        let finalSid = twilioSid;
        let finalAuth = twilioAuth;
        let finalFrom = twilioFrom;

        if (config?.smsConfig) {
            try {
                const parsed = JSON.parse(config.smsConfig);
                if (parsed.accountSid) finalSid = parsed.accountSid;
                if (parsed.authToken) finalAuth = parsed.authToken;
                if (parsed.phoneNumber) finalFrom = parsed.phoneNumber;
            } catch (e) {
                console.error("[SMS Service] Failed to parse SMS config", e);
            }
        }

        if (finalSid && finalAuth && finalFrom) {
            // Simulation for now or use twilio package
            console.log(`[SMS Service] To: ${options.to} | From: ${finalFrom} | Body: ${options.body}`);
        }

        return true;
    }
}
