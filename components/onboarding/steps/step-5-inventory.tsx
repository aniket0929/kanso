"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { createInventoryItem } from "@/lib/actions/inventory.actions";
import { Plus, Trash2, Package } from "lucide-react";

export function Step5Inventory({ onNext, workspaceId }: { onNext: () => void; workspaceId?: string }) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      items: [
        { name: "", quantity: "10", threshold: "2" }
      ]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  async function onSubmit(data: any) {
    if (!workspaceId) return;
    setLoading(true);
    try {
      // Add all items
      for (const item of data.items) {
        if (item.name) {
          await createInventoryItem(workspaceId, item);
        }
      }
      toast.success(`${data.items.length} items added!`);
      onNext();
    } catch (error) {
      toast.error("Failed to add items.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="bg-secondary/20 border-border/50 shadow-sm overflow-hidden group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-md font-serif font-bold opacity-40 uppercase tracking-widest">
                    <Package className="h-4 w-4" />
                    Item {index + 1}
                  </div>
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => remove(index)}
                      className="text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`items.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Gloves, Syringes, etc." {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.threshold`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low Stock Threshold</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 py-8 rounded-xl flex flex-col gap-2 hover:bg-secondary/30 transition-all border-border/60"
          onClick={() => append({ name: "", quantity: "10", threshold: "2" })}
        >
          <Plus className="h-6 w-6" />
          <span className="font-serif font-bold uppercase text-sm tracking-widest opacity-60">Add Another Item</span>
        </Button>

        <div className="flex justify-end pt-8 border-t border-border/30">
          <Button type="submit" disabled={loading} className="rounded-full px-12 h-12 shadow-lg">
            {loading ? "Adding..." : "Next: Staff"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
