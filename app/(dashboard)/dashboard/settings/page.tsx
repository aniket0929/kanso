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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your workspace preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your business details visible to customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label>Workspace Name</Label>
                    <Input defaultValue={workspace.name} />
                </div>
                <div className="grid gap-2">
                    <Label>Public Slug</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">careops.com/</span>
                        <Input defaultValue={workspace.slug} />
                    </div>
                </div>
                
                <div className="grid gap-2">
                    <Label>Public Booking URL</Label>
                    <div className="flex gap-2">
                         <div className="flex-1 bg-muted p-2 rounded border border-input text-sm items-center flex text-muted-foreground truncate">
                            {`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${workspace.slug}/book`}
                        </div>
                        {/* Improved copy button would go here */}
                        <Button variant="secondary" size="sm">Copy</Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Share this link with your customers.</p>
                </div>

                <Button>Save Changes</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Manage third-party connections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <div className="font-medium">Resend (Email)</div>
                        <div className="text-sm text-muted-foreground">Connected</div>
                    </div>
                    <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <div className="font-medium">Twilio (SMS)</div>
                        <div className="text-sm text-muted-foreground">Connected</div>
                    </div>
                    <Button variant="outline">Configure</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
