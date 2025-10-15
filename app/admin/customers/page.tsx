import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CustomersPage() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Customers</h1>
          <Button>Add Customer</Button>
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
              <TableRow>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add Customer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input placeholder="Customer name" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Phone</Label>
              <Input placeholder="+92..." />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input placeholder="+92..." />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="name@example.com" />
            </div>
          </div>
          <Button>Save</Button>
        </CardContent>
      </Card>
    </section>
  )
}
