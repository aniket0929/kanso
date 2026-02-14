import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { CreateFormDialog } from "@/components/forms/create-form-dialog";
import { FormActions } from "@/components/forms/form-actions";

export default async function FormsPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return null;

  const forms = await db.form.findMany({
    where: { workspace: { clerkOrgId: orgId } },
    include: { _count: { select: { submissions: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Forms</h2>
            <p className="text-muted-foreground">Manage intake forms and view submissions.</p>
        </div>
        <CreateFormDialog />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell className="font-medium">{form.name}</TableCell>
                <TableCell>{form.description}</TableCell>
                <TableCell>{form._count.submissions}</TableCell>
                <TableCell>{format(form.createdAt, "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <FormActions formId={form.id} />
                </TableCell>
              </TableRow>
            ))}
            {forms.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No forms found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
