"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CommunicationService } from "@/lib/services/communication";
import { revalidatePath } from "next/cache";

export async function getConversations(type?: "all" | "email" | "sms") {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return [];

    const where: any = { workspace: { clerkOrgId: orgId } };

    if (type && type !== "all") {
        where.messages = {
            some: {
                channel: type
            }
        };
    }

    return await db.conversation.findMany({
        where,
        include: {
            contact: true,
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { updatedAt: 'desc' }
    });
}

export async function getMessages(conversationId: string) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return [];

    return await db.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' }
    });
}

export async function sendMessage(conversationId: string, content: string) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) throw new Error("Unauthorized");

    const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: { contact: true, workspace: true },
    });

    if (!conversation) throw new Error("Conversation not found");

    // 1. Save to DB
    const message = await db.message.create({
        data: {
            conversationId,
            direction: "outbound",
            channel: "email",
            content,
            status: "sent",
            senderType: "staff",
            senderId: userId
        }
    });

    // 2. Send via Communication Service
    const comms = new CommunicationService(conversation.workspaceId);
    if (conversation.contact.email) {
        await comms.sendEmail({
            to: conversation.contact.email,
            subject: `Update regarding your inquiry`,
            html: content,
        });
    }

    revalidatePath(`/dashboard/inbox`);
    return message;
}
