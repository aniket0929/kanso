"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createService(workspaceId: string, data: any) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) throw new Error("Unauthorized");

    // Minimal validation
    if (!data.name || !data.duration) throw new Error("Missing required fields");

    const service = await db.service.create({
        data: {
            workspaceId,
            name: data.name,
            description: data.description,
            duration: parseInt(data.duration),
            availableDays: JSON.stringify(data.availableDays || ["monday", "tuesday", "wednesday", "thursday", "friday"]),
            timeSlots: JSON.stringify(data.timeSlots || [{ start: "09:00", end: "17:00" }]),
        },
    });

    // Update onboarding progress
    await db.workspace.update({
        where: { id: workspaceId },
        data: { onboardingStep: Math.max(3, 3) } // Keep it at 3 or move to 4?
    });

    revalidatePath("/onboarding");
    return service;
}
