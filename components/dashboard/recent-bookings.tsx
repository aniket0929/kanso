import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentBookingsProps {
  bookings: any[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No recent bookings found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contact</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>
              <div className="font-medium">{booking.contact.name}</div>
              <div className="text-xs text-muted-foreground">{booking.contact.email}</div>
            </TableCell>
            <TableCell>{booking.service.name}</TableCell>
            <TableCell className="text-xs">
              {format(new Date(booking.scheduledAt), "MMM d, h:mm a")}
            </TableCell>
            <TableCell className="text-right">
              <Badge variant={
                booking.status === "confirmed" ? "default" :
                booking.status === "pending" ? "outline" :
                "secondary"
              }>
                {booking.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
