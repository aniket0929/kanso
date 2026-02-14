"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { submitContactForm } from "@/lib/actions/form.actions";

interface Field {
    id: string;
    type: "text" | "email" | "textarea" | "select";
    label: string;
    placeholder: string;
    required: boolean;
    options?: string[];
}

export function PublicFormClient({ form }: { form: any }) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // safe parsing
    const fields: Field[] = typeof form.fields === 'string' 
        ? JSON.parse(form.fields) 
        : form.fields;

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // We use the workspace slug for the public action, or should we update submitContactForm to take formId?
            // The existing submitContactForm takes (slug, data). 
            // We should use the workspace slug from the form.
            
            await submitContactForm(form.workspace.slug, data);
            setSubmitted(true);
            toast.success("Submitted successfully");
        } catch (error) {
            toast.error("Failed to submit form");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center">
                    <div className="h-20 w-20 bg-black/5 rounded-full flex items-center justify-center text-black">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-serif">Thank you!</h3>
                    <p className="text-muted-foreground italic">Your professional response has been securely recorded.</p>
                </div>
                <div className="pt-4">
                    <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full px-8 border-border/50">
                        Submit Another
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field) => (
                <div key={field.id} className="space-y-2.5">
                    <Label htmlFor={field.id} className="text-sm font-medium tracking-wide flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-destructive font-bold">*</span>}
                    </Label>
                    
                    {field.type === "textarea" ? (
                        <Textarea
                            id={field.id}
                            className="bg-secondary/20 border-border/50 focus:border-black/20 focus:ring-black/5 transition-all min-h-[140px] resize-none rounded-xl placeholder:italic placeholder:opacity-50"
                            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}...`}
                            required={field.required}
                            {...register(field.id, { required: field.required })}
                        />
                    ) : field.type === "select" ? (
                        <Select onValueChange={(val) => {
                             register(field.id).onChange({ target: { value: val, name: field.id } });
                        }}>
                           <SelectTrigger className="bg-secondary/20 border-border/50 focus:border-black/20 focus:ring-black/5 rounded-xl h-12 transition-all">
                               <SelectValue placeholder={field.placeholder || "Select an option"} />
                           </SelectTrigger>
                           <SelectContent className="bg-white border-border/50 shadow-xl rounded-xl">
                               {field.options?.map(opt => (
                                   <SelectItem key={opt} value={opt} className="focus:bg-secondary cursor-pointer py-3">{opt}</SelectItem>
                               ))}
                           </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            id={field.id}
                            type={field.type}
                            className="bg-secondary/20 border-border/50 focus:border-black/20 focus:ring-black/5 transition-all h-12 rounded-xl placeholder:italic placeholder:opacity-50"
                            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}...`}
                            required={field.required}
                            {...register(field.id, { required: field.required })}
                        />
                    )}
                </div>
            ))}

            <div className="pt-4">
                <Button type="submit" className="w-full h-14 bg-black hover:bg-black/90 text-white font-bold rounded-full shadow-xl shadow-black/10 transition-all text-lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Submit Response
                </Button>
            </div>
        </form>
    );
}
