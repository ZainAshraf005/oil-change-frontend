"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCustomer } from "@/lib/api";

interface CustomerDeleteProps {
  customerName: string;
  customerId: string;
  fetchCustomers: () => void;
}

export default function CustomerDelete({
  customerName,
  customerId,
  fetchCustomers,
}: CustomerDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // TODO: Replace with actual API call to delete customer
      await deleteCustomer(customerId!);
      toast.success(`${customerName} has been deleted`);
      fetchCustomers();
    } catch {
      toast.error("Failed to delete customer");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full bg-transparent cursor-pointer"
          disabled={isDeleting}
          variant="outline"
        >
          Delete Customer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{customerName}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
