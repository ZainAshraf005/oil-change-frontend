"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { deleteAssignmentById, getShopById, Shop } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopDelete from "@/components/shop-delete";
import { formatInTZ } from "@/lib/helpers/timezone";
import { AxiosError } from "axios";

export default function ShopDetailsPage() {
  const { id } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const goToShops = () => {
    router.push("/super-admin/shops");
  };

  const handlePackageRemove = async () => {
    try {
      const data = await deleteAssignmentById(id as string);
      toast.success(data.message || "Shop deleted successfully");
      fetchShop();
    } catch (err) {
      if (err instanceof AxiosError)
        toast.error(err.response?.data?.message || "Failed to delete shop");
    }
  };
  const fetchShop = async () => {
    try {
      const res = await getShopById(id as string);
      console.log(res);
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );

  if (!shop)
    return (
      <div className="text-center text-muted-foreground">
        Shop not found or inaccessible.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card>
        <div className=" flex justify-between px-5 pl-6 font-bold">
          <div>Shop Details</div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push(`${id}/edit`)}
              variant={"outline"}
            >
              <div>Edit</div>
            </Button>
            <ShopDelete
              shopId={id as string}
              shopName={shop.name}
              fetchShops={goToShops}
            />
          </div>
        </div>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Left: Shop Info */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Shop Information</h2>
            <div>
              <p className="text-sm text-muted-foreground">Shop Name</p>
              <p className="font-medium capitalize">{shop.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium capitalize">{shop.address || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatInTZ(shop.created_at!)}</p>
            </div>
          </div>

          {/* Right: Admin Info */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Admin Information</h2>

            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium capitalize">{shop?.user?.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{shop?.user?.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{shop?.user?.phone || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Assigned Package */}
      {shop.package_assignments && (
        <Card>
          <div className="flex justify-between items-center pr-3  font-bold">
            <div className="px-5 pl-6 font-bold">Assigned Package</div>
            <div>
              <Button
                onClick={handlePackageRemove}
                className="cursor-pointer"
                variant={"outline"}
              >
                <div>Remove Package</div>
              </Button>
            </div>
          </div>

          <CardContent className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground">Package Name</p>
              <p className="font-medium capitalize">
                {shop.package_assignments.package.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">
                {formatInTZ(shop.package_assignments.start_at)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Limits</p>
              <p className="font-medium">
                Email: {shop.package_assignments.package.email_limit}, SMS:{" "}
                {shop.package_assignments.package.sms_limit}, WhatsApp:{" "}
                {shop.package_assignments.package.whatsapp_limit}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Enabled Channels</p>
              <p className="font-medium">
                {shop.package_assignments.package.email_enabled && "Email "}
                {shop.package_assignments.package.sms_enabled && "SMS "}
                {shop.package_assignments.package.whatsapp_enabled &&
                  "WhatsApp"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
