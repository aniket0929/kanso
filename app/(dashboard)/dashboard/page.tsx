import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentBookings } from "@/components/dashboard/recent-bookings";
import { RecentInbox } from "@/components/dashboard/recent-inbox";
import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1>Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Real-time overview of your clinical operations and patient engagement.
        </p>
      </div>
      <Separator />
      
      <StatsCards stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 space-y-2">
                <h3>Recent Bookings</h3>
                <p className="text-md text-muted-foreground">Your latest 10 scheduled appointments.</p>
            </div>
            <div className="p-6 pt-0 min-h-[400px]">
                <RecentBookings bookings={stats.recentBookings} />
            </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow flex flex-col">
            <div className="p-6 space-y-2">
                <h3>Live Inbox</h3>
                <p className="text-md text-muted-foreground">Recent unread or active conversations.</p>
            </div>
            <div className="p-6 pt-0 flex-1">
                <RecentInbox conversations={stats.recentInbox} />
            </div>
        </div>
      </div>
    </div>
  );
}
