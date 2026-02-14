"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { createService } from "@/lib/actions/service.actions";
import { Textarea } from "@/components/ui/textarea";

export function Step3Services({ onNext, workspaceId }: { onNext: () => void; workspaceId?: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      duration: "30",
    },
  });

  async function onSubmit(data: any) {
    if (!workspaceId) return;
    setLoading(true);
    try {
      await createService(workspaceId, data);
      toast.success("Service created!");
      onNext();
    } catch (error) {
      toast.error("Failed to create service.");
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
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Consultation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
                <Textarea placeholder="Details about this service..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-8">
          <Button type="submit" disabled={loading} className="rounded-full px-12 h-12 shadow-lg">
            {loading ? "Creating..." : "Next: Forms"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
