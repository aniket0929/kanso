import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { RefreshButton } from "@/components/ui/refresh-button";

export default async function OnboardingPage() {
  const { userId, orgId, orgRole } = await auth();
  if (!userId) redirect("/sign-in");
  if (!orgId) return (
      <div className="flex items-center justify-center min-h-[60vh] text-center p-6">
          <div className="max-w-md space-y-4">
              <h1 className="text-2xl font-bold">Please select an Organization</h1>
              <p className="text-muted-foreground">Select or create an organization in the Clerk switcher to proceed with onboarding.</p>
          </div>
      </div>
  );

  const workspace = await db.workspace.findUnique({
      where: { clerkOrgId: orgId }
  });

  // If already active, move to dashboard
  if (workspace?.isActive && workspace?.onboardingStep === 6) {
      redirect("/dashboard");
  }

  // PROTECTION: Only admins/owners see the wizard. 
  // Members should wait for admin to finish setup.
  if (orgRole !== "org:admin") {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
            <div className="relative h-20 w-20">
                <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-5" />
                <div className="relative bg-white rounded-full h-full w-full flex items-center justify-center border-2 border-black/10">
                    <span className="text-2xl font-serif font-bold">K</span>
                </div>
            </div>
            <div className="max-w-md space-y-2">
                <h1 className="text-2xl font-bold font-serif">Workspace Setup in Progress</h1>
                <p className="text-muted-foreground">Your administrator is currently setting up the Kanso workspace. You'll be able to access the dashboard as soon as the setup is complete.</p>
            </div>
            <RefreshButton />
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight font-serif">Welcome to Kanso</h1>
        <p className="text-muted-foreground italic">Let's set up your operational workspace in a few simple steps.</p>
      </div>
      <OnboardingWizard />
    </div>
  );
}
