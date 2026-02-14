"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    ArrowRight, 
    CheckCircle2, 
    ExternalLink, 
    Mail, 
    MessageSquare, 
    Terminal,
    Zap,
    LayoutDashboard,
    ShieldCheck,
    Users
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-50">
        <div className="font-serif text-3xl font-bold tracking-tighter">Kanso</div>
        <div className="hidden md:flex gap-10 items-center">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/sign-in">
                <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/sign-up">
                <Button className="rounded-full px-6">Start Free Trial</Button>
            </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-20 text-center relative overflow-hidden">
            <motion.div 
                className="container mx-auto px-6"
                initial="initial"
                animate="animate"
                variants={fadeInUp}
            >
                <div className="inline-flex items-center rounded-full border border-black/5 bg-black/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-8">
                    Simplicity meets power
                </div>
                <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] tracking-tighter mb-8">
                    One Platform.<br />
                    <span>Zero Chaos.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
                    The unified operations platform for service businesses. Replace tool chaos with zen-like simplicity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <Link href="/sign-up">
                        <Button size="lg" className="rounded-full h-14 px-10 text-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-1">
                            Start Free Trial
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="rounded-full h-14 px-10 text-lg border-border hover:bg-black/5">
                        Watch Demo
                    </Button>
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="max-w-5xl mx-auto mt-12 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-black/5 to-black/5 blur-2xl rounded-[2.5rem]" />
                    <Card className="relative border-border/80 bg-white/50 backdrop-blur-2xl p-8 rounded-[2rem] overflow-hidden">
                        <div className="flex gap-2 mb-8 border-b border-border/50 pb-4">
                            <div className="w-3 h-3 rounded-full bg-border" />
                            <div className="w-3 h-3 rounded-full bg-border" />
                            <div className="w-3 h-3 rounded-full bg-border" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            {[
                                { label: "Today's Bookings", val: "12", trend: "↑ 23% from yesterday" },
                                { label: "New Inquiries", val: "8", trend: "↑ 5 since morning" },
                                { label: "Pending Forms", val: "3", trend: "Needs attention", alert: true }
                            ].map((stat, i) => (
                                <Card key={i} className="bg-secondary/50 border-border/50 p-6 transition-all hover:bg-white hover:border-black/20 hover:shadow-lg">
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</div>
                                    <div className="text-4xl font-bold mb-1">{stat.val}</div>
                                    <div className={`text-[10px] uppercase font-bold tracking-tighter ${stat.alert ? "animate-pulse" : "text-black/40"}`}>
                                        {stat.trend}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="mt-16 text-muted-foreground text-sm uppercase tracking-[0.2em] font-medium opacity-50">
                    Trusted by 500+ service businesses
                </div>
            </motion.div>
        </section>

        {/* Problem Section */}
        <section className="py-32 border-t border-border/50 bg-secondary/30" id="problem">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">The Problem</div>
                    <h2 className="font-serif text-5xl md:text-6xl tracking-tight mb-6">Your business runs on tool chaos</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Service businesses juggle 5-7 disconnected tools. The result? Missed leads, lost bookings, and zero visibility.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: "Lost in Email", desc: "Customer inquiries buried in Gmail. Follow-ups forgotten. Opportunities missed." },
                        { title: "Booking Confusion", desc: "Calendly doesn't talk to your CRM. Double bookings happen. Confirmations get lost." },
                        { title: "Form Hell", desc: "Google Forms scattered everywhere. No way to track completion. Manual follow-ups forever." },
                        { title: "Inventory Blindness", desc: "Excel spreadsheets out of date. Run out of supplies mid-service. No alerts." },
                        { title: "Team Silos", desc: "Staff work in the dark. Information doesn't flow. Everyone's asking 'did we follow up?'" },
                        { title: "No Visibility", desc: "Owners discover problems after they happen. Spend hours just to understand today." },
                    ].map((item, i) => (
                        <Card key={i} className="p-8 group hover:border-black transition-colors">
                            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Feature Showcase */}
        <section className="py-32" id="features">
            <div className="container mx-auto px-6">
                <div className="space-y-40">
                    {/* Unified Inbox */}
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h3 className="font-serif text-5xl tracking-tight">Unified Inbox</h3>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                All customer communication in one place. Email, SMS, form submissions—organized by contact. See the full history. Reply from anywhere.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Thread all messages by customer",
                                    "Smart automation that knows when to step back",
                                    "Organized history across every channel"
                                ].map((li, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg">
                                        <CheckCircle2 className="h-5 w-5 text-black/20" /> {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Card className="aspect-square bg-secondary p-12 flex items-center justify-center relative overflow-hidden">
                            <div className="w-full space-y-6">
                                <Card className="p-4 border-black/10 shadow-lg -rotate-2">
                                    <div className="text-sm font-bold">Jessica Martinez</div>
                                    <div className="text-xs text-muted-foreground uppercase mt-1">Email • 2m ago</div>
                                    <p className="text-sm mt-2">Hi! Yes, I'd love to book for next Tuesday...</p>
                                </Card>
                                <Card className="p-4 border-black/10 shadow-lg translate-x-12 rotate-3">
                                    <div className="text-sm font-bold">Mike Chen</div>
                                    <div className="text-xs text-muted-foreground uppercase mt-1">SMS • 15m ago</div>
                                    <p className="text-sm mt-2">Form completed ✓ Booking tomorrow at 2 PM</p>
                                </Card>
                                <Card className="p-4 border-black/10 shadow-lg -translate-x-12 opacity-50">
                                    <div className="text-sm font-bold">Sarah Johnson</div>
                                    <div className="text-xs text-muted-foreground uppercase mt-1">Form • 1h ago</div>
                                    <p className="text-sm mt-2">Quick question about pricing...</p>
                                </Card>
                            </div>
                        </Card>
                    </div>

                    {/* Smart Booking */}
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <Card className="order-2 md:order-1 aspect-square bg-secondary p-12 flex items-center justify-center">
                            <Card className="w-full max-w-sm p-8 space-y-6 border-black/10 shadow-2xl">
                                <div className="text-xl font-bold tracking-tight">Book Your Session</div>
                                <div className="grid grid-cols-2 gap-3">
                                    {["9:00 AM", "11:00 AM", "2:00 PM", "4:30 PM"].map((t, i) => (
                                        <div key={i} className={`p-4 rounded-lg text-center font-medium border ${t === "2:00 PM" ? "bg-black text-white border-black" : "bg-white border-black/5"}`}>
                                            {t}
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full h-12 rounded-xl">Confirm Time</Button>
                            </Card>
                        </Card>
                        <div className="order-1 md:order-2 space-y-8">
                            <h3 className="font-serif text-5xl tracking-tight">Smart Booking</h3>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Public booking pages that customers love. No login required. Instant confirmation. Your availability, always up to date.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Real-time availability sync",
                                    "Automatic confirmations and reminders",
                                    "Beautiful, mobile-friendly design"
                                ].map((li, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg">
                                        <CheckCircle2 className="h-5 w-5 text-black/20" /> {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works */}
        <section className="py-32 bg-secondary/50" id="how-it-works">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">How It Works</div>
                    <h2 className="font-serif text-5xl md:text-6xl tracking-tight mb-6">Up and running in 10 minutes</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Eight simple steps. One complete system. No technical expertise required.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        "Create Workspace", "Connect Tools", 
                        "Add Services", "Set Up Forms",
                        "Configure Inventory", "Invite Team",
                        "Review & Test", "Go Live ✨"
                    ].map((step, i) => (
                        <div key={i} className="text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold mx-auto">
                                {i + 1}
                            </div>
                            <div className="font-bold tracking-tight">{step}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 text-center relative border-t border-border/50">
            <div className="container mx-auto px-6">
                <h2 className="font-serif text-6xl md:text-7xl tracking-tighter mb-8">Ready to end the chaos?</h2>
                <p className="max-w-xl mx-auto text-xl md:text-2xl text-muted-foreground mb-12">
                    Start your 14-day free trial. No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/sign-up">
                        <Button size="lg" className="rounded-full h-16 px-12 text-xl shadow-xl">
                            Start Free Trial
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="rounded-full h-16 px-12 text-xl border-border">
                        Schedule Demo
                    </Button>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div className="space-y-6">
                    <div className="font-serif text-2xl font-bold tracking-tighter">Kanso</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        The unified operations platform for service businesses. Replace tool chaos with zen-like simplicity.
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="font-bold text-sm uppercase tracking-widest">Product</div>
                    <ul className="space-y-4 text-sm text-muted-foreground">
                        <li><Link href="#features" className="hover:text-black transition-colors">Features</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Integrations</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Changelog</Link></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <div className="font-bold text-sm uppercase tracking-widest">Company</div>
                    <ul className="space-y-4 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-black transition-colors">About</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Blog</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Careers</Link></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <div className="font-bold text-sm uppercase tracking-widest">Resources</div>
                    <ul className="space-y-4 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-black transition-colors">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Help Center</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Status</Link></li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-border/50 text-center text-muted-foreground text-xs uppercase tracking-widest font-semibold">
                &copy; 2026 Kanso. All rights reserved. Built with simplicity in mind.
            </div>
        </div>
      </footer>
    </div>
  );
}
