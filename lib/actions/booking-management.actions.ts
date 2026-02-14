"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getAllBookings(filters?: { status?: string; search?: string; date?: string }) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return [];

    const workspace = await db.workspace.findUnique({
        where: { clerkOrgId: orgId }
    });

    if (!workspace) return [];

    // Optimization: Don't block read on update. We can fire and forget, or run it conditionally.
    // For now, let's just NOT run it on every fetch. It's too heavy.
    // We can perhaps run it only if we're filtering by 'completed'?
    // Or just accept that 'confirmed' bookings in the past are effectively completed for read purposes.

    // If we MUST update valid DB state, let's do it in a non-blocking way (fire & forget)
    // But Vercel might kill the process.
    // Let's remove it for now to fix performance, and rely on visual cues
    // or a separate cron job.


    const where: any = {
        workspaceId: workspace.id
    };

    if (filters?.status && filters.status !== "all") {
        where.status = filters.status;
    }

    if (filters?.search) {
        where.OR = [
            { contact: { name: { contains: filters.search } } },
            { contact: { email: { contains: filters.search } } },
        ];
    }

    if (filters?.date) {
        const start = new Date(filters.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(filters.date);
        end.setHours(23, 59, 59, 999);
        where.scheduledAt = { gte: start, lte: end };
    }

    return await db.booking.findMany({
        where,
        include: {
            contact: true,
            service: true,
            formSubmissions: {
                include: {
                    form: true
                }
            }
        },
        orderBy: { scheduledAt: 'desc' },
    });
}

export async function cancelBooking(bookingId: string) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) throw new Error("Unauthorized");

    const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: { workspace: true }
    });

    if (!booking || booking.workspace.clerkOrgId !== orgId) {
        throw new Error("Not found or unauthorized");
    }

    await db.booking.update({
        where: { id: bookingId },
        data: { status: "cancelled" },
    });

    revalidatePath("/dashboard/bookings");
}
