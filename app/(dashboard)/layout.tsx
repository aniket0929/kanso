import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { BottomNav } from "@/components/dashboard/bottom-nav";

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
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-8 py-4">
          <Link href="/dashboard" className="text-2xl font-extrabold tracking-tighter font-logo">
            Kanso
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
