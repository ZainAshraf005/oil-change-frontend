"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { RegistrationInput } from "@/components/registeration-input";
import { CreateVehicleReq, updateVehicle, getAllCustomers } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";

interface Customer {
  id: string;
  name: string;
}

interface VehicleEditProps {
  vehicleId: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  ownerId?: string;
  fetchVehicles: () => void;
}

export default function VehicleEdit({
  vehicleId,
  registrationNumber,
  make,
  model,
  year,
  mileage,
  ownerId,
  fetchVehicles,
}: VehicleEditProps) {
  const [open, setOpen] = useState(false);
  const [regNumber, setRegNumber] = useState(registrationNumber);
  const [vehicleMake, setVehicleMake] = useState(make);
  const [vehicleModel, setVehicleModel] = useState(model);
  const [vehicleYear, setVehicleYear] = useState(year);
  const [vehicleMileage, setVehicleMileage] = useState(mileage);
  const [owner, setOwner] = useState(ownerId || "");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const user = useAuthStore((s) => s.user);

  // 🔹 Fetch customers on dialog open
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user?.shop?.id) return;

      try {
        setLoadingCustomers(true);
        const res = await getAllCustomers(user.shop.id as string);
        setCustomers(res.data || []);
      } catch {
        toast.error("Failed to load customers");
      } finally {
        setLoadingCustomers(false);
      }
    };

    if (open) {
      fetchCustomers();
      setRegNumber(registrationNumber);
      setVehicleMake(make);
      setVehicleModel(model);
      setVehicleYear(year);
      setVehicleMileage(mileage);
      setOwner(ownerId || "");
    }
  }, [
    open,
    registrationNumber,
    make,
    model,
    year,
    mileage,
    ownerId,
    user?.shop?.id,
  ]);

  // 🔹 Handle update
  const handleUpdate = async () => {
    const regPattern = /^[A-Z]{2,}-\d{1,3}[A-Z]?-?\d{1,4}$/;
    if (!regPattern.test(regNumber)) {
      toast.error("Please enter a valid registration number");
      return;
    }

    try {
      setLoading(true);
      const updatedData: CreateVehicleReq = {
        registration_number: regNumber,
        make: vehicleMake,
        model: vehicleModel,
        year: Number(vehicleYear),
        mileage: Number(vehicleMileage),
        owner_id: owner,
        shop_id: user!.shop?.id as string,
      };

      const data = await updateVehicle(updatedData, vehicleId);
      toast.success(data.message || "Vehicle updated successfully");
      fetchVehicles();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to update vehicle"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-transparent" variant="outline">
          Edit Vehicle
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <RegistrationInput
            value={regNumber}
            onChange={setRegNumber}
            label="Registration Number"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Make</Label>
              <Input
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                placeholder="e.g. Toyota"
              />
            </div>
            <div>
              <Label>Model</Label>
              <Input
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g. Corolla"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Year</Label>
              <Input
                type="number"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(+e.target.value)}
                placeholder="e.g. 2020"
              />
            </div>
            <div>
              <Label>Mileage (km)</Label>
              <Input
                type="number"
                value={vehicleMileage}
                onChange={(e) => setVehicleMileage(+e.target.value)}
                placeholder="e.g. 35000"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Owner</Label>
            {loadingCustomers ? (
              <div className="text-sm text-muted-foreground">
                Loading owners...
              </div>
            ) : (
              <Select value={owner} onValueChange={setOwner}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
