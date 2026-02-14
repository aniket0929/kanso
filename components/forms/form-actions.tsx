"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Settings2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export function FormActions({ formId }: { formId: string }) {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        const url = `${window.location.origin}/forms/${formId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" asChild title="Edit Form">
                <Link href={`/dashboard/forms/${formId}/edit`}>
                    <Settings2 className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild title="Open Public Page">
                <Link href={`/forms/${formId}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    );
}
