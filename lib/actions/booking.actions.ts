"use server";

import { db } from "@/lib/db";
import { addMinutes, format, isSameDay, parse, setHours, setMinutes } from "date-fns";
import { AutomationEngine, AUTOMATION_EVENTS } from "@/lib/automation/engine";
import { auth } from "@clerk/nextjs/server";

export async function getServices(workspaceId: string) {
    return await db.service.findMany({
        where: { workspaceId, isActive: true },
    });
}

export async function getAvailableSlots(serviceId: string, dateStr: string) {
    // dateStr format: "yyyy-MM-dd"
    const service = await db.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error("Service not found");

    const queryDate = parse(dateStr, "yyyy-MM-dd", new Date());
    const dayName = format(queryDate, "eeee").toLowerCase();

    // 1. Check if service is available on this day
    const availableDays = JSON.parse(service.availableDays || "[]") as string[];
    if (!availableDays.includes(dayName)) {
        return [];
    }

    // 2. Get Time Slots
    const timeSlots = JSON.parse(service.timeSlots || "[]") as { start: string; end: string }[];

    // 3. Get Existing Bookings
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await db.booking.findMany({
        where: {
            serviceId,
            scheduledAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
            status: { not: "cancelled" },
        },
    });

    // 3.5 Check Max Bookings Per Day
    if ((service as any).maxBookingsPerDay && existingBookings.length >= (service as any).maxBookingsPerDay) {
        return [];
    }

    // 4. Generate Slots
    const slots: string[] = [];
    const duration = service.duration;
    const buffer = (service as any).bufferTime || 0;
    const totalSlotBlock = duration + buffer;

    for (const slot of timeSlots) {
        const [startHour, startMinute] = slot.start.split(":").map(Number);
        const [endHour, endMinute] = slot.end.split(":").map(Number);

        let current = setMinutes(setHours(queryDate, startHour), startMinute);
        const end = setMinutes(setHours(queryDate, endHour), endMinute);

        while (addMinutes(current, duration) <= end) {
            const slotStart = current;
            const slotEnd = addMinutes(current, duration);
            // The block affected by this booking includes the buffer
            const blockEnd = addMinutes(current, totalSlotBlock);

            // Check collision with any existing booking
            const isTaken = existingBookings.some((booking) => {
                const bStart = booking.scheduledAt;
                // Existing booking also has its own duration + the service's buffer at that time
                const bEnd = addMinutes(booking.scheduledAt, booking.duration + buffer);

                // Overlap logic: (StartA < EndB) and (EndA > StartB)
                return (slotStart < bEnd && blockEnd > bStart);
            });

            if (!isTaken) {
                slots.push(format(current, "HH:mm"));
            }

            // Move by duration + buffer or a fixed interval? 
            // Usually we move by fixed intervals (e.g. 30m) or duration+buffer
            // Let's use 30 min intervals if duration is small, or duration + buffer for strict packing
            current = addMinutes(current, Math.max(30, totalSlotBlock));
        }
    }

    return slots;
}

export async function createBooking(data: any) {
    // data: { serviceId, name, email, phone, date, time, isManual?: boolean }
    const service = await db.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new Error("Service not found");

    const scheduledAt = parse(`${data.date} ${data.time}`, "yyyy-MM-dd HH:mm", new Date());

    // Create Contact
    let contact = await db.contact.findFirst({
        where: { workspaceId: service.workspaceId, email: data.email }
    });

    if (!contact) {
        contact = await db.contact.create({
            data: {
                workspaceId: service.workspaceId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                source: data.isManual ? "manual" : "booking",
            }
        });
    }

    // Create Booking
    const booking = await db.booking.create({
        data: {
            workspaceId: service.workspaceId,
            serviceId: service.id,
            contactId: contact.id,
            scheduledAt,
            duration: service.duration,
            status: "confirmed",
        }
    });

    // Trigger Automation
    const engine = new AutomationEngine(service.workspaceId);
    await engine.trigger(AUTOMATION_EVENTS.BOOKING_CREATED, {
        bookingId: booking.id,
        contact,
        service,
        startTime: booking.scheduledAt
    });

    return booking;
}

