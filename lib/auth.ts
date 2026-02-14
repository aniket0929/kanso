import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export type Role = "org:admin" | "org:member";

export async function checkRole(requiredRole: Role) {
    const { orgRole } = await auth();

    if (requiredRole === "org:admin" && orgRole !== "org:admin") {
        return false;
    }

    return true;
}

export async function getCurrentStaff() {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return null;

    const staff = await db.staffProfile.findUnique({
        where: { clerkUserId: userId },
    });

    // If not found, try to sync from Clerk (Lazy creation)
    if (!staff) {
        const user = await currentUser();
        const { orgRole } = await auth();

        if (user && orgId) {
            try {
                const newStaff = await db.staffProfile.create({
                    data: {
                        clerkUserId: userId,
                        workspaceId: (await db.workspace.findUnique({ where: { clerkOrgId: orgId } }))?.id!, // unsafe but simplified
                        email: user.emailAddresses[0].emailAddress,
                        name: `${user.firstName} ${user.lastName}`,
                        role: orgRole === "org:admin" ? "owner" : "staff",
                        // Default permissions for staff
                        canManageBookings: true,
                        canAccessInbox: true,
                        canViewInventory: true,
                        canManageSettings: false
                    }
                });
                return newStaff;
            } catch (error) {
                console.error("Error creating staff profile:", error);
                return null;
            }
        }
        return null;
    }

    return staff;
}

export async function canAccess(permission: string) {
    const staff = await getCurrentStaff();
    if (!staff) return false;

    // Owners can do everything
    if (staff.role === "owner") return true;

    // Staff check specific permission
    return (staff as any)[permission] === true;
}
