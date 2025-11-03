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
import { toast } from "sonner";
import { AxiosError } from "axios";
import { deleteVehicle } from "@/lib/api";

interface VehicleDeleteProps {
  vehicleId: string;
  fetchVehicles: () => void;
}

export default function VehicleDelete({
  vehicleId,
  fetchVehicles,
}: VehicleDeleteProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Delete
  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteVehicle(vehicleId);
      toast.success(res.message || "Vehicle deleted successfully");
      fetchVehicles();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to delete vehicle");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-transparent text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          variant="outline"
        >
          Delete Vehicle
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this vehicle? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
