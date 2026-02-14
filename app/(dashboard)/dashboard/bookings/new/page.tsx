import { getServices } from "@/lib/actions/booking.actions";
import { getWorkspace } from "@/lib/actions/workspace.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ManualBookingForm } from "@/components/bookings/manual-booking-form";
import { redirect } from "next/navigation";

export default async function NewBookingPage() {
    const workspace = await getWorkspace();
    if (!workspace) redirect("/onboarding");

    const services = await getServices(workspace.id);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">New Booking</h1>
                <p className="text-muted-foreground">
                    Manually schedule an appointment for a client.
                </p>
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl">
                <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                    <CardDescription>
                        This will bypass public availability checks if needed.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ManualBookingForm services={services} />
                </CardContent>
            </Card>
        </div>
    );
}
