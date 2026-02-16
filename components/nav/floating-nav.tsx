"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function FloatingNav() {
  const pathname = usePathname();
  
  // Don't show on dashboard pages (they have their own nav) or form pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/forms')) return null;
  
  return (
    <motion.div 
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-8 left-1/2 z-[100] w-fit max-w-[95vw]"
    >
      <nav className="flex items-center gap-10 px-10 py-4 rounded-full bg-black backdrop-blur-2xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] text-white group hover:border-white/20 transition-all duration-500">
        <Link href="/" className="text-3xl font-[1000] tracking-tighter hover:scale-105 transition-transform font-logo text-white">
          KANSO.
        </Link>
        <div className="hidden md:flex gap-10 items-center border-l border-white/10 pl-10">
            <Link href="/#features" className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">Features</Link>
            <Link href="/#how-it-works" className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">Workflow</Link>
            <div className="w-px h-5 bg-white/10" />
            <Link href="/sign-in" className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all">Sign In</Link>
            <Link href="/sign-up">
                <Button size="sm" className="rounded-full px-8 h-10 font-black uppercase tracking-[0.2em] text-[10px] bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 border-none transition-all hover:scale-105 active:scale-95">
                  Join
                </Button>
            </Link>
        </div>
      </nav>
      {/* Subtle glow underneath */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/5 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
