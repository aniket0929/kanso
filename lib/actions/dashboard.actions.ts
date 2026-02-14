"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { startOfDay, endOfDay, startOfMonth, subDays } from "date-fns";

export async function getDashboardStats() {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return null;

    const workspace = await db.workspace.findUnique({
        where: { clerkOrgId: orgId },
    });

    if (!workspace) return null;

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    // 2. Leads (Contacts created in last 7 days) - sevenDaysAgo is needed before Promise.all
    const sevenDaysAgo = subDays(now, 7);

    // 4. Action Required (Pending Bookings)
    // Run these in parallel for performance
    const [
        bookingsToday,
        bookingsTotal,
        newLeads,
        unreadConversations,
        pendingBookings,
        recentBookings,
        recentInbox
    ] = await Promise.all([
        // 1. Booking Stats - Bookings Today
        db.booking.count({
            where: {
                workspaceId: workspace.id,
                scheduledAt: { gte: todayStart, lte: todayEnd },
            },
        }),
        // 1. Booking Stats - Bookings Total
        db.booking.count({
            where: { workspaceId: workspace.id },
        }),
        // 2. Leads (Contacts created in last 7 days)
        db.contact.count({
            where: {
                workspaceId: workspace.id,
                createdAt: { gte: sevenDaysAgo },
            },
        }),
        // 3. Unread Messages (Conversations with unread messages)
        db.conversation.count({
            where: {
                workspaceId: workspace.id,
                unreadCount: { gt: 0 },
            },
        }),
        // 4. Action Required - Pending Bookings
        db.booking.count({
            where: {
                workspaceId: workspace.id,
                status: "pending",
            },
        }),
        // 5. Recent Bookings (Top 10)
        db.booking.findMany({
            where: { workspaceId: workspace.id },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                contact: true,
                service: true,
            },
        }),
        // 6. Recent Inbox (Top 10)
        db.conversation.findMany({
            where: { workspaceId: workspace.id },
            orderBy: { lastMessageAt: 'desc' },
            take: 10,
            include: {
                contact: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        })
    ]);

    // Submissions that are pending are usually forms that were sent but not filled out yet (if we track that)
    // Or forms filled out but not marked "completed" by staff.
    // In our schema, FormSubmission status default is "pending".
    // When a user submits, it stays "pending" until staff marks it "completed"?
    // Actually, let's look at `form.actions.ts`.
    // It doesn't seem to create a FormSubmission record on submit! It creates a Message.
    // Ah, `submitContactForm` creates a message.
    // We need to check where `FormSubmission` is created.
    // It seems missing from the `submitContactForm`!

    // Let's count unconfirmed bookings as "Action Required" for now,
    // as that's a very common "action" needed.
    const actionRequired = pendingBookings;

    return {
        bookingsToday,
        bookingsTotal,
        newLeads,
        unreadConversations,
        actionRequired,
        recentBookings: JSON.parse(JSON.stringify(recentBookings)),
        recentInbox: JSON.parse(JSON.stringify(recentInbox)),
    };
}
