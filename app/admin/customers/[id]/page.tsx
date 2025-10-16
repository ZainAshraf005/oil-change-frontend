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
import { Customer, getCustomerById } from "@/lib/api"; // you can implement these APIs later
import CustomerDelete from "@/components/customer-delete";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerById(id as string);
        setCustomer(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleEdit = () => {
    router.push(`/customers/edit/${id}`);
  };

  const goToCustomerPage = () => {
    router.push("/admin/customers");
  };

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>No customer found.</p>;

  return (
    <section className="space-y-6">
      {/* --- Customer Details --- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Details</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              Edit
            </Button>
            <CustomerDelete
              customerName={customer.name}
              customerId={customer.id}
              fetchCustomers={goToCustomerPage}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-2">
          <p>
            <strong>Name:</strong> {customer.name}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phone}
          </p>
          <p>
            <strong>WhatsApp:</strong> {customer.whatsapp || "—"}
          </p>
          <p>
            <strong>Email:</strong> {customer.email || "—"}
          </p>
        </CardContent>
      </Card>

      {/* --- Vehicles Table (Dummy for now) --- */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>ABC-123</TableCell>
                <TableCell>Corolla</TableCell>
                <TableCell>Toyota</TableCell>
                <TableCell>2020</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>XYZ-987</TableCell>
                <TableCell>Civic</TableCell>
                <TableCell>Honda</TableCell>
                <TableCell>2022</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- Reminders Table (Dummy for now) --- */}
      <Card>
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Oil Change</TableCell>
                <TableCell>2025-11-01</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tire Check</TableCell>
                <TableCell>2025-12-10</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
