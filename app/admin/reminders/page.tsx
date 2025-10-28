"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/stores/auth-store";
import { deleteReminder, getAllRemindersByShopId, Reminder } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function RemindersPage() {
  const user = useAuthStore((s) => s.user);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"TODAY" | "WEEK" | "MONTH" | "ALL">(
    "ALL"
  );
  const [search, setSearch] = useState("");

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await getAllRemindersByShopId(user!.shop?.id as string);
      console.log(res.data);
      setReminders(res.data || []);
    } catch {
      toast.error("Failed to fetch reminders");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteReminder(id as string);
      toast.success("Reminder deleted");
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Failed to delete reminder");
    }
  };

  useEffect(() => {
    if (user) fetchReminders();
  }, [user]);

  // Filter logic
  const filteredReminders = useMemo(() => {
    const now = new Date();
    return reminders.filter((r) => {
      const due = new Date(r.due_date || r.created_at);
      const matchesSearch =
        r.owner?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.vehicle?.registration_number
          ?.toLowerCase()
          .includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === "TODAY") return due.toDateString() === now.toDateString();
      if (filter === "WEEK") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return due >= weekAgo && due <= now;
      }
      if (filter === "MONTH") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return due >= monthAgo && due <= now;
      }
      return true;
    });
  }, [reminders, filter, search]);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-5 md:gap-0 flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-xl font-semibold">Reminders</h1>
        <div className="flex items-center gap-2">
          {["Today", "This Week", "This Month", "All Time"].map((label, i) => {
            const keys = ["TODAY", "WEEK", "MONTH", "ALL"] as const;
            return (
              <Button
                key={i}
                size="sm"
                variant={filter === keys[i] ? "default" : "secondary"}
                onClick={() => setFilter(keys[i])}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by customer or reg#..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="rounded-lg border">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-5 w-1/5" />
                <Skeleton className="h-5 w-1/5" />
                <Skeleton className="h-5 w-1/5" />
                <Skeleton className="h-5 w-1/5" />
                <Skeleton className="h-5 w-1/5" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Reg#</TableHead>
                <TableHead>Whatsapp</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SMS</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReminders.length > 0 ? (
                filteredReminders.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {new Date(
                        r.due_date || r.created_at
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{r.owner?.name || "—"}</TableCell>
                    <TableCell>
                      {r.vehicle?.registration_number || "—"}
                    </TableCell>
                    {r.channelStatuses
                      ?.filter((z) => z.channel === "WHATSAPP")
                      .map((s) => (
                        <TableCell key={s.id}>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              s.status === "SENT"
                                ? "bg-green-100 text-green-700"
                                : s.status === "FAILED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {s.status}
                          </span>
                        </TableCell>
                      ))}
                    {r.channelStatuses
                      ?.filter((z) => z.channel === "EMAIL")
                      .map((s) => (
                        <TableCell key={s.id}>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              s.status === "SENT"
                                ? "bg-green-100 text-green-700"
                                : s.status === "FAILED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {s.status}
                          </span>
                        </TableCell>
                      ))}
                    {r.channelStatuses
                      ?.filter((z) => z.channel === "SMS")
                      .map((s) => (
                        <TableCell key={s.id}>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              s.status === "SENT"
                                ? "bg-green-100 text-green-700"
                                : s.status === "FAILED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {s.status}
                          </span>
                        </TableCell>
                      ))}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(r.id!)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No reminders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
