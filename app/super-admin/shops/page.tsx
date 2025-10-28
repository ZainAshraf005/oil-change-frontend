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
import type { Shop } from "@/lib/api";
import Link from "next/link";
import ShopDelete from "@/components/shop/shop-delete";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Plus, Store, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await getShops();
      setShops(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shops</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your shops and their configurations
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto gap-2">
          <Link href="shops/create" prefetch>
            <Plus className="w-4 h-4" />
            Create Shop
          </Link>
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Shop</TableHead>
                  <TableHead className="font-semibold">Owner</TableHead>
                  <TableHead className="font-semibold hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">
                    Package
                  </TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {shops.length > 0 ? (
                  shops.map((shop) => (
                    <TableRow
                      key={shop.id}
                      className={
                        shop.status === "ACTIVE"
                          ? `hover:bg-muted/30 transition-colors`
                          : "hover:bg-red-600/30 bg-red-700/35 transition-colors"
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium capitalize">
                            {shop.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {shop.user?.name || "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {shop.user?.email || "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {shop.package_assignment?.package?.name ? (
                          <Badge  variant={`${shop.status==="ACTIVE"?"secondary":"destructive"}`}>
                            {shop.package_assignment.package.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="capitalize">
                        {shop.status || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onMouseEnter={() =>
                              router.prefetch(`shops/${shop.id}`)
                            }
                            onClick={() => router.push(`shops/${shop.id}`)}
                            size="sm"
                            variant="outline"
                            className="gap-1"
                          >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
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
                      colSpan={5}
                      className="text-center text-muted-foreground py-12"
                    >
                      <Store className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No shops found. Create one to get started.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </section>
  );
}
