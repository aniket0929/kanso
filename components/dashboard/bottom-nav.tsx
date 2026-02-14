"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Inbox, Calendar, FileText, Package, Settings, Users, Plug } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-fit max-w-[95vw]">
      <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            prefetch={true}
            className={cn(
              "flex items-center justify-center p-3 rounded-full transition-all hover:bg-white/10 group relative",
              pathname === route.href 
                ? "bg-white text-black" 
                : "text-white/60 hover:text-white"
            )}
            title={route.label}
          >
            <route.icon className="h-5 w-5" />
            
            {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/90 text-white text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
              {route.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
