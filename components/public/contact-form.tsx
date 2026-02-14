"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitContactForm } from "@/lib/actions/form.actions";
import { CheckCircle2 } from "lucide-react";

export function ContactForm({ slug }: { slug: string }) {
  const [data, setData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.message) {
        toast.error("Please fill all fields");
        return;
    }

    setLoading(true);
    try {
        await submitContactForm(slug, data);
        setSubmitted(true);
    } catch (err) {
        toast.error("Failed to send message");
    } finally {
        setLoading(false);
    }
  };

  if (submitted) {
    return (
        <Card className="w-full bg-card border-border/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl selection:bg-black selection:text-white">
            <CardContent className="p-16 text-center space-y-6 animate-in fade-in zoom-in duration-700">
                <div className="h-20 w-20 bg-black/5 rounded-full flex items-center justify-center text-black mx-auto">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-bold font-serif">Message Sent</h2>
                <p className="text-muted-foreground">
                    Thank you for reaching out. We will get back to you shortly.
                </p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full bg-card border-border/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl selection:bg-black selection:text-white overflow-hidden">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Your name" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                    id="message" 
                    value={data.message} 
                    onChange={e => setData({...data, message: e.target.value})} 
                    placeholder="How can we help?" 
                    className="min-h-[120px]"
                />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-lg shadow-lg" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
