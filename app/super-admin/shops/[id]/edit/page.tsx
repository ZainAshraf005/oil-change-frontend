"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { getShopById, updateShop } from "@/lib/api"; // you’ll define these

export default function ShopEditPage() {
  const router = useRouter();
  const { id } = useParams(); // ✅ get shop id from dynamic route
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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

  const handleShopChange = (key: string, value: string) =>
    setShop((prev) => ({ ...prev, [key]: value }));

  const handleAdminChange = (key: string, value: string) =>
    setAdmin((prev) => ({ ...prev, [key]: value }));

  // ✅ Fetch existing shop details
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await getShopById(id as string);
        const data = res.data;

        setShop({
          name: data.name || "",
          address: data.address || "",
        });

        setAdmin({
          name: data.user?.name || "",
          email: data.user?.email || "",
          password: "", // don't prefill password
          phone: data.user?.phone || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch shop details");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchShop();
  }, [id, router]);

  // ✅ Update shop handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shop.name || !admin.name || !admin.email) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = { shop, admin };
      console.log("Update payload:", payload);
      const res = await updateShop(id as string, payload);
      toast.success(res.message || "Shop updated successfully");
      router.back();
    } catch (error) {
      if (error instanceof AxiosError && error.response)
        toast.error(error.response.data?.message || "Failed to update shop");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-muted-foreground">
        Loading shop details...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Shop</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-8">
            {/* --- Left Column: Admin Info --- */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Admin Information</h2>

              <div className="grid gap-1">
                <Label htmlFor="adminName">Full Name *</Label>
                <Input
                  id="adminName"
                  placeholder="John Doe"
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
                <Label htmlFor="adminPassword">Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  value={admin.password}
                  onChange={(e) =>
                    handleAdminChange("password", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="adminPhone">Phone</Label>
                <Input
                  id="adminPhone"
                  placeholder="03001112233"
                  value={admin.phone}
                  onChange={(e) => handleAdminChange("phone", e.target.value)}
                />
              </div>
            </div>

            {/* --- Right Column: Shop Info --- */}
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

              {/* Update Button BELOW Shop Info */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 cursor-pointer"
              >
                {loading ? "Updating..." : "Update Shop"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
