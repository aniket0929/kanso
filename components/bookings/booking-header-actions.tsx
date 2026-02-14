"use client";

import { Button } from "@/components/ui/button";
import { Link2, Plus, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function BookingHeaderActions({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        const url = `${window.location.origin}/${slug}/book`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Booking link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" onClick={onCopy} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                Copy Booking Link
            </Button>
            <Button asChild>
                <Link href="/dashboard/bookings/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Booking
                </Link>
            </Button>
        </div>
    );
}
