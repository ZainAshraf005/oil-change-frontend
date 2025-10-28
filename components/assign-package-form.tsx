"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getShops,
  getPackages,
  assignPackageToShop,
  Shop,
  Package,
} from "@/lib/api";
import { AxiosError } from "axios";
import AssignPackageSkeleton from "./skeletons/assign-package-skeleton";

export default function AssignPackageForm() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch shops and packages
  useEffect(() => {
    async function fetchData() {
      try {
        const shopsRes = await getShops();
        const packagesRes = await getPackages();
        setShops(shopsRes.data ?? []);
        setPackages(packagesRes.packages ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch shops or packages");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedShopObj = useMemo(
    () => shops.find((s) => Number(s.id) === selectedShop),
    [selectedShop, shops]
  );

  // Prefill package and start date when shop changes
  useEffect(() => {
    if (!selectedShop) {
      setSelectedPackage(null);
      setStartDate("");
      return;
    }

    const shop = shops.find((s) => Number(s.id) === selectedShop);
    if (shop?.package_assignment) {
      setSelectedPackage(Number(shop.package_assignment.package.id));
      setStartDate(
        new Date(shop.package_assignment.start_at).toISOString().split("T")[0]
      );
    } else {
      setSelectedPackage(null);
      setStartDate("");
    }
  }, [selectedShop, shops]);

  const handleAssign = async () => {
    if (!selectedShop || !selectedPackage || !startDate) {
      toast.error("Shop, package, and start date are required.");
      return;
    }

    try {
      setSubmitting(true);
      const data = await assignPackageToShop({
        shop_id: selectedShop,
        package_id: selectedPackage,
        start_at: startDate,
      });

      toast.success(data.message || "Package assigned successfully!");

      // update state locally
      setShops((prev) =>
        prev.map((shop) =>
          shop.id === selectedShop
            ? {
                ...shop,
                package_assignment: {
                  id: shop.package_assignment?.id ?? Date.now().toString(), // temporary or existing id
                  package:
                    packages.find(
                      (p) => Number(p.id) === Number(selectedPackage)
                    ) ?? ({} as Package),
                  start_at: startDate,
                },
              }
            : shop
        )
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to assign package."
        );
      } else {
        toast.error("Failed to assign package.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <>
        <AssignPackageSkeleton />
      </>
    );

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Shop Selector */}
        <div className="grid gap-2">
          <Label id="shop-label" className="text-sm font-medium">
            Shop
          </Label>
          <Select
            onValueChange={(val) => setSelectedShop(Number(val))}
            value={selectedShop?.toString()}
            disabled={loading || submitting}
          >
            <SelectTrigger aria-labelledby="shop-label">
              <SelectValue
                placeholder={loading ? "Loading shops..." : "Select shop"}
              />
            </SelectTrigger>
            <SelectContent>
              {shops.map((shop) => (
                <SelectItem key={shop.id} value={shop.id?.toString() ?? ""}>
                  {shop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Package Selector */}
        <div className="grid gap-2">
          <Label id="package-label" className="text-sm font-medium">
            Package
          </Label>
          <Select
            onValueChange={(val) => setSelectedPackage(Number(val))}
            value={selectedPackage?.toString()}
            disabled={loading || !selectedShop || submitting}
          >
            <SelectTrigger aria-labelledby="package-label">
              <SelectValue
                placeholder={loading ? "Loading packages..." : "Select package"}
              />
            </SelectTrigger>
            <SelectContent>
              {packages.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id?.toString() ?? ""}>
                  {pkg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="grid gap-2">
          <Label htmlFor="start-date" className="text-sm font-medium">
            Start date
          </Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading || !selectedShop || submitting}
          />
          <p className="text-xs text-muted-foreground">
            The package becomes active from this date.
          </p>
        </div>

        {/* Assign Button */}
        <div className="flex items-end">
          <Button
            onClick={handleAssign}
            disabled={
              loading ||
              submitting ||
              !selectedShop ||
              !selectedPackage ||
              !startDate
            }
            className="w-full md:w-auto"
          >
            {submitting ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>

      <AssignmentSummary
        shop={selectedShopObj}
        newPackageName={
          selectedPackage
            ? packages.find((p) => Number(p.id) === selectedPackage)?.name
            : undefined
        }
        startDate={startDate}
        loading={loading}
      />
    </div>
  );
}

function AssignmentSummary({
  shop,
  newPackageName,
  startDate,
  loading,
}: {
  shop?: Shop;
  newPackageName?: string;
  startDate?: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="grid gap-3 px-2">
        <div>
          <div className="text-xs uppercase text-muted-foreground">
            Selected shop
          </div>
          <div className="text-sm">
            {loading ? "Loading..." : shop ? shop.name : "No shop selected"}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase text-muted-foreground">
            Current assignment
          </div>
          <div className="text-sm">
            {loading
              ? "Loading..."
              : shop?.package_assignment
              ? `${shop.package_assignment.package.name} (since ${
                  new Date(shop.package_assignment.start_at)
                    .toISOString()
                    .split("T")[0]
                })`
              : "None"}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase text-muted-foreground">
            New assignment
          </div>
          <div className="text-sm">
            {newPackageName && startDate
              ? `${newPackageName} starting ${startDate}`
              : "Choose package and start date"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
