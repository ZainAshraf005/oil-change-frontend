"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  type Customer,
  deleteReminder,
  getAllRemindersByCustomerId,
  getAllVehiclesByCustomerId,
  getCustomerById,
  Reminder,
  type Vehicle,
} from "@/lib/api";
import CustomerDelete from "@/components/customer/customer-delete";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Gauge,
  Car,
  Trash2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const data = await getAllVehiclesByCustomerId(id as string);
      setVehicles(data.data);
    } finally {
      setLoading(false);
    }
  };
  const fetchReminders = async () => {
    try {
      const data = await getAllRemindersByCustomerId(id as string);
      setReminders(data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (id: number | string) => {
    try {
      await deleteReminder(id as string);
      setReminders((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reminder deleted successfully");
    } catch {
      toast.error("Failed to delete reminder");
    }
  };

  const fetchCustomer = async () => {
    try {
      const data = await getCustomerById(id as string);
      setCustomer(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCustomer();
    fetchVehicles();
    fetchReminders();
  }, [id]);

  const handleEdit = () => {
    router.push(`${id}/edit`);
  };

  const goToCustomerPage = () => {
    router.push("/admin/customers");
  };

  // 🟢 Skeleton UI while loading
  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in-50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left side (main content skeletons) */}
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-[220px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>

          {/* Right side (stats + actions skeletons) */}
          <div className="space-y-6">
            <Skeleton className="h-[180px] w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // 🟢 Customer not found state
  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive text-center mb-4">
              Customer not found
            </p>
            <Button onClick={() => router.back()} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🟢 Main UI when loaded
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {customer.name}
          </h1>
          <p className="text-muted-foreground">Customer Profile</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="text-lg font-semibold capitalize">
                    {customer.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Member Since
                  </p>
                  <p className="text-lg font-semibold">
                    {new Date(
                      customer.created_at as string
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                {customer.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}

                {customer.whatsapp && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                      <p className="text-sm font-medium">{customer.whatsapp}</p>
                    </div>
                  </div>
                )}

                {customer.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium break-all">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicles Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b hover:bg-transparent">
                      <TableHead className="font-semibold">Reg#</TableHead>
                      <TableHead className="font-semibold">
                        Make/Model
                      </TableHead>
                      <TableHead className="font-semibold">Year</TableHead>
                      <TableHead className="font-semibold text-right">
                        Mileage
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.length > 0 ? (
                      vehicles.map((vehicle) => (
                        <TableRow
                          onMouseEnter={() =>
                            router.prefetch(`/admin/vehicles/${vehicle.id}`)
                          }
                          onClick={() =>
                            router.push(`/admin/vehicles/${vehicle.id}`)
                          }
                          key={vehicle.id}
                          className="hover:bg-muted/50 cursor-pointer"
                        >
                          <TableCell className="font-mono font-semibold">
                            {vehicle.registration_number}
                          </TableCell>
                          <TableCell>
                            {vehicle.make} {vehicle.model}
                          </TableCell>
                          <TableCell>{vehicle.year}</TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-1">
                            <Gauge className="h-4 w-4 text-muted-foreground" />
                            {vehicle.mileage} km
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No vehicles registered
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Reminders Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reminders
              </CardTitle>
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

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold">{vehicles.length}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Vehicles Registered
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold">{reminders.length}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Active Reminders
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onMouseEnter={() => router.prefetch(`${id}/edit`)}
                onClick={handleEdit}
                className="w-full bg-transparent cursor-pointer"
                variant="outline"
              >
                Edit Customer
              </Button>
              <CustomerDelete
                customerName={customer.name}
                customerId={customer.id}
                fetchCustomers={goToCustomerPage}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
