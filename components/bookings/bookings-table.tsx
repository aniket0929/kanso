"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { cancelBooking } from "@/lib/actions/booking-management.actions";
import { toast } from "sonner";
import { useState } from "react";
import { BookingDetailsDialog } from "./booking-details-dialog";

interface Booking {
  id: string;
  contact: { name: string; email: string | null; phone: string | null };
  service: { name: string; duration: number };
  scheduledAt: Date;
  status: string;
  formSubmissions?: any[];
}

interface BookingsTableProps {
  initialBookings: Booking[];
}

export function BookingsTable({ initialBookings }: BookingsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setLoading(id);
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error("Failed to cancel");
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "completed": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                <div>{booking.contact.name}</div>
                <div className="text-xs text-muted-foreground">{booking.contact.email || booking.contact.phone}</div>
              </TableCell>
              <TableCell>{booking.service.name}</TableCell>
              <TableCell>
                <div>{format(new Date(booking.scheduledAt), "MMM d, yyyy")}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(booking.scheduledAt), "h:mm a")}</div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(booking.status)} variant="outline">
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(booking.id)}
                    >
                      Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      setSelectedBooking(booking);
                      setDetailOpen(true);
                    }}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => handleCancel(booking.id)}
                        disabled={booking.status === "cancelled" || loading === booking.id}
                        className="text-red-600 focus:text-red-600"
                    >
                      Cancel Booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {initialBookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No bookings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <BookingDetailsDialog 
        booking={selectedBooking} 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
      />
    </div>
  );
}
