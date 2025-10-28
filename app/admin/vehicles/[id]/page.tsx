"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getVehicleById,
  getCustomerById,
  getAllSalesByVehicleId,
  getAllRemindersByVehicleId,
  deleteAllSalesByVehicleId,
  deleteReminder,
  type Vehicle,
  type Customer,
  type Sale,
  type Reminder,
} from "@/lib/api";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Gauge,
  Wrench,
  Trash2,
} from "lucide-react";
import VehicleEdit from "@/components/vehicle/vehicle-edit";
import { toast } from "sonner";
import { AxiosError } from "axios";
import ClearAllSalesDialog from "@/components/sale/clear-sales";
import VehicleDelete from "@/components/vehicle/vehicle-delete";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const vehicleId = id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [owner, setOwner] = useState<Customer | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Navigate back to list
  const goToVehicles = () => router.push("/admin/vehicles");

  // 🔹 Fetch all data
  const fetchData = async () => {
    if (!vehicleId) return;
    try {
      setLoading(true);
      setError(null);

      const vehicleRes = await getVehicleById(vehicleId);
      const vehicleData = vehicleRes?.data;
      if (!vehicleData) {
        setError("Vehicle not found");
        return;
      }

      const [ownerRes, salesRes, remindersRes] = await Promise.all([
        getCustomerById(vehicleData.owner_id),
        getAllSalesByVehicleId(vehicleData.id),
        getAllRemindersByVehicleId(vehicleData.id),
      ]);

      setVehicle(vehicleData);
      setOwner(ownerRes.data);
      setSales(salesRes || []);
      setReminders(remindersRes.data || []);
    } catch (err) {
      console.error("Error fetching vehicle details:", err);
      setError("Failed to load vehicle details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vehicleId]);

  // 🔸 Delete Reminder (without refetch)
  const handleDeleteReminder = async (id: number | string) => {
    try {
      await deleteReminder(id as string);
      setReminders((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reminder deleted successfully");
    } catch {
      toast.error("Failed to delete reminder");
    }
  };

  // 🔸 Clear All Sales (without refetch)
  const handleClearSales = async () => {
    if (!vehicle) return;
    try {
      await deleteAllSalesByVehicleId(vehicle.id as string);
      setSales([]);
      toast.success("All sales cleared successfully");
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "Failed to clear sales");
    }
  };

  // 🟡 Skeleton while loading
  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in-50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-[220px] w-full rounded-xl" />
            <Skeleton className="h-[260px] w-full rounded-xl" />
            <Skeleton className="h-[220px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[260px] w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // 🔴 Error State
  if (error || !vehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive text-center mb-4">
              {error || "Vehicle not found"}
            </p>
            <Button onClick={() => router.back()} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🟢 Loaded UI
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {vehicle.registration_number}
          </h1>
          <p className="text-muted-foreground capitalize">
            {vehicle.make} {vehicle.model} • {vehicle.year}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-6">
                <InfoItem label="Make" value={vehicle.make} />
                <InfoItem label="Model" value={vehicle.model} />
                <InfoItem label="Year" value={vehicle.year?.toString()} />
                <InfoItem
                  label="Current Mileage"
                  value={
                    <span className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      {vehicle.mileage.toLocaleString()} km
                    </span>
                  }
                />
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Registration Number
                </p>
                <Badge
                  variant="secondary"
                  className="text-base px-3 py-1 font-mono"
                >
                  {vehicle.registration_number}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Sales History */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Sales History
              </CardTitle>
              {sales.length > 0 && (
                <ClearAllSalesDialog
                  vehicleName={`${vehicle.make} ${vehicle.model}`}
                  fetchSales={handleClearSales}
                />
              )}
            </CardHeader>
            <CardContent>
              {sales.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No sales recorded yet
                </p>
              ) : (
                <div className="space-y-4">
                  {sales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div>
                        <p className="font-semibold text-sm">
                          {sale.notes || "Service"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            sale.created_at as string
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Odometer: {sale.odometer_km.toLocaleString()} km
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          <span className="text-sm">PKR</span>{" "}
                          {sale.total_amount.toLocaleString()}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {sale.payment_method}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No reminders set
                </p>
              ) : (
                <div className="space-y-3">
                  {reminders.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start justify-between p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Reminder</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {new Date(r.due_date || "").toLocaleDateString()}{" "}
                          ({r.reminder_days} days before)
                        </p>
                        {r.channelStatuses?.map((s) => (
                          <Badge
                            key={s.id}
                            variant={
                              s.status === "SENT"
                                ? "secondary"
                                : s.status === "FAILED"
                                ? "destructive"
                                : "outline"
                            }
                            className="mt-1"
                          >
                            {s.status}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReminder(r.id as string)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {owner ? (
                <>
                  <p className="text-lg font-semibold capitalize">
                    {owner.name}
                  </p>
                  <OwnerInfo icon={Phone} label="Phone" value={owner.phone} />
                  <OwnerInfo
                    icon={MessageCircle}
                    label="WhatsApp"
                    value={owner.whatsapp}
                  />
                  <OwnerInfo icon={Mail} label="Email" value={owner.email} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Owner information not available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <VehicleEdit
                vehicleId={vehicleId}
                registrationNumber={vehicle.registration_number}
                make={vehicle.make!}
                model={vehicle.model!}
                year={vehicle.year!}
                mileage={vehicle.mileage}
                ownerId={vehicle.owner_id.toString()}
                fetchVehicles={fetchData}
              />
              <VehicleDelete
                vehicleId={vehicleId}
                fetchVehicles={goToVehicles}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* 🔸 Small reusable UI helpers */
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold capitalize">{value}</p>
    </div>
  );
}

function OwnerInfo({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-all">{value}</p>
      </div>
    </div>
  );
}

