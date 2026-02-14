import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicFormClient } from "@/components/forms/public-form-client";

export default async function PublicFormPage({ params }: { params: Promise<{ formId: string }> }) {
    const { formId } = await params;
    const form = await db.form.findUnique({
        where: { id: formId },
        include: { workspace: true }
    });

    if (!form || !form.isActive) return notFound();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden selection:bg-black selection:text-white">
            <div className="max-w-xl w-full space-y-8 relative z-10">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary border border-border/50 mb-4 font-serif font-bold text-xl">
                        {form.workspace.name[0]}
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground font-serif">
                        {form.workspace.name}
                    </h1>
                </div>

                <Card className="border-border/50 bg-card shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                    <CardHeader className="space-y-1 pb-6 border-b border-border/30">
                        <CardTitle className="text-2xl font-bold font-serif tracking-tight">{form.name}</CardTitle>
                        {form.description && (
                            <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                                {form.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="pt-8">
                        <PublicFormClient form={form} />
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground font-medium tracking-widest flex items-center justify-center gap-1.5 opacity-60 uppercase">
                    <span>Powered by</span>
                    <span className="font-serif font-bold text-foreground">Kanso</span>
                </p>
            </div>
        </div>
    );
}
