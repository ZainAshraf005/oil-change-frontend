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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCustomer,
  CreateCustomerReq,
  getAllCustomers,
  Customer,
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // 🟢 Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers(user!.shop_id as string);
      setCustomers(data.data || []);
    } catch (err) {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    if (user?.shop_id) fetchCustomers();
  }, [user?.shop_id]);

  // 🟢 Create new customer
  const handleCreateCustomer = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    const submitData: CreateCustomerReq = {
      shop_id: user!.shop_id!,
      name,
      phone,
      whatsapp: whatsapp || phone,
      email,
    };

    try {
      setSaving(true);
      const data = await createCustomer(submitData);
      toast.success(data.message || "Customer added successfully");

      // refresh list
      await fetchCustomers();

      // reset fields
      setName("");
      setPhone("");
      setWhatsapp("");
      setEmail("");
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data?.message || "Failed to create customer"
        );
      else toast.error("Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {/* 🧾 Customers Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Customers</h1>
          <Button variant="outline" onClick={fetchCustomers} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : customers.length > 0 ? (
                customers.map((c) => (
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => router.push(`customers/${c.id}`)}
                    key={c.id}
                  >
                    <TableCell className="font-medium capitalize">
                      {c.name}
                    </TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.whatsapp || "—"}</TableCell>
                    <TableCell>{c.email || "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 🧍 Add New Customer */}
      <Card>
        <CardHeader>
          <CardTitle>Add Customer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92..."
              />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+92..."
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>
          <Button onClick={handleCreateCustomer} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
