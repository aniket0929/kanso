import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FormBuilder } from "@/components/forms/form-builder";

export default async function EditFormPage({ params }: { params: Promise<{ formId: string }> }) {
    const { formId } = await params;
    const form = await db.form.findUnique({
        where: { id: formId }
    });

    if (!form) return notFound();

    return (
        <div className="p-6 h-full overflow-y-auto">
            <FormBuilder form={form} />
        </div>
    );
}
