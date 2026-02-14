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
        <div className="space-y-8">
            <div className="space-y-3">
                <h1>New Booking</h1>
                <p className="text-muted-foreground text-lg">
                    Manually schedule an appointment for a client.
                </p>
            </div>

            <div className="max-w-4xl">
                <Card>
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
        </div>
    );
}
