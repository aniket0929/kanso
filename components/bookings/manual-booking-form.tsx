"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createBooking, getAvailableSlots } from "@/lib/actions/booking.actions";

const formSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  date: z.date(),
  time: z.string().min(1, "Please select a time"),
});

interface ManualBookingFormProps {
  services: any[];
}

export function ManualBookingForm({ services }: ManualBookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId: "",
      name: "",
      email: "",
      phone: "",
      time: "",
      date: undefined,
    },
  });

  async function onServiceOrDateChange(serviceId: string, date: Date | undefined) {
    if (!serviceId || !date) return;
    
    setFetchingSlots(true);
    try {
        const dateStr = format(date, "yyyy-MM-dd");
        const slots = await getAvailableSlots(serviceId, dateStr);
        setAvailableSlots(slots);
    } catch (error) {
        toast.error("Failed to fetch slots");
    } finally {
        setFetchingSlots(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await createBooking({
        ...values,
        date: format(values.date, "yyyy-MM-dd"),
        isManual: true,
      });
      toast.success("Booking created successfully!");
      router.refresh(); // Refresh data first
      setTimeout(() => {
        router.push("/dashboard/bookings");
      }, 500); // Give toast time to show
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
            <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="font-bold">Service</FormLabel>
                <Select 
                    onValueChange={(val) => {
                        field.onChange(val);
                        onServiceOrDateChange(val, form.getValues("date"));
                    }} 
                    defaultValue={field.value}
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                        {service.name} ({service.duration}m)
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel className="font-bold">Appointment Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                            field.onChange(date);
                            onServiceOrDateChange(form.getValues("serviceId"), date);
                        }}
                        disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0))
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="font-bold">Time Slot</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={fetchingSlots || !form.getValues("date")}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={fetchingSlots ? "Fetching..." : "Select time"} />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))
                    ) : (
                        <SelectItem value="none" disabled>No slots available</SelectItem>
                    )}
                    </SelectContent>
                </Select>
                <FormDescription>Availability based on service settings.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="space-y-8 pt-6 border-t">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="font-bold">Client Name</FormLabel>
                <FormControl>
                    <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="font-bold">Client Email</FormLabel>
                <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="font-bold">Client Phone (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <Button type="submit" className="w-full font-bold" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Booking
        </Button>
      </form>
    </Form>
  );
}
