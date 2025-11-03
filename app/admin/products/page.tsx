"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useMemo } from "react";
import { computePrice, normalizeToLiters } from "@/lib/helpers/unit-conversion";
import { useAuthStore } from "@/stores/auth-store";
import {
  createProduct,
  getAdminDashboardStats,
  getAllProducts,
  type Product,
} from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import ProductDelete from "@/components/product/product-delete";
import ProductEdit from "@/components/product/product-edit";
import { useDashboardStore } from "@/stores/dashboard-store";

type IFilter = "ALL" | "LOW_STOCK" | "PRICE_ASC" | "PRICE_DESC";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState<"L" | "ML">("L");
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // 🔍 Search + Filter state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<IFilter>("ALL");

  const total = computePrice(normalizeToLiters(quantity, unit), pricePerLiter);
  const user = useAuthStore((s) => s.user);
  const { setData } = useDashboardStore();

  // 🟢 Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(user?.shop?.id as string);
      setProducts(data.data || []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
      fetchDashboard();
    }
  };

  const fetchDashboard = async () => {
    const res = await getAdminDashboardStats(user?.shop?.id as string);
    setData(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNumberChange = (value: string, setter: (num: number) => void) => {
    const cleaned = value.replace(/^0+/, ""); // remove all leading zeros
    setter(cleaned === "" ? 0 : Number(cleaned));
  };

  // 🟢 Handle create product
  const handleCreateProduct = async () => {
    const normalizedQuantity = normalizeToLiters(quantity, unit);

    const productData = {
      shop_id: user!.shop?.id as string,
      name,
      price_per_litre: pricePerLiter,
      stock_litres: normalizedQuantity,
      low_stock_threshold: lowStockThreshold,
    };

    try {
      setCreating(true);
      const data = await createProduct(productData);
      toast.success(data.message || "Product created successfully");
      await fetchProducts();
      setName("");
      setPricePerLiter(0);
      setQuantity(0);
      setUnit("L");
      setLowStockThreshold(0);
      setOpen(false);
      fetchDashboard();
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "Error creating product");
    } finally {
      setCreating(false);
    }
  };

  // 🧮 Filtered + Searched products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    switch (filter) {
      case "LOW_STOCK":
        list = list.filter((p) => p.stock_litres < p.low_stock_threshold);
        break;
      case "PRICE_ASC":
        list.sort((a, b) => a.price_per_litre - b.price_per_litre);
        break;
      case "PRICE_DESC":
        list.sort((a, b) => b.price_per_litre - a.price_per_litre);
        break;
    }

    return list;
  }, [products, search, filter]);

  return (
    <section className="space-y-4">
      {/* Header and Add Product */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              {/* Name */}
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Shell Helix 5W-30"
                />
              </div>

              {/* Price per Liter */}
              <div className="grid gap-2">
                <Label>Price per Liter</Label>
                <Input
                  type="number"
                  value={pricePerLiter}
                  onChange={(e) =>
                    handleNumberChange(e.target.value, setPricePerLiter)
                  }
                />
              </div>

              {/* Quantity + Unit */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleNumberChange(e.target.value, setQuantity)
                    }
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as "L" | "ML")}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="L">Liters</option>
                    <option value="ML">Milliliters</option>
                  </select>
                </div>
              </div>

              {/* Low Stock Threshold */}
              <div className="grid gap-2">
                <Label>Low Stock Threshold (Liters)</Label>
                <Input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) =>
                    handleNumberChange(e.target.value, setLowStockThreshold)
                  }
                  placeholder="e.g. 5"
                />
              </div>

              {/* Auto price calculation */}
              <div className="rounded-md border p-2 text-sm">
                Auto price calculation example:{" "}
                {isFinite(total) ? total.toFixed(2) : "—"}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProduct} disabled={creating}>
                  {creating ? "Creating..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🔍 Search and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as IFilter)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="ALL">All Products</option>
          <option value="LOW_STOCK">Low Stock Only</option>
          <option value="PRICE_ASC">Price: Low → High</option>
          <option value="PRICE_DESC">Price: High → Low</option>
        </select>
      </div>

      {/* 🧾 Product Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Stock (L)</TableHead>
              <TableHead>Price/L</TableHead>
              <TableHead>Low Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <div className="animate-pulse flex items-center justify-between">
                        <div className="h-4 w-1/3 bg-muted rounded"></div>
                        <div className="h-4 w-1/6 bg-muted rounded"></div>
                        <div className="h-4 w-1/6 bg-muted rounded"></div>
                        <div className="h-4 w-1/6 bg-muted rounded"></div>
                        <div className="h-4 w-1/6 bg-muted rounded"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const isLowStock = p.stock_litres < p.low_stock_threshold;
                return (
                  <TableRow
                    key={p.id}
                    className={
                      isLowStock
                        ? "bg-red-50 cursor-pointer dark:bg-red-950/30"
                        : "cursor-pointer"
                    }
                  >
                    <TableCell className="capitalize font-medium flex items-center gap-2">
                      {p.name}
                      {isLowStock && (
                        <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-md font-semibold">
                          Low Stock
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{p.stock_litres.toFixed(2)}</TableCell>
                    <TableCell>{p.price_per_litre}</TableCell>
                    <TableCell>{p.low_stock_threshold}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <ProductEdit
                          productId={p.id as string}
                          productName={p.name}
                          pricePerLiter={p.price_per_litre}
                          stockLitres={p.stock_litres}
                          lowStockThreshold={p.low_stock_threshold}
                          fetchProducts={fetchProducts}
                        />
                        <ProductDelete
                          productName={p.name}
                          productId={p.id as string}
                          fetchProducts={fetchProducts}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
