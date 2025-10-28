"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createShop } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  Store,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

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
      router.prefetch("/super-admin/shops");
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/super-admin/shops" prefetch>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Shop</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new shop with admin credentials
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>Configure the shop details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Shop Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="shopName"
                  placeholder="Premium Deluxe Motorspot"
                  value={shop.name}
                  onChange={(e) => handleShopChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="shopAddress"
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Input
                  id="shopAddress"
                  placeholder="123 Main Street, Lahore"
                  value={shop.address}
                  onChange={(e) => handleShopChange("address", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Admin Information</CardTitle>
                <CardDescription>
                  Create the shop administrator account
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="adminName"
                  placeholder="John Doe"
                  value={admin.name}
                  onChange={(e) => handleAdminChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  value={admin.email}
                  onChange={(e) => handleAdminChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="adminPassword"
                  className="flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="••••••••"
                  value={admin.password}
                  onChange={(e) =>
                    handleAdminChange("password", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPhone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  id="adminPhone"
                  placeholder="+1 (555) 000-0000"
                  value={admin.phone}
                  onChange={(e) => handleAdminChange("phone", e.target.value)}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-6">
                {loading ? "Creating..." : "Create Shop"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
