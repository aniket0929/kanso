"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { getAvailableSlots, createBooking } from "@/lib/actions/booking.actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select";

interface BookingWidgetProps {
    workspace: any;
    services: any[];
}

export function BookingWidget({ workspace, services }: BookingWidgetProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [details, setDetails] = useState({ name: "", email: "", phone: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Fetch slots when date or service changes
  const handleDateSelect = async (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedSlot(null);
    if (newDate && selectedService) {
        setLoadingSlots(true);
        const dateStr = format(newDate, "yyyy-MM-dd");
        try {
            const available = await getAvailableSlots(selectedService.id, dateStr);
            setSlots(available);
        } catch (e) {
            toast.error("Failed to load slots");
        } finally {
            setLoadingSlots(false);
        }
    }
  };

  const handleBooking = async () => {
      setBookingLoading(true);
      try {
          const booking = await createBooking({
              serviceId: selectedService.id,
              date: format(date!, "yyyy-MM-dd"),
              time: selectedSlot!, // "09:00"
              name: details.name,
              email: details.email,
              phone: details.phone
          });
          setBookingId(booking.id);
          setStep(4);
      } catch (e) {
          toast.error("Booking failed. Slot might be taken.");
      } finally {
          setBookingLoading(false);
      }
  };

  return (
    <Card className="w-full bg-card border-border/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden selection:bg-black selection:text-white">
      <CardContent className="p-8">
        {step === 1 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif tracking-tight">Select a Service</h2>
                <div className="grid gap-3">
                    {services.map(service => (
                        <div 
                            key={service.id}
                            onClick={() => { setSelectedService(service); setStep(2); handleDateSelect(new Date()); }}
                            className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition flex justify-between items-center"
                        >
                            <span className="font-medium">{service.name}</span>
                            <span className="text-sm text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" /> {service.duration}m
                            </span>
                        </div>
                    ))}
                    {services.length === 0 && <p className="text-muted-foreground">No services available.</p>}
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="outline" size="icon" onClick={() => setStep(1)} className="rounded-full h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                    <h2 className="text-2xl font-bold font-serif tracking-tight">Select Date & Time</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        className="rounded-md border mx-auto"
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    />
                    <div className="flex-1">
                        <h3 className="text-sm font-medium mb-3">Available Slots</h3>
                        <div className="min-h-[300px]">
                            {loadingSlots ? (
                                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                                    Loading slots...
                                </div>
                            ) : slots.length > 0 ? (
                                <Select onValueChange={setSelectedSlot} value={selectedSlot || ""}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            { label: "Morning", slots: slots.filter(s => parseInt(s.split(':')[0]) < 12) },
                                            { label: "Afternoon", slots: slots.filter(s => parseInt(s.split(':')[0]) >= 12 && parseInt(s.split(':')[0]) < 17) },
                                            { label: "Evening", slots: slots.filter(s => parseInt(s.split(':')[0]) >= 17) }
                                        ].map(group => group.slots.length > 0 && (
                                            <SelectGroup key={group.label}>
                                                <SelectLabel>{group.label}</SelectLabel>
                                                {group.slots.map(slot => (
                                                    <SelectItem key={slot} value={slot}>
                                                        {format(new Date(`2000-01-01T${slot}`), "h:mm a")}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                                    No slots available for this date.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-8">
                    <Button disabled={!selectedSlot} onClick={() => setStep(3)} className="rounded-full px-8 h-12 shadow-lg">Continue</Button>
                </div>
            </div>
        )}

        {step === 3 && (
             <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="outline" size="icon" onClick={() => setStep(2)} className="rounded-full h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                    <h2 className="text-2xl font-bold font-serif tracking-tight">Your Details</h2>
                </div>
                <div className="space-y-3">
                    <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input value={details.name} onChange={e => setDetails({...details, name: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input type="email" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Phone</Label>
                        <Input type="tel" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} />
                    </div>
                </div>
                <div className="flex justify-end pt-8">
                    <Button 
                        disabled={!details.name || !details.email || bookingLoading} 
                        onClick={handleBooking}
                        className="rounded-full px-10 h-12 shadow-xl"
                    >
                        {bookingLoading ? "Confirming..." : "Confirm Booking"}
                    </Button>
                </div>
            </div>
        )}

        {step === 4 && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in fade-in zoom-in duration-700">
                <div className="h-20 w-20 bg-black/5 rounded-full flex items-center justify-center text-black">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-bold font-serif tracking-tight">Booking Confirmed</h2>
                <p className="text-muted-foreground max-w-xs">
                    We have sent a confirmation to {details.email}.
                    Please complete the intake form to prepare for your visit.
                </p>
                <div className="flex flex-col items-center gap-4 w-full max-w-xs pt-4">
                     <Button className="w-full h-12 rounded-xl text-lg shadow-lg" onClick={() => window.location.href = `/forms/intake?b=${bookingId}`}>
                        Complete Intake Form
                    </Button>
                    <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => window.location.reload()}>
                        Book Another
                    </Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
