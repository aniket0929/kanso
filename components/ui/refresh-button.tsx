"use client";

import { Button } from "@/components/ui/button";

export function RefreshButton() {
    return (
        <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
        </Button>
    );
}
