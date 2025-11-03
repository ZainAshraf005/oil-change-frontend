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
import { Pencil } from "lucide-react";
import { updatePackageById } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface PackageEditProps {
  packageId: string;
  packageName: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  email_limit: number;
  sms_limit: number;
  whatsapp_limit: number;
  fetchPackages: () => void;
}

export default function PackageEdit({
  packageId,
  packageName,
  email_enabled,
  sms_enabled,
  whatsapp_enabled,
  email_limit,
  sms_limit,
  whatsapp_limit,
  fetchPackages,
}: PackageEditProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: packageName,
    email_enabled,
    sms_enabled,
    whatsapp_enabled,
    email_limit,
    sms_limit,
    whatsapp_limit,
  });

  const handleChange = (field: string, value: boolean | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    // Check at least one channel is enabled
    if (
      !formData.email_enabled &&
      !formData.sms_enabled &&
      !formData.whatsapp_enabled
    ) {
      toast.error(
        "At least one channel (Email, SMS, WhatsApp) must be enabled."
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email_enabled: formData.email_enabled,
        sms_enabled: formData.sms_enabled,
        whatsapp_enabled: formData.whatsapp_enabled,
        email_limit: formData.email_enabled
          ? Number(formData.email_limit) || 0
          : 0,
        sms_limit: formData.sms_enabled ? Number(formData.sms_limit) || 0 : 0,
        whatsapp_limit: formData.whatsapp_enabled
          ? Number(formData.whatsapp_limit) || 0
          : 0,
      };
      const data = await updatePackageById(packageId, payload);
      toast.success(data.message || "Package updated successfully");
      fetchPackages();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update package:", error);
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data?.message || "Failed to update package"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" size="icon-sm" variant={"outline"}>
          <Pencil size={8} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
          <DialogDescription className="pt-2 text-muted-foreground">
            Update package details for{" "}
            <span className="font-semibold text-foreground">{packageName}</span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          {/* Name */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Package Name</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Channels */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.email_enabled}
                onChange={(e) =>
                  handleChange("email_enabled", e.target.checked)
                }
              />
              Email
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.sms_enabled}
                onChange={(e) => handleChange("sms_enabled", e.target.checked)}
              />
              SMS
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.whatsapp_enabled}
                onChange={(e) =>
                  handleChange("whatsapp_enabled", e.target.checked)
                }
              />
              WhatsApp
            </label>
          </div>

          {/* Limits */}
          <div className="grid gap-2">
            {formData.email_enabled && (
              <div>
                <label className="text-sm font-medium">Email Limit</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={formData.email_limit}
                  onChange={(e) => handleChange("email_limit", e.target.value)}
                />
              </div>
            )}
            {formData.sms_enabled && (
              <div>
                <label className="text-sm font-medium">SMS Limit</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={formData.sms_limit}
                  onChange={(e) => handleChange("sms_limit", e.target.value)}
                />
              </div>
            )}
            {formData.whatsapp_enabled && (
              <div>
                <label className="text-sm font-medium">WhatsApp Limit</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={formData.whatsapp_limit}
                  onChange={(e) =>
                    handleChange("whatsapp_limit", e.target.value)
                  }
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="link" onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
