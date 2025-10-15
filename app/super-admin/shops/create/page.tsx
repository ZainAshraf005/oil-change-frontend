"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createShop } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function CreateShopPage() {
  const router = useRouter();

  const [shop, setShop] = useState({
    name: "",
    address: "",
  });

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleShopChange = (key: string, value: string) =>
    setShop((prev) => ({ ...prev, [key]: value }));

  const handleAdminChange = (key: string, value: string) =>
    setAdmin((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shop.name || !admin.name || !admin.email || !admin.password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = { shop, admin };
      const res = await createShop(payload);
      setAdmin({ name: "", email: "", password: "", phone: "" });
      setShop({ name: "", address: "" });
      toast.success(res.message || "Shop created successfully");
      router.push("/super-admin/shops");
    } catch (error) {
      if (error instanceof AxiosError && error.response)
        toast.error(error?.response?.data?.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Shop</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2  gap-8">
            {/* --- Left Column: Shop Info --- */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Admin Information</h2>

              <div className="grid gap-1">
                <Label htmlFor="adminName">Full Name *</Label>
                <Input
                  id="adminName"
                  placeholder="john doe"
                  value={admin.name}
                  onChange={(e) => handleAdminChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="adminEmail">Email *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="mail@example.com"
                  value={admin.email}
                  onChange={(e) => handleAdminChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="adminPassword">Password *</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="password"
                  value={admin.password}
                  onChange={(e) =>
                    handleAdminChange("password", e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="adminPhone">Phone</Label>
                <Input
                  id="adminPhone"
                  placeholder="090078601"
                  value={admin.phone}
                  onChange={(e) => handleAdminChange("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Shop Information</h2>

              <div className="grid gap-1">
                <Label htmlFor="shopName">Shop Name *</Label>
                <Input
                  id="shopName"
                  placeholder="Premium Deluxe Motorspot"
                  value={shop.name}
                  onChange={(e) => handleShopChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="shopAddress">Address</Label>
                <Input
                  id="shopAddress"
                  placeholder="123 Main Street, Lahore"
                  value={shop.address}
                  onChange={(e) => handleShopChange("address", e.target.value)}
                />
              </div>

              {/* Create Shop Button BELOW Shop Info */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 cursor-pointer"
              >
                {loading ? "Creating..." : "Create Shop"}
              </Button>
            </div>

            {/* --- Right Column: Admin Info --- */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
