"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
    Plus, 
    Trash2, 
    GripVertical, 
    Settings2, 
    Save, 
    ArrowLeft,
    Type,
    Mail,
    AlignLeft,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { updateForm } from "@/lib/actions/form.actions";

interface Field {
    id: string;
    type: "text" | "email" | "textarea" | "select";
    label: string;
    placeholder: string;
    required: boolean;
    options?: string[];
}

export function FormBuilder({ form }: { form: any }) {
    const router = useRouter();
    const [name, setName] = useState(form.name);
    const [description, setDescription] = useState(form.description || "");
    const [fields, setFields] = useState<Field[]>(
        typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields
    );
    const [saving, setSaving] = useState(false);

    const addField = (type: Field["type"]) => {
        const newField: Field = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
            placeholder: `Enter ${type}...`,
            required: false,
            options: type === "select" ? ["Option 1", "Option 2"] : undefined,
        };
        setFields([...fields, newField]);
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const updateField = (id: string, updates: Partial<Field>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateForm(form.id, {
                name,
                description,
                fields: JSON.stringify(fields)
            });
            toast.success("Form updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save form");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Form</h1>
                        <p className="text-sm text-muted-foreground">Design your custom form fields</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Plus className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-start">
                {/* Editor Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Form Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-start">
                                <Label>Form Title</Label>
                                <Input 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="e.g. Patient Intake"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    placeholder="Optional description..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold px-1">Fields</h3>
                        </div>
                        
                        {fields.map((field, index) => (
                            <Card key={field.id} className="relative group border-border/50 hover:border-primary/50 transition-colors">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-hover:text-muted-foreground cursor-grab">
                                    <GripVertical className="h-4 w-4" />
                                </div>
                                <CardContent className="p-6 pl-12">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Field Label</Label>
                                                    <Input 
                                                        value={field.label}
                                                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Type</Label>
                                                    <div className="flex items-center gap-2 h-8 text-sm px-3 bg-muted/50 rounded-md border text-muted-foreground capitalize">
                                                        {field.type === 'text' && <Type className="h-3 w-3" />}
                                                        {field.type === 'email' && <Mail className="h-3 w-3" />}
                                                        {field.type === 'textarea' && <AlignLeft className="h-3 w-3" />}
                                                        {field.type === 'select' && <ChevronDown className="h-3 w-3" />}
                                                        {field.type}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox 
                                                        id={`req-${field.id}`} 
                                                        checked={field.required}
                                                        onCheckedChange={(checked) => updateField(field.id, { required: !!checked })}
                                                    />
                                                    <Label htmlFor={`req-${field.id}`} className="text-xs">Required</Label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() => removeField(field.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {fields.length === 0 && (
                            <div className="h-32 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm italic">
                                No fields added yet. Choose a field type on the right.
                            </div>
                        )}
                    </div>
                </div>

                {/* Toolbox */}
                <div className="space-y-6">
                    <Card className="sticky top-24 border-border/50 h-fit text-start">
                        <CardHeader>
                            <CardTitle className="text-lg">Toolbox</CardTitle>
                            <CardDescription>Click to add a field</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-2">
                            <Button variant="outline" className="justify-start gap-3 h-12" onClick={() => addField("text")}>
                                <Type className="h-4 w-4 text-blue-400" />
                                <span>Short Text</span>
                            </Button>
                            <Button variant="outline" className="justify-start gap-3 h-12" onClick={() => addField("email")}>
                                <Mail className="h-4 w-4 text-emerald-400" />
                                <span>Email Input</span>
                            </Button>
                            <Button variant="outline" className="justify-start gap-3 h-12" onClick={() => addField("textarea")}>
                                <AlignLeft className="h-4 w-4 text-purple-400" />
                                <span>Paragraph</span>
                            </Button>
                            <Button variant="outline" className="justify-start gap-3 h-12" onClick={() => addField("select")}>
                                <ChevronDown className="h-4 w-4 text-orange-400" />
                                <span>Dropdown Select</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
