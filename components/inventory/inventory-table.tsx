"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, Edit2, AlertCircle } from "lucide-react";
import { format, isPast } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteInventoryItem } from "@/lib/actions/inventory.actions";
import { toast } from "sonner";
import { AddItemDialog } from "./add-item-dialog";

interface InventoryTableProps {
  items: any[];
  workspaceId: string;
}

export function InventoryTable({ items, workspaceId }: InventoryTableProps) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            await deleteInventoryItem(id);
            toast.success("Item deleted");
        } catch (e) {
            toast.error("Failed to delete");
        }
    }
  };

  const getStatus = (item: any) => {
    if (item.expiryDate && isPast(new Date(item.expiryDate))) {
        return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">Expired</Badge>;
    }
    if (item.currentStock <= item.lowStockThreshold) {
        return <Badge variant="destructive">Low Stock</Badge>;
    }
    return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Optimal</Badge>;
  };

  return (
    <div className="rounded-md border bg-card/50 backdrop-blur-xl border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                    <span>{item.currentStock} {item.unit}</span>
                    <span className="text-md text-muted-foreground text-italic">Threshold: {item.lowStockThreshold}</span>
                </div>
              </TableCell>
              <TableCell>
                {item.expiryDate ? format(new Date(item.expiryDate), "MMM dd, yyyy") : "-"}
              </TableCell>
              <TableCell>
                {getStatus(item)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <AddItemDialog workspaceId={workspaceId} item={item}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                    </AddItemDialog>
                    <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No inventory items found. Add your first tool or medicine!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
