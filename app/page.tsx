"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
    ArrowRight, 
    CheckCircle2, 
    Zap,
    LayoutDashboard,
    ShieldCheck,
    Users,
    Activity,
    Calendar,
    MessageSquare,
    Box,
    Clock,
    Sparkles
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const steps = [
    { title: "Workspace", desc: "Define your clinical environment.", icon: <Box className="w-6 h-6" /> },
    { title: "Connect", desc: "Integrate Clerk & Twilio.", icon: <Zap className="w-6 h-6" /> },
    { title: "Services", desc: "Set treatments & durations.", icon: <Activity className="w-6 h-6" /> },
    { title: "Intake", desc: "Design clinical forms.", icon: <MessageSquare className="w-6 h-6" /> },
    { title: "Inventory", desc: "Set low-stock alerts.", icon: <Box className="w-6 h-6" /> },
    { title: "Team", desc: "Invite staff & roles.", icon: <Users className="w-6 h-6" /> },
    { title: "Test", desc: "Perfect your patient flows.", icon: <ShieldCheck className="w-6 h-6" /> },
    { title: "Go Live", desc: "Open your digital clinic.", icon: <Sparkles className="w-6 h-6" /> }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-x-hidden" ref={containerRef}>
      <main className="flex-1 relative">
        {/* Background Grid Pattern - Increased Visibility */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none -z-10" />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-[var(--side-padding)] text-center border-b border-black/5">
            <motion.div 
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="max-w-6xl mx-auto"
            >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-black/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-8 text-black/70">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-30"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                    </span>
                    The Future of Care Operations
                </motion.div>
                
                <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-9xl font-[900] tracking-tighter mb-8 leading-[0.85] text-gradient">
                    Unified.<br />
                    <span>Seamless.</span><br />
                    Operations.
                </motion.h1>

                <motion.p variants={fadeInUp} className="max-w-2xl mx-auto text-lg md:text-xl text-black/60 mb-12 leading-relaxed font-medium">
                    Kanso is the operating system for modern clinical service businesses. 
                    Replace fragmented tools with a single, high-performance platform.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
                    <Link href="/sign-up">
                        <Button size="lg" className="rounded-full h-16 px-10 text-xl font-bold bg-black text-white hover:bg-black/90 transition-all hover:scale-105 shadow-xl shadow-black/20 border-none">
                            Get Started
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="rounded-full h-16 px-10 text-xl font-bold border-black/20 bg-black/5 hover:bg-black/10 text-black transition-all">
                        Watch Movie
                    </Button>
                </motion.div>

                {/* Main Product Mockup / Bento Preview */}
                <motion.div 
                    variants={fadeInUp}
                    className="relative group pb-12"
                >
                    <div className="absolute -inset-4 bg-gradient-to-b from-black/10 via-transparent to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                    <Card className="glass overflow-hidden rounded-[2.5rem] border-black/20 shadow-2xl transition-transform duration-700 hover:scale-[1.01]">
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-black/10 bg-black/[0.03]">
                            <div className="w-3 h-3 rounded-full bg-black/20" />
                            <div className="w-3 h-3 rounded-full bg-black/20" />
                            <div className="w-3 h-3 rounded-full bg-black/20" />
                            <div className="ml-4 px-3 py-1 rounded bg-black/10 text-[10px] uppercase font-black text-black/50 tracking-widest">
                                Dashboard v2.0
                            </div>
                        </div>
                        <div className="p-8 md:p-12 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                                {/* Dashboard Mockup Elements */}
                                <div className="md:col-span-8 space-y-6">
                                    <div className="h-64 rounded-3xl bg-black/[0.03] border border-black/10 p-6 relative overflow-hidden">
                                        <Activity className="absolute bottom-[-10%] right-[-5%] w-48 h-48 text-black/[0.05] -rotate-12" />
                                        <div className="text-sm font-bold text-black/40 uppercase tracking-widest mb-4">Real-time Analytics</div>
                                        <div className="h-40 w-full flex items-end gap-2">
                                            {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55].map((h, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: 1 + i * 0.05, duration: 1 }}
                                                    className="flex-1 bg-black/10 hover:bg-black/30 rounded-t-sm transition-colors" 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="h-40 rounded-3xl bg-black/[0.02] border border-black/10 p-6">
                                            <div className="text-black/40 text-xs font-bold uppercase mb-2">Patient Intake</div>
                                            <div className="text-3xl font-bold font-mono text-black">248</div>
                                            <div className="text-black/60 text-xs mt-2 font-bold">+12.5% this week</div>
                                        </div>
                                        <div className="h-40 rounded-3xl bg-black/[0.02] border border-black/10 p-6">
                                            <div className="text-black/40 text-xs font-bold uppercase mb-2">Success Rate</div>
                                            <div className="text-3xl font-bold font-mono text-black">99.2%</div>
                                            <div className="text-black/60 text-xs mt-2 font-bold">Optimal efficiency</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-4 h-full min-h-[400px] rounded-3xl bg-black/[0.05] border border-black/10 p-6">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="text-sm font-bold text-black/50 uppercase tracking-widest">Active Jobs</div>
                                        <Calendar className="w-5 h-5 text-black/30" />
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map((j) => (
                                            <div key={j} className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-black/10 shadow-sm">
                                                <div className="w-10 h-10 rounded-full bg-black/5 text-black/60 flex items-center justify-center font-bold text-xs">
                                                    {j === 1 ? "MJ" : j === 2 ? "AS" : j === 3 ? "TK" : "RL"}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-black/80">Treatment #{1024 + j}</div>
                                                    <div className="text-[10px] text-black/40 uppercase font-black">In Progress</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </section>

        {/* Feature Grid - Bento Style */}
        <section className="py-32 px-[var(--side-padding)] relative overflow-hidden bg-black/[0.03] border-b border-black/5" id="features">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 text-center">
                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-black">Everything clinical.<br />All in one place.</h2>
                    <p className="text-xl text-black/50 max-w-xl mx-auto font-medium tracking-tight">Powerful tools designed for speed, precision, and the ultimate patient experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[800px]">
                    {/* Unified Inbox - Big Bento */}
                    <Card className="md:col-span-2 md:row-span-2 bg-white p-12 flex flex-col justify-between overflow-hidden group hover:border-black/30 transition-all duration-500 text-left border-black/10 shadow-md">
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center mb-8 border border-black/10 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all">
                                <MessageSquare className="w-7 h-7" />
                            </div>
                            <h3 className="text-4xl font-bold mb-6 tracking-tight text-black">Unified Inbox</h3>
                            <p className="text-black/60 text-lg leading-relaxed max-w-xs mb-8">
                                Every patient interaction, every channel, one beautiful stream. Email, SMS, and portal messages unified.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 font-bold text-black/70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-black/40" /> Multi-channel threading
                                </li>
                                <li className="flex items-center gap-3 font-bold text-black/70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-black/40" /> Agent-patient attribution
                                </li>
                            </ul>
                        </div>
                        <div className="absolute top-20 right-[-10%] w-[300px] opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                            <Activity className="w-full h-full text-black" />
                        </div>
                    </Card>

                    {/* Smart Scheduling */}
                    <Card className="md:col-span-2 bg-white p-10 flex flex-col justify-between group hover:border-black/30 transition-all duration-500 text-left border-black/10 shadow-md">
                        <div>
                            <Calendar className="w-8 h-8 text-black/50 mb-6 group-hover:text-black transition-colors" />
                            <h3 className="text-3xl font-bold mb-4 tracking-tight text-black">Smart Scheduling</h3>
                            <p className="text-black/50 text-md max-w-sm font-medium">Intelligent booking engine that optimizes clinician time and minimizes gaps.</p>
                        </div>
                        <div className="mt-8 flex gap-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`flex-1 h-3 rounded-full ${i <= 3 ? 'bg-black' : 'bg-black/10'}`} />
                            ))}
                        </div>
                    </Card>

                    {/* Inventory Management */}
                    <Card className="bg-white p-10 group hover:border-black/30 transition-all duration-500 text-left border-black/10 shadow-md">
                        <Box className="w-8 h-8 text-black/50 mb-6 group-hover:text-black transition-colors" />
                        <h3 className="text-2xl font-bold mb-4 tracking-tight text-black">Inventory Control</h3>
                        <p className="text-black/50 text-sm font-medium">Automatic low-stock alerts and integrated clinical supply tracking.</p>
                    </Card>

                    {/* Team Workspace */}
                    <Card className="bg-white p-10 group hover:border-black/30 transition-all duration-500 text-left border-black/10 shadow-md">
                        <Users className="w-8 h-8 text-black/50 mb-6 group-hover:text-black transition-colors" />
                        <h3 className="text-2xl font-bold mb-4 tracking-tight text-black">Team Workspace</h3>
                        <p className="text-black/50 text-sm font-medium">Role-based permissions and effortless collaboration for your entire clinic.</p>
                    </Card>
                </div>
            </div>
        </section>

        {/* Vertical Timeline - Steps */}
        <section className="py-32 px-[var(--side-padding)] bg-white border-b border-black/5" id="how-it-works">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-32">
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-black/50 mb-4 block">The Implementation</span>
                    <h2 className="text-5xl md:text-7xl font-[1000] tracking-tighter text-black">Zero-friction setup.</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {steps.map((step, i) => (
                        <motion.div 
                            key={i} 
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="absolute -top-6 -left-6 text-[120px] font-black text-black/[0.04] leading-none pointer-events-none group-hover:text-black/[0.08] transition-colors">
                                0{i+1}
                            </div>
                            <div className="relative z-10 p-8 rounded-[2rem] bg-white border border-black/10 h-full group-hover:border-black/30 transition-all duration-500 shadow-sm hover:shadow-xl text-left">
                                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center mb-6 border border-black/10 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all text-black">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 tracking-tight text-black">{step.title}</h3>
                                <p className="text-black/50 text-sm font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-48 px-[var(--side-padding)] relative text-center overflow-hidden border-t border-black/5 bg-black/[0.02]">
            <div className="absolute inset-0 bg-black/[0.02] -z-10" />
            
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-6xl md:text-9xl font-[1000] tracking-tighter mb-16 leading-[0.8] text-gradient">
                    Ready to scale<br />your excellence?
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href="/sign-up">
                        <Button size="lg" className="rounded-full h-20 px-16 text-3xl font-[1000] bg-black text-white hover:scale-105 transition-all shadow-2xl shadow-black/20 border-none">
                            Join Kanso
                        </Button>
                    </Link>
                    <Link href="/#problem">
                      <Button variant="outline" size="lg" className="rounded-full h-20 px-16 text-3xl font-bold border-black/20 bg-black/5 hover:bg-black/10 text-black transition-all">
                          Talk to Us
                      </Button>
                    </Link>
                </div>
            </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white pt-32 pb-12 px-[var(--side-padding)] text-left">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
                <div className="md:col-span-5 space-y-8">
                    <div className="text-4xl font-[1000] tracking-tighter text-black">KANSO.</div>
                    <p className="text-black/50 text-xl font-medium leading-relaxed max-w-sm">
                        Building the clinical infrastructure of the next century. Zen-like simplicity for high-performance care teams.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black/40 hover:text-black hover:border-black/40 transition-all cursor-pointer">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black/40 hover:text-black hover:border-black/40 transition-all cursor-pointer">
                            <Activity className="w-4 h-4" />
                        </div>
                        <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black/40 hover:text-black hover:border-black/40 transition-all cursor-pointer">
                            <Box className="w-4 h-4" />
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-black/30">Platform</h4>
                    <ul className="space-y-4 text-sm font-bold text-black/50">
                        <li><Link href="#features" className="hover:text-black transition-colors">Features</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Integrations</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Security</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Enterprise</Link></li>
                    </ul>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-black/30">Resources</h4>
                    <ul className="space-y-4 text-sm font-bold text-black/50">
                        <li><Link href="#" className="hover:text-black transition-colors">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Help Center</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Api Status</Link></li>
                    </ul>
                </div>
                <div className="md:col-span-3 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-black/30">Subscribe</h4>
                    <p className="text-black/40 text-sm mb-4">Get the latest updates on clinical ops.</p>
                    <div className="flex gap-2">
                        <input className="bg-black/[0.03] border border-black/20 rounded-xl px-4 py-2 text-sm flex-1 focus:outline-none focus:border-black/40 transition-colors" placeholder="Email" />
                        <Button size="sm" className="rounded-xl font-bold px-4 bg-black text-white hover:bg-black/90">Join</Button>
                    </div>
                </div>
            </div>
            <div className="pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-black/40 text-[10px] uppercase tracking-[0.4em] font-black">
                    &copy; 2026 KANSO OPS. ALL RIGHTS RESERVED. CLINICAL EXCELLENCE BY DESIGN.
                </div>
                <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-black/40">
                    <Link href="#" className="hover:text-black">Privacy</Link>
                    <Link href="#" className="hover:text-black">Terms</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
