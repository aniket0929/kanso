import { OrganizationProfile } from "@clerk/nextjs";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
            <p className="text-muted-foreground">Invite and manage your staff members.</p>
        </div>
      </div>

      <div className="flex justify-center">
        <OrganizationProfile routing="hash" />
      </div>
    </div>
  );
}
