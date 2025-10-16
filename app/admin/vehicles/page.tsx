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
import { formatReg } from "@/lib/helpers/reg-normalizer";

export default function VehiclesPage() {
  const example = formatReg("abc 123");
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Vehicles</h1>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reg#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Make/Model</TableHead>
                <TableHead>Year</TableHead>
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
          <CardTitle>Add Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label>Reg# (normalized example)</Label>
            <Input value={example} readOnly />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Make</Label>
              <Input placeholder="Toyota" />
            </div>
            <div>
              <Label>Model</Label>
              <Input placeholder="Corolla" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Year</Label>
              <Input type="number" placeholder="2020" />
            </div>
            <div>
              <Label>Mileage (km)</Label>
              <Input type="number" placeholder="65000" />
            </div>
          </div>
          <div>
            <Label>Assign Customer</Label>
            <Input placeholder="Search or select customer" />
          </div>
          <Button className="mt-1">Save</Button>
        </CardContent>
      </Card>
    </section>
  );
}
