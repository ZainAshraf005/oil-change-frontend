"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { updateShop } from "@/lib/api";
import { toast } from "sonner";
import type React from "react";
import { AxiosError } from "axios";
import { getShopById as getShopByIdAPI } from "@/lib/api";
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
import { FormSkeleton } from "@/components/skeletons/form-skeleton";

export default function ShopEditPage() {
  const router = useRouter();
  const { id } = useParams();

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

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setInitialLoading(true);
        const res = await getShopByIdAPI(id as string);
        const shopData = res.data;

        setShop({
          name: shopData.name || "",
          address: shopData.address || "",
        });

        setAdmin({
          name: shopData.user?.name || "",
          email: shopData.user?.email || "",
          password: "",
          phone: shopData.user?.phone || "",
        });
      } catch (err) {
        console.error("Failed to fetch shop:", err);
        toast.error("Failed to load shop details");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) fetchShop();
  }, [id]);

  const handleShopChange = (key: string, value: string) =>
    setShop((prev) => ({ ...prev, [key]: value }));

  const handleAdminChange = (key: string, value: string) => {
    if (key === "phone") {
      // Always start with +92
      if (!value.startsWith("+92"))
        value = "+92" + value.replace(/^\+?92?/, "");
      // Only digits allowed after +92
      value = "+92" + value.slice(3).replace(/\D/g, "");
      // Limit total length to 13 characters
      if (value.length > 13) return;
    }
    setAdmin((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shop.name || !admin.name || !admin.email) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate phone number format if entered
    if (admin.phone && !/^\+92\d{10}$/.test(admin.phone)) {
      toast.error(
        "Phone number must start with +92 and have 10 digits after it (e.g., +923001234567)"
      );
      return;
    }

    try {
      setLoading(true);
      router.prefetch("/super-admin/shops");
      const payload = { shop, admin };
      const res = await updateShop(id as string, payload);
      toast.success(res.message || "Shop updated successfully");
      router.push("/super-admin/shops");
    } catch (error) {
      if (error instanceof AxiosError && error.response)
        toast.error(error?.response?.data?.message || "Failed to update shop");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <FormSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 cursor-pointer">
        <Button variant="ghost" size="sm" asChild>
          <div onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </div>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Shop</h1>
        <p className="text-muted-foreground mt-1">
          Update shop and admin information
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
        {/* SHOP CARD */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>Update the shop details</CardDescription>
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

              <div className="bg-muted/50 rounded-lg p-4 mt-6">
                <p className="text-sm text-muted-foreground">
                  Update the shop information and admin details above.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ADMIN CARD */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Admin Information</CardTitle>
                <CardDescription>
                  Update the shop administrator details
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
                  Password
                </Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Leave empty to keep current password"
                  value={admin.password}
                  onChange={(e) =>
                    handleAdminChange("password", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPhone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  id="adminPhone"
                  placeholder="+923001234567"
                  value={admin.phone}
                  onChange={(e) => handleAdminChange("phone", e.target.value)}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-6">
                {loading ? "Updating..." : "Update Shop"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
