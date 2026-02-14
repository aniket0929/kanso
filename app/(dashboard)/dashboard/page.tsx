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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your business operations.</p>
      </div>
      <Separator />
      
      <StatsCards stats={stats} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6">
                <h3 className="font-semibold leading-none tracking-tight">Recent Bookings</h3>
                <p className="text-sm text-muted-foreground pt-2">Latest 10 appointments.</p>
            </div>
            <div className="p-6 pt-0 min-h-[400px]">
                <RecentBookings bookings={stats.recentBookings} />
            </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow flex flex-col">
            <div className="p-6">
                <h3 className="font-semibold leading-none tracking-tight">Live Inbox</h3>
                <p className="text-sm text-muted-foreground pt-2">Recent unread or active threads.</p>
            </div>
            <div className="p-6 pt-0 flex-1">
                <RecentInbox conversations={stats.recentInbox} />
            </div>
        </div>
      </div>
    </div>
  );
}
