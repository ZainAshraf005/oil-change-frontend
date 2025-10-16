"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { deleteProduct } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ProductDeleteProps {
  productName?: string;
  productId?: string;
  fetchProducts: () => void;
}

export default function ProductDelete({
  productName,
  productId,
  fetchProducts,
}: ProductDeleteProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const data = await deleteProduct(productId!);
      toast.success(data.message || "Product deleted successfully");
      fetchProducts();
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Delete
          </DialogTitle>
          <DialogDescription className="pt-2 text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold capitalize text-foreground">
              {productName || "this product"}
            </span>
            ? This action <strong>cannot be undone</strong>. All related sales
            data associated with this product will be permanently removed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Step Back
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
