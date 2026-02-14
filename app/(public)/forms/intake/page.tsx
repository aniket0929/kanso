"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Suspense } from "react";
import { submitIntakeResponse } from "@/lib/actions/form.actions";

function IntakeFormContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("b");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!bookingId) return <div className="p-20 text-center text-zinc-500">Invalid Link.</div>;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            
            await submitIntakeResponse(bookingId, data);
            
            setSubmitted(true);
            toast.success("Thank you! Information received.");
        } catch (error) {
            toast.error("Failed to submit. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-white selection:bg-black selection:text-white relative">
                <Card className="max-w-md w-full border-border/50 bg-card backdrop-blur-none text-center relative z-10">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-16 w-16 text-black/20" />
                        </div>
                        <CardTitle className="text-2xl font-extrabold tracking-tight">Information Received</CardTitle>
                        <CardDescription className="font-medium">
                            Your details have been successfully linked to your booking. We'll see you soon!
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-[var(--section-gap)] px-[var(--side-padding)] relative selection:bg-black selection:text-white">
            <div className="max-w-2xl mx-auto space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight">
                        Pre-Visit Intake Form
                    </h1>
                    <p className="text-muted-foreground italic text-md">
                        Reference Booking ID: {bookingId}
                    </p>
                </div>

                <Card className="border-border/50 bg-card">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Medical & Consent Information</CardTitle>
                        <CardDescription>
                            This information helps us prepare for your visit.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="history">Medical History / Concerns</Label>
                                <Textarea 
                                    id="history" 
                                    name="medical_history"
                                    placeholder="Please describe any pre-existing conditions..." 
                                    className="h-32 bg-black/20"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="insurance">Insurance Provider</Label>
                                    <Input id="insurance" name="insurance_provider" placeholder="Blue Cross / Private" className="bg-white border-border/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="policy">Policy Number</Label>
                                    <Input id="policy" name="policy_number" placeholder="XYZ-123456" className="bg-white border-border/50" />
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-secondary border border-border/50 space-y-3">
                                <p className="text-md font-bold uppercase tracking-wider">Consent Agreement</p>
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" id="consent" required className="mt-1 accent-black" />
                                    <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                                        I agree to the terms and conditions and understand that my information is stored securely in accordance with local health regulations.
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 rounded-xl text-lg shadow-lg shadow-black/5" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Information
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function IntakeFormPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-500">Loading form...</div>}>
            <IntakeFormContent />
        </Suspense>
    );
}
