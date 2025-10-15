import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SalesPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Sales</h1>
      <Card>
        <CardHeader>
          <CardTitle>Record a Sale</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label>Vehicle (by Reg#)</Label>
            <Input placeholder="Search/Add vehicle by registration" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Product</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p1">Shell Helix 5W-30</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity (L or ml)</Label>
              <Input type="text" placeholder="3.5 L or 3500 ml" />
            </div>
            <div>
              <Label>Odometer (km)</Label>
              <Input type="number" placeholder="65000" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Payment</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Cash" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reminder Days</Label>
              <Input type="number" min={1} max={365} placeholder="15" />
            </div>
            <div>
              <Label>Notes</Label>
              <Input placeholder="Optional" />
            </div>
          </div>
          <Button>Record Sale</Button>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <div className="flex items-center gap-2 p-3">
          <Button size="sm" variant="secondary">
            Today
          </Button>
          <Button size="sm" variant="secondary">
            7 days
          </Button>
          <Button size="sm" variant="secondary">
            30 days
          </Button>
          <Button size="sm" variant="secondary">
            All time
          </Button>
          <Input className="ml-auto max-w-xs" placeholder="Search by reg#, product..." />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Qty (L)</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>—</TableCell>
              <TableCell>—</TableCell>
              <TableCell>—</TableCell>
              <TableCell>—</TableCell>
              <TableCell>—</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
