"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegistrationInput } from "@/components/registeration-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createVehicle,
  getAllCustomers,
  getAllVehicles,
  Vehicle,
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Car, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export interface CreateVehicleReq {
  shop_id: string | number;
  owner_id: string | number;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
}

interface Customer {
  id: string;
  name: string;
}

export default function VehiclesPage() {
  const user = useAuthStore((s) => s.user);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [make, setMake] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchData = async () => {
    if (!user?.shop?.id) return;

    try {
      setLoading(true);
      setError(null);
      const vehiclesData = await getAllVehicles(user.shop.id as string);
      const customersData = await getAllCustomers(user.shop.id as string);

      setVehicles(vehiclesData.data || []);
      setCustomers(customersData.data || []);
    } catch (err) {
      console.error("[v0] Error fetching data:", err);
      setError("Failed to load vehicles and customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.shop?.id]);

  const handleReset = () => {
    setRegistrationNumber("");
    setMake("");
    setModel("");
    setYear("");
    setMileage("");
    setCustomerId("");
  };

  const handleSave = async () => {
    const regPattern = /^[A-Z]{2,}-(\d{1,4}|\d{2}-\d{1,4})$/;
    if (!regPattern.test(registrationNumber)) {
      toast.error("Please enter a valid registration number");
      return;
    }

    if (!customerId) {
      toast.error("Please select a customer");
      return;
    }

    if (!make || !model || !year || !mileage) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const payload: CreateVehicleReq = {
        shop_id: user!.shop?.id as string,
        owner_id: customerId,
        registration_number: registrationNumber,
        make,
        model,
        year: Number.parseInt(year),
        mileage: Number.parseInt(mileage),
      };
      setFormLoading(true);

      const res = await createVehicle(payload);
      if (res.success) {
        handleReset();
        fetchData();
        toast.success(res.message || "Vehicle created successfully!");
      }
    } catch (err) {
      if (err instanceof AxiosError)
        toast.error(err.response?.data.message || "Failed to create vehicle");
    } finally {
      setFormLoading(false);
    }
  };

  const getCustomerName = (customerId: string) => {
    return customers.find((c) => c.id === customerId)?.name || "Unknown";
  };

  const filteredVehicles = useMemo(() => {
    if (!searchTerm.trim()) return vehicles;
    const term = searchTerm.toLowerCase();

    return vehicles.filter((v) => {
      const ownerName =
        getCustomerName(v.owner_id as string)?.toLowerCase() || "";
      return (
        v.registration_number.toLowerCase().includes(term) ||
        v.make?.toLowerCase().includes(term) ||
        v.model?.toLowerCase().includes(term) ||
        v.year?.toString().includes(term) ||
        ownerName.includes(term)
      );
    });
  }, [vehicles, searchTerm, customers]);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Vehicles
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your vehicle inventory
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search by Reg#, Make, Model, Year, or Owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm text-sm"
          />
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Vehicles List - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Desktop Table View */}
            <Card className="border-0 shadow-sm hidden md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b hover:bg-transparent">
                      <TableHead className="font-semibold">Reg#</TableHead>
                      <TableHead className="font-semibold hidden sm:table-cell">
                        Customer
                      </TableHead>
                      <TableHead className="font-semibold">
                        Make/Model
                      </TableHead>
                      <TableHead className="font-semibold hidden lg:table-cell">
                        Year
                      </TableHead>
                      <TableHead className="font-semibold hidden xl:table-cell text-right">
                        Mileage
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-28" />
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-destructive"
                        >
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : filteredVehicles.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          {searchTerm
                            ? `No results found for “${searchTerm}”`
                            : "No vehicles yet. Add one using the form."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVehicles.map((vehicle) => (
                        <TableRow
                          onClick={() => router.push(`vehicles/${vehicle.id}`)}
                          onMouseEnter={() => router.prefetch(`vehicles/${vehicle.id}`)}
                          key={vehicle.id}
                          className="hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <TableCell className="font-mono font-semibold">
                            {vehicle.registration_number}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {getCustomerName(vehicle.owner_id as string)}
                          </TableCell>
                          <TableCell>
                            {vehicle.make} {vehicle.model}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {vehicle.year}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-right">
                            {vehicle.mileage} km
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 max-h-96 overflow-y-auto">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm p-4">
                    <Skeleton className="h-16 w-full" />
                  </Card>
                ))
              ) : error ? (
                <Card className="border-0 shadow-sm px-8 text-center">
                  <p className="text-destructive">{error}</p>
                </Card>
              ) : filteredVehicles.length === 0 ? (
                <Card className="border-0 shadow-sm px-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `No results found for “${searchTerm}”`
                      : "No vehicles yet. Add one using the form."}
                  </p>
                </Card>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    onMouseEnter={() => router.prefetch(`vehicles/${vehicle.id}`)}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`vehicles/${vehicle.id}`)}
                  >
                    <div className="px-4 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono font-semibold text-base">
                            {vehicle.registration_number}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {getCustomerName(vehicle.owner_id as string)}
                        </p>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">
                            {vehicle.make} {vehicle.model}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{vehicle.year}</span>
                            <span>•</span>
                            <span>{vehicle.mileage} km</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Add Vehicle Form - Right Side */}
          <div className="lg:col-span-1">
            <Card className="border-0 relative shadow-sm lg:sticky overflow-hidden lg:top-4 h-fit">
              {formLoading && (
                <div className="w-full h-full absolute top-0 bg-white opacity-45"></div>
              )}
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">
                  Add Vehicle
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Register a new vehicle to your inventory
                </p>
              </CardHeader>

              {loading ? (
                <CardContent className="grid gap-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="grid gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              ) : (
                <CardContent className="grid gap-4">
                  <RegistrationInput
                    value={registrationNumber}
                    onChange={setRegistrationNumber}
                    label="Registration Number"
                    placeholder="ABC-12-1234"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="make" className="text-xs sm:text-sm">
                        Make
                      </Label>
                      <Input
                        id="make"
                        placeholder="Toyota"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="model" className="text-xs sm:text-sm">
                        Model
                      </Label>
                      <Input
                        id="model"
                        placeholder="Corolla"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="year" className="text-xs sm:text-sm">
                        Year
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2020"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="mileage" className="text-xs sm:text-sm">
                        Mileage (km)
                      </Label>
                      <Input
                        id="mileage"
                        type="number"
                        placeholder="65000"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="customer" className="text-xs sm:text-sm">
                      Assign Customer
                    </Label>
                    <Select value={customerId} onValueChange={setCustomerId}>
                      <SelectTrigger id="customer" className="text-sm">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No customers available
                          </div>
                        ) : (
                          customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      onClick={handleSave}
                      className="flex-1 text-sm"
                      disabled={!registrationNumber || !customerId}
                    >
                      {formLoading ? <Spinner /> : "Save"}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1 bg-transparent text-sm"
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
