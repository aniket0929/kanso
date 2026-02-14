import { db } from "@/lib/db";
import nodemailer from "nodemailer";

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
            select: { emailConfig: true, smsConfig: true, name: true },
        });
        return workspace;
    }

    private createTransporter() {
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (!user || !pass) {
            console.error("[Email Service] SMTP_USER or SMTP_PASS not set in environment variables.");
            return null;
        }

        return nodemailer.createTransport({
            service: "gmail",
            auth: { user, pass },
        });
    }

    async sendEmail(options: EmailOptions) {
        const config = await this.getConfigs();

        // Log the attempt
        console.log(`[Email Service] To: ${options.to} | Subject: ${options.subject}`);

        // Create a conversation/message record in the database
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
                        status: "active",
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

            await db.conversation.update({
                where: { id: conversation!.id },
                data: { updatedAt: new Date() }
            });
        }

        // --- Send via Gmail SMTP (Nodemailer) ---
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const platformName = process.env.SMTP_FROM_NAME || "CareOps";
        const businessName = config?.name;

        // Build sender name: "Kanso - BusinessName" or just "Kanso" if no business name
        const fromName = businessName ? `${platformName} - ${businessName}` : platformName;

        // Allow workspace-level email config override
        let finalUser = smtpUser;
        let finalPass = smtpPass;
        let finalFromName = fromName;

        if (config?.emailConfig) {
            try {
                const parsed = JSON.parse(config.emailConfig);
                if (parsed.smtpUser) finalUser = parsed.smtpUser;
                if (parsed.smtpPass) finalPass = parsed.smtpPass;
                if (parsed.fromName) finalFromName = parsed.fromName;
            } catch (e) {
                console.error("[Email Service] Failed to parse email config", e);
            }
        }

        if (!finalUser || !finalPass) {
            console.error("[Email Service] SMTP credentials not configured. Email NOT sent to:", options.to);
            return false;
        }

        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: finalUser,
                    pass: finalPass,
                },
            });

            console.log(`[Email Service] Sending via Gmail SMTP from: ${finalUser} to: ${options.to}`);

            const info = await transporter.sendMail({
                from: `${finalFromName} <${finalUser}>`,
                to: options.to,
                replyTo: options.replyTo || finalUser,
                subject: options.subject,
                html: options.html,
            });

            console.log(`[Email Service] ✅ Email sent successfully. Message ID: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error("[Email Service] ❌ Failed to send email:", error);
            return false;
        }
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
                        status: "active",
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
