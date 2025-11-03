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
  type CreateCustomerReq,
  getAllCustomers,
  type Customer,
  getAdminDashboardStats,
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useDashboardStore } from "@/stores/dashboard-store";

export default function CustomersPage() {
  const user = useAuthStore((s) => s.user);
  const { setData } = useDashboardStore();
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);

  // 🟢 Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers(user!.shop?.id as string);
      setCustomers(data.data || []);
    } catch {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.shop?.id) fetchCustomers();
  }, [user?.shop?.id]);

  // 🟢 Filter customers
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🟢 Enforce +92 formatting and limit to 13 chars
  const formatPhone = (val: string) => {
    let clean = val.replace(/\D/g, ""); // digits only

    // remove leading 0 if present
    if (clean.startsWith("0")) clean = clean.substring(1);

    // add +92 if not there
    if (!clean.startsWith("92")) clean = "92" + clean;

    // limit total length to "+92" + 10 digits → 13 characters total
    clean = clean.slice(0, 12); // "92" + 10 digits = 12 numeric chars

    return "+" + clean;
  };

  // 🟢 Handle phone changes
  const handlePhoneChange = (val: string) => {
    const formatted = formatPhone(val);
    setPhone(formatted);
    if (sameAsPhone) setWhatsapp(formatted);
  };

  const handleWhatsappChange = (val: string) => {
    const formatted = formatPhone(val);
    setWhatsapp(formatted);
  };

  const fetchDashboard = async () => {
    const res = await getAdminDashboardStats(user?.shop?.id as string);
    setData(res.data);
  };

  // 🟢 Create new customer
  const handleCreateCustomer = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    const submitData: CreateCustomerReq = {
      shop_id: user!.shop?.id as string,
      name,
      phone,
      whatsapp: sameAsPhone ? phone : whatsapp,
      email,
    };

    try {
      setSaving(true);
      const data = await createCustomer(submitData);
      toast.success(data.message || "Customer added successfully");
      await fetchCustomers();
      setName("");
      setPhone("");
      setWhatsapp("");
      setEmail("");
      setSameAsPhone(true);
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data?.message || "Failed to create customer"
        );
      else toast.error("Unexpected error");
    } finally {
      setSaving(false);
      fetchDashboard();
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setWhatsapp("");
    setEmail("");
    setSameAsPhone(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                Customers
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your customer database
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm"
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Customers List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-sm hidden md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                      <TableHead className="font-semibold hidden lg:table-cell">
                        WhatsApp
                      </TableHead>
                      <TableHead className="font-semibold hidden xl:table-cell">
                        Email
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-28" />
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <Skeleton className="h-4 w-40" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredCustomers.length > 0 ? (
                      filteredCustomers.map((c) => (
                        <TableRow
                          key={c.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => router.push(`customers/${c.id}`)}
                          onMouseEnter={() =>
                            router.prefetch(`customers/${c.id}`)
                          }
                        >
                          <TableCell className="font-medium capitalize">
                            {c.name}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {c.phone}
                          </TableCell>
                          <TableCell className="font-mono text-sm hidden lg:table-cell">
                            {c.whatsapp || "—"}
                          </TableCell>
                          <TableCell className="text-sm hidden xl:table-cell">
                            {c.email || "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          {searchTerm
                            ? "No customers found."
                            : "No customers yet. Add one using the form."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Add Customer Form */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm lg:sticky lg:top-4 h-fit">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base sm:text-lg">
                    Add Customer
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Register a new customer to your database
                </p>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Customer name"
                  />
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+923001234567"
                  />
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-between">
                  <Label className="text-xs sm:text-sm flex items-center gap-2">
                    Keep WhatsApp same as phone
                  </Label>
                  <Switch
                    checked={sameAsPhone}
                    onCheckedChange={setSameAsPhone}
                  />
                </div>

                {/* WhatsApp */}
                {!sameAsPhone && (
                  <div className="grid gap-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => handleWhatsappChange(e.target.value)}
                      placeholder="+923001234567"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    onClick={handleCreateCustomer}
                    disabled={saving || !name.trim() || !phone.trim()}
                    className="flex-1"
                  >
                    {saving ? "Saving..." : "Save Customer"}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
