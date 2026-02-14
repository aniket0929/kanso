import { getWorkspace } from "@/lib/actions/workspace.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ExternalLink, Mail, MessageSquare, Terminal } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";

export default async function ConnectPage() {
    const workspace = await getWorkspace();
    if (!workspace) return null;

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/forms?wid=${workspace.id}`;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Connections</h1>
                <p className="text-muted-foreground text-lg">
                    Connect your existing forms and tools to CareOps.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* External Forms Card */}
                <Card className="md:col-span-2 lg:col-span-2 bg-card/50 backdrop-blur-xl border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-yellow-500" />
                            Universal Form Connector
                        </CardTitle>
                        <CardDescription>
                            Connect Google Forms, Typeform, or custom HTML forms to your dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 rounded-lg bg-black/20 border border-border/50 space-y-3">
                            <p className="text-md font-medium text-zinc-400">Your Webhook URL</p>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black/40 p-2 rounded border border-border/50 font-mono text-sm truncate items-center flex">
                                    {webhookUrl}
                                </div>
                                <CopyButton value={webhookUrl} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-md uppercase tracking-wider text-zinc-500">Quick Setup Guides</h3>
                            
                            <div className="grid gap-4 sm:grid-cols-2">
                                <a 
                                    href="https://workspace.google.com/marketplace/app/webhooks_for_forms/816155694200" 
                                    target="_blank"
                                    className="p-4 rounded-xl border border-border/50 hover:bg-white/5 transition group space-y-2"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-medium">Google Forms</div>
                                        <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-white transition" />
                                    </div>
                                    <p className="text-sm text-zinc-500 leading-relaxed">
                                        Use the "Webhooks for Forms" add-on to push submissions to CareOps instantly.
                                    </p>
                                </a>

                                <a 
                                    href="https://www.typeform.com/help/a/webhooks-360029571171/" 
                                    target="_blank"
                                    className="p-4 rounded-xl border border-border/50 hover:bg-white/5 transition group space-y-2"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-medium">Typeform</div>
                                        <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-white transition" />
                                    </div>
                                    <p className="text-sm text-zinc-500 leading-relaxed">
                                        Go to Connect {'->'} Webhooks in your Typeform dashboard and paste your URL.
                                    </p>
                                </a>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                             <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                <div className="p-1 rounded bg-blue-500/20 text-blue-500 mt-0.5">
                                    <MessageSquare className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-md font-medium">Auto-Mapping</p>
                                    <p className="text-sm text-zinc-500 leading-relaxed">
                                        Our system automatically finds `email`, `name`, and `message` fields. 
                                        Ensure your form at least has an "Email" field.
                                    </p>
                                </div>
                             </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Communication Channels Card */}
                <Card className="bg-card/50 backdrop-blur-xl border-border/50 self-start">
                    <CardHeader>
                        <CardTitle className="text-lg">Messaging Loop</CardTitle>
                        <CardDescription>
                            How CareOps handles the data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 font-bold text-sm border border-indigo-500/20">1</div>
                                <div className="space-y-1">
                                    <p className="text-md font-medium">Capture</p>
                                    <p className="text-sm text-zinc-500">Submission lands via Webhook.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 font-bold text-sm border border-purple-500/20">2</div>
                                <div className="space-y-1">
                                    <p className="text-md font-medium">Identify</p>
                                    <p className="text-sm text-zinc-500">New Contact & Conversation created.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 font-bold text-sm border border-emerald-500/20">3</div>
                                <div className="space-y-1">
                                    <p className="text-md font-medium">Respond</p>
                                    <p className="text-sm text-zinc-500">Auto-reply sent instantly via AI.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-2">
                            <div className="flex items-center gap-2 text-orange-500">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm font-bold uppercase">Setup Required</span>
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                                Ensure your Resend/Twilio keys are set in <strong>Settings</strong> to enable automated responses.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
