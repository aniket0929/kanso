"use server";

import { db } from "@/lib/db";
import { workspaceSchema } from "@/lib/validations/workspace.schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWorkspace(data: any) {
    const { userId, orgId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    if (!orgId) throw new Error("Please select an organization");

    const validated = workspaceSchema.parse(data);

    // Check if workspace exists for this org
    const existing = await db.workspace.findUnique({
        where: { clerkOrgId: orgId },
    });

    if (existing) {
        // If exists, update it
        return await db.workspace.update({
            where: { id: existing.id },
            data: { ...validated, onboardingStep: Math.max(existing.onboardingStep, 1) },
        });
    }

    // Create new
    const workspace = await db.workspace.create({
        data: {
            ...validated,
            clerkOrgId: orgId,
            onboardingStep: 1,
        },
    });

    revalidatePath("/onboarding");
    return workspace;
}

export async function getWorkspace() {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return null;

    return await db.workspace.findUnique({
        where: { clerkOrgId: orgId },
    });
}

export async function updateWorkspace(id: string, data: any) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) throw new Error("Unauthorized");

    // Verify ownership/access
    const workspace = await db.workspace.findUnique({
        where: { id },
    });

    if (!workspace || workspace.clerkOrgId !== orgId) {
        throw new Error("Workspace not found or access denied");
    }

    const updated = await db.workspace.update({
        where: { id },
        data: {
            ...data,
            onboardingStep: Math.max(workspace.onboardingStep, data.onboardingStep || workspace.onboardingStep),
        },
    });

    revalidatePath("/onboarding");
    return updated;
}

export async function completeOnboarding(id: string) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) throw new Error("Unauthorized");

    const workspace = await db.workspace.findUnique({
        where: { id },
    });

    if (!workspace || workspace.clerkOrgId !== orgId) {
        throw new Error("Workspace not found or access denied");
    }

    await db.workspace.update({
        where: { id },
        data: {
            onboardingStep: 6, // Completed
            isActive: true,
        },
    });

    revalidatePath("/onboarding");
    revalidatePath("/dashboard");
}
