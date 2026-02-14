"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Inbox, Calendar, FileText, Package, Settings, LogOut, Users, Plug } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Inbox", icon: Inbox, href: "/dashboard/inbox" },
  { label: "Bookings", icon: Calendar, href: "/dashboard/bookings" },
  { label: "Forms", icon: FileText, href: "/dashboard/forms" },
  { label: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { label: "Team", icon: Users, href: "/dashboard/team" },
  { label: "Connect", icon: Plug, href: "/dashboard/connect" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background border-r border-border/50 text-foreground">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="font-serif text-2xl font-bold tracking-tighter">Kanso</div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-black/[0.03] rounded-lg transition",
                pathname === route.href ? "text-foreground bg-black/5" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
          <SignOutButton>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-black/5 hover:text-foreground">
                <LogOut className="h-5 w-5 mr-3" />
                Logout
            </Button>
          </SignOutButton>
      </div>
    </div>
  );
}
