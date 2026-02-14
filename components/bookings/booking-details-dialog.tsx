"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, Clock, User, Mail, Phone, FileText, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface BookingDetailsDialogProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailsDialog({ booking, open, onOpenChange }: BookingDetailsDialogProps) {
  if (!booking) return null;

  const renderFormData = () => {
    if (!booking.formSubmissions || booking.formSubmissions.length === 0) {
      return <p className="text-md text-muted-foreground italic">No intake form data available.</p>;
    }

    return booking.formSubmissions.map((submission: any) => {
      let data: Record<string, string> = {};
      let fields = [];
      try {
        data = JSON.parse(submission.data);
        fields = JSON.parse(submission.form.fields);
      } catch (e) {
        return null;
      }

      return (
        <div key={submission.id} className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-md font-serif font-bold uppercase tracking-widest opacity-40">
            <FileText className="h-4 w-4" />
            {submission.form.name}
          </div>
          <div className="grid gap-4">
            {fields.map((field: any) => (
              <div key={field.id} className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-tight">{field.label}</p>
                <p className="text-md border-l-2 border-black/5 pl-3 py-1 bg-secondary/10 rounded-r-md">
                  {data[field.id] || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 bg-secondary/30 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2 opacity-50">
             <Package className="h-4 w-4" />
             <span className="text-sm font-serif font-bold uppercase tracking-[0.2em]">Booking Record</span>
          </div>
          <DialogTitle className="text-3xl font-serif font-bold tracking-tight">
            Appointment Details
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="p-8 max-h-[60vh]">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column: Customer & Timing */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h4 className="flex items-center gap-2 text-md font-serif font-bold uppercase tracking-widest opacity-40">
                  <User className="h-4 w-4" /> Customer Profile
                </h4>
                <div className="space-y-3">
                  <div className="text-xl font-bold">{booking.contact.name}</div>
                  <div className="flex items-center gap-2 text-md text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> {booking.contact.email || "No email"}
                  </div>
                  {booking.contact.phone && (
                    <div className="flex items-center gap-2 text-md text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> {booking.contact.phone}
                    </div>
                  )}
                </div>
              </section>

              <Separator className="bg-border/30" />

              <section className="space-y-4">
                <h4 className="flex items-center gap-2 text-md font-serif font-bold uppercase tracking-widest opacity-40">
                  <Clock className="h-4 w-4" /> Timing & Service
                </h4>
                <div className="space-y-4">
                  <div className="bg-black text-white px-4 py-3 rounded-xl inline-block shadow-lg">
                    <div className="text-sm opacity-60 uppercase tracking-widest mb-1 font-bold">Scheduled for</div>
                    <div className="font-serif text-lg">
                      {format(new Date(booking.scheduledAt), "EEEE, MMMM do")}
                    </div>
                    <div className="text-2xl font-bold">
                      {format(new Date(booking.scheduledAt), "h:mm a")}
                    </div>
                  </div>
                  
                  <div className="space-y-1 pt-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase">Service</p>
                    <p className="text-lg font-bold">{booking.service.name}</p>
                    <p className="text-md text-muted-foreground italic">{booking.service.duration} minute session</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Form Data */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h4 className="flex items-center gap-2 text-md font-serif font-bold uppercase tracking-widest opacity-40">
                  <FileText className="h-4 w-4" /> Professional Intake
                </h4>
                <div className="bg-secondary/20 rounded-2xl p-6 border border-border/30">
                  {renderFormData()}
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-6 bg-secondary/10 border-t border-border/50 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-8">
            Close Record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
