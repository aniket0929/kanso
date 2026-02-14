"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createInventoryItem(workspaceId: string, data: any) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) throw new Error("Unauthorized");

    const item = await (db.resource as any).create({
        data: {
            workspaceId,
            name: data.name,
            currentStock: parseInt(data.quantity),
            lowStockThreshold: parseInt(data.threshold),
            unit: data.unit || "units",
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        },
    });

    revalidatePath("/dashboard/inventory");
    return item;
}

export async function updateInventoryItem(id: string, data: any) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) throw new Error("Unauthorized");

    const item = await (db.resource as any).update({
        where: { id },
        data: {
            name: data.name,
            currentStock: parseInt(data.quantity),
            lowStockThreshold: parseInt(data.threshold),
            unit: data.unit || "units",
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        },
    });

    revalidatePath("/dashboard/inventory");
    return item;
}

export async function deleteInventoryItem(id: string) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) throw new Error("Unauthorized");

    await db.resource.delete({
        where: { id },
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
}
