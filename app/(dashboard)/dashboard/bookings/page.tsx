import { getAllBookings } from "@/lib/actions/booking-management.actions";
import { BookingsTable } from "@/components/bookings/bookings-table";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { BookingHeaderActions } from "@/components/bookings/booking-header-actions";
import { BookingsFilter } from "@/components/bookings/bookings-filter";

export default async function BookingsPage({
    searchParams
}: {
    searchParams: Promise<{ status?: string; search?: string; date?: string }>
}) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return null;

  const filters = await searchParams;

  const workspace = await db.workspace.findUnique({
      where: { clerkOrgId: orgId }
  });

  if (!workspace) return null;

  const bookings = await getAllBookings(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">Manage your appointments and schedules.</p>
        </div>
        <BookingHeaderActions slug={workspace.slug} />
      </div>

      <BookingsFilter />

      <BookingsTable initialBookings={bookings || []} />
    </div>
  );
}
