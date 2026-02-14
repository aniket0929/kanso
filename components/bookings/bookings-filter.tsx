"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { useTransition } from "react";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function BookingsFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentStatus = searchParams.get("status") || "all";
    const currentSearch = searchParams.get("search") || "";
    const currentDate = searchParams.get("date") || "";

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        startTransition(() => {
            router.push(pathname);
        });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name or email..." 
                    className="pl-9"
                    defaultValue={currentSearch}
                    onChange={(e) => {
                        const val = e.target.value;
                        // Debounce would be better, but let's keep it simple for now or use a form submit
                        // For now we'll update on change but the transition makes it smoother
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            updateFilter("search", (e.target as HTMLInputElement).value);
                        }
                    }}
                />
            </div>

            <div className="w-full md:w-[180px]">
                <Select value={currentStatus} onValueChange={(val) => updateFilter("status", val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed (Success)</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-auto">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full md:w-[240px] justify-start text-left font-normal",
                                !currentDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {currentDate ? format(new Date(currentDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={currentDate ? new Date(currentDate) : undefined}
                            onSelect={(date) => updateFilter("date", date ? format(date, "yyyy-MM-dd") : null)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {(currentStatus !== "all" || currentSearch || currentDate) && (
                <Button variant="ghost" onClick={clearFilters} className="h-10 px-2 lg:px-3">
                    Reset
                    <X className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
