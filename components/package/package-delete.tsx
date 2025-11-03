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
import { AlertTriangle, Trash } from "lucide-react";
import { deletePackageById } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface PackageDeleteProps {
  packageName?: string;
  packageId?: string;
  fetchPackages: () => void;
}

export default function PackageDelete({
  packageName,
  packageId,
  fetchPackages,
}: PackageDeleteProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const data = await deletePackageById(packageId!);
      toast.success(data.message || "Package deleted successfully");
      fetchPackages();
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete package:", error);
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data?.message || "Failed to delete package"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" size="sm" variant={"outline"}>
          <Trash />
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
            <span className="font-semibold text-foreground">
              {packageName || "this package"}
            </span>
            ? This action <strong>cannot be undone</strong>. All related data
            (assignments, usage counters, etc.) will be permanently removed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Step Back
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
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
