"use client";

import type React from "react";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  getAllVehicles,
  getAllProducts,
  type Vehicle,
  type Product,
  createSale,
  type CreateSaleReq,
  getAdminDashboardStats,
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useDashboardStore } from "@/stores/dashboard-store";

interface SalesFormProps {
  shop_id: string | number;
  fetchSales: () => void;
}

export default function SalesForm({ shop_id, fetchSales }: SalesFormProps) {
  const user = useAuthStore((s) => s.user);
  const { setData } = useDashboardStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // form states
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityLiters, setQuantityLiters] = useState("");
  const [odometerKm, setOdometerKm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [reminderDays, setReminderDays] = useState("");
  const [notes, setNotes] = useState("");

  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [vehicleHighlightedIndex, setVehicleHighlightedIndex] = useState(-1);
  const [productHighlightedIndex, setProductHighlightedIndex] = useState(-1);
  const vehicleInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);

  // Fetch vehicles and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vehiclesData, productsData] = await Promise.all([
          getAllVehicles(shop_id as string),
          getAllProducts(shop_id as string),
        ]);
        setVehicles(vehiclesData.data);
        setProducts(productsData.data);
      } catch {
        toast.error("Failed to load vehicles or products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [shop_id]);

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((v) => {
        const searchLower = vehicleSearch.toLowerCase();
        return (
          v.registration_number?.toLowerCase().includes(searchLower) ||
          v.make?.toLowerCase().includes(searchLower) ||
          v.model?.toLowerCase().includes(searchLower)
        );
      }),
    [vehicles, vehicleSearch]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name?.toLowerCase().includes(productSearch.toLowerCase())
      ),
    [products, productSearch]
  );

  // calculate total
  const totalAmount = useMemo(() => {
    if (selectedProduct && quantityLiters) {
      const q = Number.parseFloat(quantityLiters);
      return !isNaN(q)
        ? (q * selectedProduct.price_per_litre).toFixed(2)
        : "0.00";
    }
    return "0.00";
  }, [selectedProduct, quantityLiters]);

  const handleVehicleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!vehicleDropdownOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setVehicleHighlightedIndex((prev) =>
          prev < filteredVehicles.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setVehicleHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (vehicleHighlightedIndex >= 0) {
          selectVehicle(filteredVehicles[vehicleHighlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setVehicleDropdownOpen(false);
        break;
    }
  };

  const handleProductKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!productDropdownOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setProductHighlightedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setProductHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (productHighlightedIndex >= 0) {
          selectProduct(filteredProducts[productHighlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setProductDropdownOpen(false);
        break;
    }
  };

  const selectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleSearch("");
    setVehicleDropdownOpen(false);
    setVehicleHighlightedIndex(-1);
  };

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductSearch("");
    setProductDropdownOpen(false);
    setProductHighlightedIndex(-1);
  };

  const fetchDashboard = async () => {
    const res = await getAdminDashboardStats(user?.shop?.id as string);
    setData(res.data);
  };

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedVehicle ||
      !selectedProduct ||
      !quantityLiters ||
      !odometerKm
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!reminderDays) {
      toast.error("Please enter reminder days");
      return;
    }

    const data: CreateSaleReq = {
      vehicle_id: selectedVehicle.id!,
      product_id: selectedProduct.id!,
      shop_id,
      odometer_km: Number(odometerKm),
      quantity_liters: Number(quantityLiters),
      price_per_liter: selectedProduct.price_per_litre,
      total_amount: Number(totalAmount),
      payment_method: paymentMethod as "CASH" | "CARD" | "OTHER",
      notes: notes || "",
      reminder_days: Number(reminderDays),
    };

    try {
      setIsSubmitting(true);
      const res = await createSale(data);
      if (res.success) {
        toast.success(res.message || "Sale recorded successfully");
        fetchSales();

        // reset form
        setSelectedVehicle(null);
        setVehicleSearch("");
        setSelectedProduct(null);
        setProductSearch("");
        setQuantityLiters("");
        setOdometerKm("");
        setPaymentMethod("CASH");
        setReminderDays("");
        setNotes("");
      } else {
        toast.error(res.message || "Failed to record sale");
      }
    } catch (err) {
      if (err instanceof AxiosError)
        toast.error(err.response?.data?.message || "Error recording sale");
    } finally {
      setIsSubmitting(false);
      fetchDashboard();
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <Card className="shadow-sm border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Record a New Sale
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle */}
          <div className="space-y-2 relative">
            <Label>Vehicle (by Reg#, Make, or Model)</Label>
            <Input
              ref={vehicleInputRef}
              placeholder="Search vehicle..."
              value={
                selectedVehicle
                  ? `${selectedVehicle.registration_number} — ${selectedVehicle.make} ${selectedVehicle.model}`
                  : vehicleSearch
              }
              onChange={(e) => {
                setVehicleSearch(e.target.value);
                setSelectedVehicle(null);
                setVehicleHighlightedIndex(-1);
              }}
              onFocus={() => setVehicleDropdownOpen(true)}
              onBlur={() =>
                setTimeout(() => setVehicleDropdownOpen(false), 200)
              }
              onKeyDown={handleVehicleKeyDown}
            />
            {vehicleDropdownOpen &&
              (filteredVehicles.length > 0 || !selectedVehicle) && (
                <div className="absolute top-full left-0 right-0 border rounded-md bg-background mt-1 max-h-40 overflow-y-auto shadow-md z-10">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((v, index) => (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => selectVehicle(v)}
                        className={`block w-full text-left px-3 py-2 transition ${
                          index === vehicleHighlightedIndex
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {v.registration_number} — {v.make} {v.model}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No vehicles found
                    </div>
                  )}
                </div>
              )}
            {selectedVehicle && (
              <p className="text-sm text-green-600">
                ✓ Current Mileage:{" "}
                <span className="font-medium">
                  {selectedVehicle.mileage} km
                </span>
              </p>
            )}
          </div>

          {/* Product */}
          <div className="space-y-2 relative">
            <Label>Product</Label>
            <Input
              ref={productInputRef}
              placeholder="Search product..."
              value={
                selectedProduct
                  ? `${selectedProduct.name} — ₨ ${selectedProduct.price_per_litre}/L`
                  : productSearch
              }
              onChange={(e) => {
                setProductSearch(e.target.value);
                setSelectedProduct(null);
                setProductHighlightedIndex(-1);
              }}
              onFocus={() => setProductDropdownOpen(true)}
              onBlur={() =>
                setTimeout(() => setProductDropdownOpen(false), 200)
              }
              onKeyDown={handleProductKeyDown}
            />
            {productDropdownOpen &&
              (filteredProducts.length > 0 || !selectedProduct) && (
                <div className="absolute top-full left-0 right-0 border rounded-md bg-background mt-1 max-h-40 overflow-y-auto shadow-md z-10">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p, index) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => selectProduct(p)}
                        className={`block w-full text-left px-3 py-2 transition ${
                          index === productHighlightedIndex
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {p.name} — ₨ {p.price_per_litre}/L
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No products found
                    </div>
                  )}
                </div>
              )}
            {selectedProduct && (
              <p className="text-sm text-green-600">
                ✓ Available Stock:{" "}
                <span className="font-medium">
                  {selectedProduct.stock_litres} L
                </span>
              </p>
            )}
          </div>

          {/* Quantity & Odometer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <Label>Quantity (Liters)</Label>
              <Input
                type="number"
                required
                step="0.1"
                placeholder="e.g. 3.5"
                value={quantityLiters}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    selectedProduct &&
                    Number(value) > selectedProduct.stock_litres
                  ) {
                    toast.error(
                      `Cannot exceed stock limit (${selectedProduct.stock_litres} L)`
                    );
                    setQuantityLiters(selectedProduct.stock_litres.toString());
                  } else {
                    setQuantityLiters(value);
                  }
                }}
                max={selectedProduct?.stock_litres}
                min={0}
              />
            </div>

            {/* Odometer */}
            <div>
              <Label>Odometer (km)</Label>
              <Input
                type="number"
                placeholder="e.g. 65000"
                required
                value={odometerKm}
                onChange={(e) => setOdometerKm(e.target.value)}
                className={
                  selectedVehicle &&
                  Number(odometerKm) < selectedVehicle.mileage
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {selectedVehicle &&
                Number(odometerKm) < selectedVehicle.mileage && (
                  <p className="text-sm text-red-600 mt-1">
                    Odometer must be at least {selectedVehicle.mileage} km
                  </p>
                )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total */}
          {selectedProduct && quantityLiters && (
            <div className="bg-muted/40 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <h3 className="text-2xl font-semibold text-foreground">
                ₨ {totalAmount}
              </h3>
              <p className="text-xs text-muted-foreground">
                {quantityLiters}L × ₨{selectedProduct.price_per_litre}/L
              </p>
            </div>
          )}

          {/* Reminder */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Set Reminder</Label>
              {!user?.shop?.package_assignment && (
                <Label className="text-xs text-red-700">
                  Reminder will not be created because no package is assigned to
                  this shop*
                </Label>
              )}
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-blue-400">
              <Label>Reminder Days</Label>
              <Input
                type="number"
                required
                min="1"
                max="365"
                placeholder="e.g. 15"
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes (optional)</Label>
            <Input
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
              </>
            ) : (
              "Record Sale"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
