"use client";

import { useEffect, useMemo, useState } from "react";
import SalesForm from "@/components/sale/sales-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { deleteSale, getAllSales, Sale } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Spinner } from "@/components/ui/spinner";

type DateFilter = "today" | "7days" | "30days" | "all";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<DateFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true); // 🟡 loading state
  const [loadingId, setLoadingId] = useState(0);
  const user = useAuthStore((s) => s.user);
  const shop_id = user!.shop?.id as string;

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await getAllSales(shop_id);
      console.log(res);
      setSales(res.data || res);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaleDelete = async (id: string) => {
    try {
      setLoadingId(Number(id));
      const res = await deleteSale(id);
      setSales((prev) => prev.filter((s) => s.id !== id));
      toast.success(res.message || "sale removed");
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "error removing sale");
    } finally {
      setLoadingId(0);
    }
  };

  useEffect(() => {
    if (!shop_id) return;
    fetchSales();
  }, [shop_id]);

  // 🔍 Filter + Search Logic
  const filteredSales = useMemo(() => {
    let filtered = [...sales];

    if (filter !== "all") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      filtered = filtered.filter((s) => {
        const saleDate = new Date(s.created_at as string);
        saleDate.setHours(0, 0, 0, 0); // normalize to midnight

        const diffDays =
          (startOfToday.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24);

        if (filter === "today") {
          // ✅ Only exact calendar date matches
          return saleDate.getTime() === startOfToday.getTime();
        }
        if (filter === "7days") return diffDays <= 6; // include today
        if (filter === "30days") return diffDays <= 29;
        return true;
      });
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.vehicle?.registration_number?.toLowerCase().includes(q) ||
          s.product?.name?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [sales, filter, searchTerm]);

  return (
    <section className="space-y-6 md:p-6 p-2">
      {/* Header */}
      <div className="flex justify-between items-start md:flex-row md:items-center flex-col">
        <div>
          <h1 className="text-3xl font-bold">Sales Management</h1>
          <p className="text-gray-600 mt-1">
            Record and track vehicle oil sales
          </p>
        </div>

        <Button
          className="w-full md:w-auto md:mt-0 mt-2"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Hide Form" : "Add New Sale"}
        </Button>
      </div>

      {/* Conditionally show Sales Form */}
      {showForm && (
        <Card className="p-4">
          <SalesForm fetchSales={fetchSales} shop_id={shop_id} />
        </Card>
      )}

      {/* Sales History */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters + Search */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {(["today", "7days", "30days", "all"] as DateFilter[]).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "secondary"}
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "All time"
                  : f === "today"
                  ? "Today"
                  : f === "7days"
                  ? "7 days"
                  : "30 days"}
              </Button>
            ))}

            <Input
              className="ml-auto max-w-xs"
              placeholder="Search by reg# or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sales Table */}
          <div className="rounded-lg border overflow-hidden">
            {loading ? (
              // 🦴 Skeleton Loader
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty (L)</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      {Array.from({ length: 7 }).map((__, i) => (
                        <TableCell key={i}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty (L)</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No sales found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {new Date(
                            sale.created_at as string
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {sale.vehicle?.registration_number || "—"}
                        </TableCell>
                        <TableCell>{sale.product?.name || "—"}</TableCell>
                        <TableCell>{sale.quantity_liters}</TableCell>
                        <TableCell>Rs. {sale.total_amount}</TableCell>
                        <TableCell className="capitalize">
                          {sale.payment_method.toLowerCase()}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleSaleDelete(sale.id as string)}
                            className="bg-transparent text-black cursor-pointer hover:bg-red-200 hover:text-red-700"
                            size={"icon-sm"}
                          >
                            {loadingId === sale.id ? <Spinner /> : <Trash2 />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
