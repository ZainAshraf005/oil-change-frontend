"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getShops } from "@/lib/api";
import { Shop } from "@/lib/api";
import Link from "next/link";
import ShopDelete from "@/components/shop-delete";
import { useRouter } from "next/navigation";

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const router = useRouter();

  const fetchShops = async () => {
    try {
      const res = await getShops();
      setShops(res?.data || []); // adjust based on your API response structure
    } catch (err) {
      console.error("Failed to fetch shops:", err);
    }
  };
  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Shops</h1>
        <Button asChild>
          <Link href="shops/create">Create Shop</Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Shop</TableHead>
              <TableHead className="text-center">Owner</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Package</TableHead>
              <TableHead className="text-center">Quotas</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-center ">
            {shops.length > 0 ? (
              shops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="capitalize">{shop.name}</TableCell>
                  <TableCell className="capitalize">
                    {shop.user?.name || "—"}
                  </TableCell>
                  <TableCell>{shop.user?.email || "—"}</TableCell>
                  <TableCell>
                    {shop.package_assignments?.package?.name || "—"}
                  </TableCell>
                  <TableCell>
                    WA/SMS/Email —{/* later we can show actual counts */}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex gap-2">
                      <Button
                        onClick={() => router.push(`shops/${shop.id}`)}
                        size="sm"
                        variant="outline"
                      >
                        View
                      </Button>
                      <ShopDelete
                        shopName={shop.name}
                        shopId={shop.id as string}
                        fetchShops={fetchShops}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-6"
                >
                  No shops found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
