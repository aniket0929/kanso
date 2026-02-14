import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b border-border p-4 flex justify-between items-center bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="font-extrabold text-2xl tracking-tighter">Kanso</div>
        <div className="flex items-center gap-4">
          <OrganizationSwitcher afterCreateOrganizationUrl="/onboarding" />
          <UserButton />
        </div>
      </header>
      <main className="container mx-auto py-10 px-4 max-w-4xl">
        {children}
      </main>
    </div>
  );
}
