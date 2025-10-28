"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { updateProduct } from "@/lib/api";
import { computePrice, normalizeToLiters } from "@/lib/helpers/unit-conversion";

interface ProductEditProps {
  productId: string;
  productName: string;
  pricePerLiter: number;
  stockLitres: number;
  lowStockThreshold: number;
  fetchProducts: () => void;
}

export default function ProductEdit({
  productId,
  productName,
  pricePerLiter,
  stockLitres,
  lowStockThreshold,
  fetchProducts,
}: ProductEditProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(productName);
  const [price, setPrice] = useState(pricePerLiter);
  const [quantity, setQuantity] = useState(stockLitres);
  const [unit, setUnit] = useState<"L" | "ML">("L");
  const [lowStock, setLowStock] = useState(lowStockThreshold);
  const [loading, setLoading] = useState(false);

  // 🧠 Compute total price for display
  const total = computePrice(normalizeToLiters(quantity, unit), price);

  // 🧩 Prefill fields when dialog opens
  useEffect(() => {
    if (open) {
      setName(productName);
      setPrice(pricePerLiter);
      setQuantity(stockLitres);
      setLowStock(lowStockThreshold);
      setUnit("L");
    }
  }, [open, productName, pricePerLiter, stockLitres, lowStockThreshold]);

  // 🟢 Handle update
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const normalizedQuantity = normalizeToLiters(quantity, unit);

      const updatedData = {
        name,
        price_per_litre: price,
        stock_litres: normalizedQuantity,
        low_stock_threshold: lowStock,
      };

      const data = await updateProduct(updatedData, productId);

      toast.success(data.message || "Product updated successfully");
      fetchProducts();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to update product"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-transparent cursor-pointer" size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Shell Helix 5W-30"
            />
          </div>

          <div className="grid gap-2">
            <Label>Price per Liter</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
              />
            </div>
            <div>
              <Label>Unit</Label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as "L" | "ML")}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="L">Liters</option>
                <option value="ML">Milliliters</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Low Stock Threshold (Liters)</Label>
            <Input
              type="number"
              value={lowStock}
              onChange={(e) => setLowStock(+e.target.value)}
              placeholder="e.g. 5"
            />
          </div>

          <div className="rounded-md border p-2 text-sm">
            Auto price calculation example:{" "}
            {isFinite(total) ? total.toFixed(2) : "—"}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
