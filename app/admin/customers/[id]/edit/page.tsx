"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { getCustomerById, updateCustomer } from "@/lib/api";

export default function EditCustomerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
  });

  // ✅ Fetch existing customer
  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        const res = await getCustomerById(id as string);
        const c = res.data;
        setFormData({
          name: c.name || "",
          email: c.email || "",
          phone: c.phone || "",
          whatsapp: c.whatsapp || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch customer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Handle update submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      router.prefetch(`/admin/customers/${id}`);
      const res = await updateCustomer(formData, id as string);
      toast.success(res.message || "Customer updated successfully!");
      router.push(`/admin/customers/${id}`);
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data?.message || "Failed to update customer."
        );
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="space-y-3 w-80">
          <div className="h-6 bg-muted rounded animate-pulse"></div>
          <div className="h-10 bg-muted rounded animate-pulse"></div>
          <div className="h-10 bg-muted rounded animate-pulse"></div>
          <div className="h-10 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/20 py-10 px-4">
      <Card className="w-full max-w-lg border border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-semibold text-foreground flex justify-between items-center">
            Edit Customer
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground transition"
            >
              ← Back
            </Button>
          </CardTitle>
          <CardDescription>Update customer information below</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@email.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0300-1234567"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="0300-1234567"
              />
            </div>

            <Button
              type="submit"
              disabled={updating}
              className="w-full mt-2 text-base font-medium"
            >
              {updating ? "Updating..." : "Update Customer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
