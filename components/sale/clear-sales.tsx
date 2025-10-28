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

interface ClearAllSalesProps {
  vehicleName?: string;
  fetchSales: () => void;
}

export default function ClearAllSalesDialog({
  vehicleName,
  fetchSales,
}: ClearAllSalesProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClear = async () => {
    try {
      setLoading(true);
      fetchSales();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer bg-transparent"
        >
          Clear Sales
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Clear Sales
          </DialogTitle>
          <DialogDescription className="pt-2 text-muted-foreground">
            Are you sure you want to clear{" "}
            <span className="font-semibold capitalize text-foreground">
              all sales
            </span>{" "}
            for{" "}
            <span className="font-semibold capitalize text-foreground">
              {vehicleName || "this vehicle"}
            </span>
            ? This action <strong>cannot be undone</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={loading}
          >
            {loading ? "Clearing..." : "Clear All"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
