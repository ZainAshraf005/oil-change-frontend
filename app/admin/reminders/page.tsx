import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function RemindersPage() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reminders</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary">
            Today
          </Button>
          <Button size="sm" variant="secondary">
            This Week
          </Button>
          <Button size="sm" variant="secondary">
            This Month
          </Button>
          <Button size="sm" variant="secondary">
            All Time
          </Button>
        </div>
      </div>
      <Input placeholder="Search by customer, reg#, etc." />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Reg#</TableHead>
              <TableHead>Status</TableHead>
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
