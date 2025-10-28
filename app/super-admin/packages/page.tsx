"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createPackage, getPackages, Package } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import PackageDelete from "@/components/package/package-delete";
import PackageEdit from "@/components/package/package-update";
import PackageSkeleton from "@/components/skeletons/package-skeleton";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email_enabled: false,
    sms_enabled: false,
    whatsapp_enabled: false,
    email_limit: "",
    sms_limit: "",
    whatsapp_limit: "",
  });

  const fetchPackages = async () => {
    try {
      const res = await getPackages();
      setPackages(res.packages);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: boolean | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    try {
      const data = await createPackage(payload);
      toast.success(data.message || "Package created successfully");
      fetchPackages();
      setFormData({
        name: "",
        email_enabled: false,
        sms_enabled: false,
        whatsapp_enabled: false,
        email_limit: "",
        sms_limit: "",
        whatsapp_limit: "",
      });
    } catch (error) {
      console.error("Failed to create package:", error);
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data?.message || "Failed to create package"
        );
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <>
        <PackageSkeleton />
      </>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {/* Left Side */}
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Packages</h1>
        <div className="rounded-lg border p-4 text-sm text-muted-foreground space-y-2">
          {packages.length === 0 ? (
            <p>No packages available.</p>
          ) : (
            packages.map((pkg: Package) => (
              <div
                key={pkg.id}
                className="border rounded p-2 flex justify-between items-center"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{pkg.name}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {pkg.email_enabled && <span>Email: {pkg.email_limit}</span>}
                    {pkg.sms_enabled && <span>SMS: {pkg.sms_limit}</span>}
                    {pkg.whatsapp_enabled && (
                      <span>WhatsApp: {pkg.whatsapp_limit}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <PackageEdit
                    packageName={pkg.name}
                    packageId={pkg.id as string}
                    fetchPackages={fetchPackages}
                    email_enabled={pkg.email_enabled}
                    sms_enabled={pkg.sms_enabled}
                    whatsapp_enabled={pkg.whatsapp_enabled}
                    email_limit={pkg.email_limit}
                    sms_limit={pkg.sms_limit}
                    whatsapp_limit={pkg.whatsapp_limit}
                  />
                  <PackageDelete
                    packageName={pkg.name}
                    packageId={pkg.id as string}
                    fetchPackages={fetchPackages}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side */}
      <Card>
        <CardHeader>
          <CardTitle>Create / Edit Package</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                placeholder="Standard"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="email_enabled"
                  checked={formData.email_enabled}
                  onCheckedChange={(checked: boolean) =>
                    handleChange("email_enabled", Boolean(checked))
                  }
                />
                <Label htmlFor="email_enabled">Email</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sms_enabled"
                  checked={formData.sms_enabled}
                  onCheckedChange={(checked) =>
                    handleChange("sms_enabled", Boolean(checked))
                  }
                />
                <Label htmlFor="sms_enabled">SMS</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="whatsapp_enabled"
                  checked={formData.whatsapp_enabled}
                  onCheckedChange={(checked) =>
                    handleChange("whatsapp_enabled", Boolean(checked))
                  }
                />
                <Label htmlFor="whatsapp_enabled">WhatsApp</Label>
              </div>
            </div>

            {/* Conditional Inputs */}
            <div className="grid gap-3">
              {formData.email_enabled && (
                <div className="grid gap-1">
                  <Label>Email Limit</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 1000"
                    value={formData.email_limit}
                    onChange={(e) =>
                      handleChange("email_limit", e.target.value)
                    }
                  />
                </div>
              )}

              {formData.sms_enabled && (
                <div className="grid gap-1">
                  <Label>SMS Limit</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={formData.sms_limit}
                    onChange={(e) => handleChange("sms_limit", e.target.value)}
                  />
                </div>
              )}

              {formData.whatsapp_enabled && (
                <div className="grid gap-1">
                  <Label>WhatsApp Limit</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 200"
                    value={formData.whatsapp_limit}
                    onChange={(e) =>
                      handleChange("whatsapp_limit", e.target.value)
                    }
                  />
                </div>
              )}
            </div>

            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
