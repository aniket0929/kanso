import { Sidebar } from "@/components/dashboard/sidebar";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { orgId } = await auth();
  
  if (!orgId) {
      redirect("/onboarding");
  }

  const workspace = await db.workspace.findUnique({
      where: { clerkOrgId: orgId }
  });

  if (!workspace || !workspace.isActive || workspace.onboardingStep < 6) {
      redirect("/onboarding");
  }

  return (
    <div className="h-full relative font-[family-name:var(--font-geist-sans)]">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-[#111827]">
        <Sidebar />
      </div>
      <main className="md:pl-72 h-full">
        <div className="flex items-center justify-end p-4 border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <UserButton afterSignOutUrl="/" />
        </div>
        <div className="p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
