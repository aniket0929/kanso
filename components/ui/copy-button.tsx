"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I'll check

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    value: string;
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
    const [hasCopied, setHasCopied] = React.useState(false);

    React.useEffect(() => {
        if (hasCopied) {
            const timeout = setTimeout(() => {
                setHasCopied(false);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [hasCopied]);

    const onCopy = () => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
        toast.success("Copied to clipboard!");
    };

    return (
        <Button
            size="icon"
            variant="ghost"
            className={cn("h-8 w-8", className)}
            onClick={onCopy}
            {...props}
        >
            {hasCopied ? (
                <Check className="h-4 w-4" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy</span>
        </Button>
    );
}
