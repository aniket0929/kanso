"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { completeOnboarding } from "@/lib/actions/workspace.actions";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { useClerk } from "@clerk/nextjs";

export function Step6Completion({ workspaceId }: { workspaceId?: string }) {
  const [loading, setLoading] = useState(false);
  const { openOrganizationProfile } = useClerk();
  const router = useRouter();

  async function onComplete() {
    if (!workspaceId) return;
    setLoading(true);
    try {
      await completeOnboarding(workspaceId);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to activate workspace.");
      console.error(error);
      setLoading(false);
    }
  }

  const handleInvite = () => {
    openOrganizationProfile();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-secondary/50 border-border/50 shadow-sm rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-3 font-serif">
            <Users className="h-5 w-5 text-black/40" /> Invite Your Team
          </CardTitle>
          <CardDescription className="italic">
            Add your staff members to help manage bookings and operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleInvite} className="rounded-full border-border/50 hover:bg-black/5 transition-colors font-medium">Manage Team (Clerk)</Button>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="h-20 w-20 bg-black/5 rounded-full flex items-center justify-center text-black">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-bold font-serif tracking-tight">You're All Set</h3>
          <p className="text-muted-foreground max-w-md italic">
            Your workspace is configured and ready for action. Click below to enter your dashboard.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t border-border/30">
        <Button onClick={onComplete} disabled={loading} size="lg" className="w-full sm:w-auto h-14 px-12 rounded-full text-lg shadow-xl">
          {loading ? "Activating..." : "Go to Dashboard"}
        </Button>
      </div>
    </div>
  );
}
