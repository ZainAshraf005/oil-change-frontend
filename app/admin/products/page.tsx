"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { computePrice, normalizeToLiters } from "@/lib/helpers/unit-conversion"

export default function ProductsPage() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [pricePerLiter, setPricePerLiter] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(0)
  const [unit, setUnit] = useState<"L" | "ML">("L")

  const total = computePrice(normalizeToLiters(quantity, unit), pricePerLiter)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Shell Helix 5W-30" />
              </div>
              <div className="grid gap-2">
                <Label>Price per Liter</Label>
                <Input type="number" value={pricePerLiter} onChange={(e) => setPricePerLiter(+e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Quantity</Label>
                  <Input type="number" value={quantity} onChange={(e) => setQuantity(+e.target.value)} />
                </div>
                <div>
                  <Label>Unit</Label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as "L" | "ML")}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="L">Liters</option>
                    <option value="ML">Milliliters</option>
                  </select>
                </div>
              </div>
              <div className="rounded-md border p-2 text-sm">
                Auto price calculation example: {isFinite(total) ? total.toFixed(2) : "—"}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price/L</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Placeholder row */}
            <TableRow>
              <TableCell>—</TableCell>
              <TableCell>—</TableCell>
              <TableCell>—</TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-2">
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
