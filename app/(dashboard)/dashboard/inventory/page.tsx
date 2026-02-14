import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { AddItemDialog } from "@/components/inventory/add-item-dialog";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { getWorkspace } from "@/lib/actions/workspace.actions";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return null;

  const workspace = await getWorkspace();
  if (!workspace) redirect("/onboarding");

  const resources = await db.resource.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
            <p className="text-muted-foreground">Manage your tools, medicines, and supplies.</p>
        </div>
        <AddItemDialog workspaceId={workspace.id} />
      </div>

      <InventoryTable items={resources} workspaceId={workspace.id} />
    </div>
  );
}
