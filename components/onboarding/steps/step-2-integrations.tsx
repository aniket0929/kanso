"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateWorkspace } from "@/lib/actions/workspace.actions";
import { Checkbox } from "@/components/ui/checkbox";

export function Step2Integrations({ onNext, workspaceId }: { onNext: () => void; workspaceId?: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      enableEmail: true,
      enableSms: false,
    },
  });

  async function onSubmit(data: any) {
    if (!workspaceId) {
      toast.error("No workspace ID found. Please complete step 1.");
      return;
    }

    // MANDATORY CHECK: At least one channel must be enabled
    if (!data.enableEmail && !data.enableSms) {
        toast.error("At least one communication channel (Email or SMS) is mandatory.");
        return;
    }

    setLoading(true);
    try {
      // Serialize configs - using system defaults
      const emailConfig = data.enableEmail ? JSON.stringify({ provider: "system" }) : null;
      const smsConfig = data.enableSms ? JSON.stringify({ provider: "system" }) : null;

      await updateWorkspace(workspaceId, {
        emailConfig,
        smsConfig,
        onboardingStep: 2,
      });
      
      toast.success("Channels activated!");
      onNext();
    } catch (error) {
      toast.error("Failed to save integrations.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-secondary/30 border-border/50 shadow-sm rounded-xl transition-all hover:bg-secondary/40">
          <CardHeader className="py-6">
            <CardTitle className="text-base flex items-center gap-3">
              <FormField
                control={form.control}
                name="enableEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 rounded-md"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-lg font-serif font-bold cursor-pointer">
                        Email Notifications
                      </FormLabel>
                      <p className="text-sm text-muted-foreground italic">
                        Send booking confirmations and reminders via email.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-secondary/30 border-border/50 shadow-sm rounded-xl transition-all hover:bg-secondary/40">
          <CardHeader className="py-6">
            <CardTitle className="text-base flex items-center gap-3">
              <FormField
                control={form.control}
                name="enableSms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 rounded-md"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-lg font-serif font-bold cursor-pointer">
                        SMS Notifications
                      </FormLabel>
                      <p className="text-sm text-muted-foreground italic">
                        Instantly alert customers through SMS messages.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="flex justify-end pt-8">
          <Button type="submit" disabled={loading} className="rounded-full px-12 h-12 shadow-lg">
            {loading ? "Activating..." : "Next: Services"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
