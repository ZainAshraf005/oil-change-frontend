"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  deleteAssignmentById,
  getShopById,
  updateShopStatus,
  type Shop,
} from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  Store,
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopDelete from "@/components/shop/shop-delete";
import { formatInTZ } from "@/lib/helpers/timezone";
import { AxiosError } from "axios";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DetailsSkeleton } from "@/components/skeletons/details-skeleton";

export default function ShopDetailsPage() {
  const { id } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const router = useRouter();

  const goToShops = () => router.push("/super-admin/shops");

  const handlePackageRemove = async () => {
    try {
      const data = await deleteAssignmentById(id as string);
      toast.success(data.message || "Package removed successfully");
      fetchShop();
    } catch (err) {
      if (err instanceof AxiosError)
        toast.error(err.response?.data?.message || "Failed to remove package");
    }
  };

  const handleStatusToggle = async () => {
    if (!shop) return;
    const newStatus = shop.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setUpdatingStatus(true);
    try {
      const res = await updateShopStatus(shop.id as string, newStatus);
      if (res.success) {
        toast.success(res.message);
        setShop(res.shop);
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const fetchShop = async () => {
    try {
      const res = await getShopById(id as string);
      setShop(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load shop details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchShop();
  }, [id]);

  if (loading) return <DetailsSkeleton />;

  if (!shop)
    return (
      <div className="text-center text-muted-foreground">
        Shop not found or inaccessible.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-2 cursor-pointer">
        <Button variant="ghost" size="sm" asChild>
          <div onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </div>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`${
              shop.status === "SUSPENDED" && "text-red-700"
            } text-3xl font-bold tracking-tight`}
          >
            {shop.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Shop details and configuration
          </p>
        </div>
        <div
          onMouseEnter={() => router.prefetch(`${id}/edit`)}
          className="flex gap-2"
        >
          <Button
            onClick={() => router.push(`${id}/edit`)}
            variant="outline"
            className="gap-2"
          >
            Edit Shop
          </Button>
          <ShopDelete
            shopId={id as string}
            shopName={shop.name}
            fetchShops={goToShops}
          />
        </div>
      </div>

      {/* 🟢 Shop Status Card */}
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Shop Status</CardTitle>
              <CardDescription>Current operational state</CardDescription>
            </div>
          </div>
          <Badge
            variant={shop.status === "ACTIVE" ? "outline" : "destructive"}
            className="px-3 py-1 text-sm cursor-pointer"
          >
            {shop.status}
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground cursor-pointer">
            {shop.status === "ACTIVE"
              ? "This shop is currently active and operational."
              : "This shop is currently suspended and not accessible by users."}
          </p>
          <Button
            variant={shop.status === "ACTIVE" ? "destructive" : "default"}
            disabled={updatingStatus}
            onClick={handleStatusToggle}
            className="cursor-pointer"
          >
            {updatingStatus ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {shop.status === "ACTIVE" ? "Suspend Shop" : "Activate Shop"}
          </Button>
        </CardContent>
      </Card>

      {/* 🔹 Shop Info + Admin Info */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Shop Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>Core shop details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Shop Name
              </p>
              <p className="text-base font-semibold capitalize">{shop.name}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Address
              </p>
              <p className="text-base capitalize">
                {shop.address || "Not provided"}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created At
              </p>
              <p className="text-base">{formatInTZ(shop.created_at!)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Admin Information</CardTitle>
                <CardDescription>Shop administrator details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Full Name
              </p>
              <p className="text-base font-semibold capitalize">
                {shop?.user?.name}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </p>
              <p className="text-base">{shop?.user?.email}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </p>
              <p className="text-base">{shop?.user?.phone || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Package (if any) */}
      {shop.package_assignment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Assigned Package</CardTitle>
                  <CardDescription>
                    Current subscription details
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={handlePackageRemove}
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                Remove Package
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Package Name
                </p>
                <Badge className="text-base py-1 px-3">
                  {shop.package_assignment.package.name}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </p>
                <p className="text-base">
                  {formatInTZ(shop.package_assignment.start_at)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Limits
                </p>
                <div className="space-y-1 text-sm">
                  <p>
                    📧 Email: {shop.package_assignment.package.email_limit}/
                    {shop.channel_usage?.emailUsed}
                  </p>
                  <p>
                    💬 SMS: {shop.package_assignment.package.sms_limit}/
                    {shop.channel_usage?.smsUsed}
                  </p>
                  <p>
                    📱 WhatsApp:
                    {shop.package_assignment.package.whatsapp_limit}/
                    {shop.channel_usage?.whatsappUsed}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Enabled Channels
                </p>
                <div className="flex flex-wrap gap-2">
                  {shop.package_assignment.package.email_enabled && (
                    <Badge variant="secondary">Email</Badge>
                  )}
                  {shop.package_assignment.package.sms_enabled && (
                    <Badge variant="secondary">SMS</Badge>
                  )}
                  {shop.package_assignment.package.whatsapp_enabled && (
                    <Badge variant="secondary">WhatsApp</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
