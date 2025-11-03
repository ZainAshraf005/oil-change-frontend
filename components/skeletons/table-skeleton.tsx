import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="font-semibold">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="font-semibold hidden md:table-cell">
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead className="font-semibold hidden lg:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="font-semibold text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
