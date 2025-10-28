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
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Users,
  Phone,
  MessageCircle,
  Mail,
  ChevronRight,
} from "lucide-react";

export default function CustomersPage() {
  const user = useAuthStore((s) => s.user);
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

  // 🟢 Filter customers based on search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      whatsapp: whatsapp || phone,
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

  const handleReset = () => {
    setName("");
    setPhone("");
    setWhatsapp("");
    setEmail("");
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
          {/* Customers List - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Desktop Table View */}
            <Card className="border-0 shadow-sm hidden md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b hover:bg-transparent">
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3  max-h-96 overflow-y-auto">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm p-4">
                    <Skeleton className="h-12 w-full" />
                  </Card>
                ))
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <Card
                    key={c.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`customers/${c.id}`)}
                  >
                    <div className="px-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base capitalize truncate">
                          {c.name}
                        </h3>
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3 shrink-0" />
                            <span className="font-mono">{c.phone}</span>
                          </div>
                          {c.whatsapp && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MessageCircle className="w-3 h-3 shrink-0" />
                              <span className="font-mono">{c.whatsapp}</span>
                            </div>
                          )}
                          {c.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate text-xs">
                                {c.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-sm p-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No customers found."
                      : "No customers yet. Add one using the form."}
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Add Customer Form - Right Side */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm lg:sticky lg:top-4 h-fit">
              <CardHeader className="pb-3 sm:pb-4">
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
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs sm:text-sm">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Customer name"
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="phone"
                      className="text-xs sm:text-sm flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Phone</span>
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92..."
                      className="text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="whatsapp"
                      className="text-xs sm:text-sm flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </Label>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+92..."
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-xs sm:text-sm flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    onClick={handleCreateCustomer}
                    disabled={saving || !name.trim() || !phone.trim()}
                    className="flex-1 text-sm"
                  >
                    {saving ? "Saving..." : "Save Customer"}
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
