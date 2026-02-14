"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { createForm } from "@/lib/actions/form.actions";

export function Step4Forms({ onNext, workspaceId }: { onNext: () => void; workspaceId?: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "Client Intake Form",
      description: "Standard intake for new clients.",
    },
  });

  async function onSubmit(data: any) {
    if (!workspaceId) return;
    setLoading(true);
    try {
      // Create a default form with some preset fields for MVP
      const fields = [
        { id: "name", type: "text", label: "Full Name", required: true },
        { id: "notes", type: "textarea", label: "Notes", required: false },
      ];
      await createForm({ ...data, fields }, workspaceId);
      toast.success("Form created!");
      onNext();
    } catch (error) {
      toast.error("Failed to create form.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Form Name</FormLabel>
              <FormControl>
                <Input placeholder="Intake Form" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="p-4 bg-muted/20 rounded-lg text-sm text-muted-foreground">
          <p>For this prototype, we will automatically add "Full Name" and "Notes" fields.</p>
        </div>
        <div className="flex justify-end pt-8">
          <Button type="submit" disabled={loading} className="rounded-full px-12 h-12 shadow-lg">
            {loading ? "Creating..." : "Next: Inventory"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
