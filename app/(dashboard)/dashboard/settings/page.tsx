import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default async function SettingsPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return null;

  // Protect this page: Only Admins can access
  const isAdmin = await checkRole("org:admin");
  if (!isAdmin) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 text-center">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600">
                  <AlertTriangle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground max-w-sm">
                  Only workspace owners can access these settings. Please contact your administrator.
              </p>
          </div>
      );
  }

  const workspace = await db.workspace.findUnique({
    where: { clerkOrgId: orgId },
  });

  if (!workspace) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1>Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your workspace preferences and public booking information.
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
            <CardHeader className="space-y-3">
                <h3>General Information</h3>
                <p className="text-muted-foreground">
                  Update your business details visible to customers on your public booking page.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-3">
                    <Label className="text-md font-bold">Workspace Name</Label>
                    <Input defaultValue={workspace.name} className="text-base" />
                    <p className="text-sm text-muted-foreground">This name appears on all customer-facing materials.</p>
                </div>
                
                <div className="grid gap-3">
                    <Label className="text-md font-bold">Public Slug</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-md font-medium">careops.com/</span>
                        <Input defaultValue={workspace.slug} className="text-base" />
                    </div>
                    <p className="text-sm text-muted-foreground">Choose a unique identifier for your booking page URL.</p>
                </div>
                
                <div className="grid gap-3">
                    <Label className="text-md font-bold">Public Booking URL</Label>
                    <div className="flex gap-2">
                         <div className="flex-1 bg-muted p-3 rounded border border-input text-md items-center flex text-muted-foreground truncate font-medium">
                            {`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${workspace.slug}/book`}
                        </div>
                        <Button variant="secondary" size="sm" className="font-bold">Copy</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Share this link with your customers to allow them to book appointments.</p>
                </div>

                <Button className="font-bold">Save Changes</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
