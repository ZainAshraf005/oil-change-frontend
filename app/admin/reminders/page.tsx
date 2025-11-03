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
import {
  deleteReminder,
  getAllRemindersByShopId,
  Reminder,
  sendReminder,
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { AxiosError } from "axios";

export default function RemindersPage() {
  const user = useAuthStore((s) => s.user);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(0);
  const [filter, setFilter] = useState<"TODAY" | "WEEK" | "MONTH" | "ALL">(
    "ALL"
  );
  const [search, setSearch] = useState("");

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await getAllRemindersByShopId(user!.shop?.id as string);
      setReminders(res.data || []);
    } catch {
      toast.error("Failed to fetch reminders");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      setLoadingId(Number(id));
      await deleteReminder(id as string);
      toast.success("Reminder deleted");
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Failed to delete reminder");
    } finally {
      setLoadingId(0);
    }
  };

  useEffect(() => {
    if (user) fetchReminders();
  }, [user]);

  const handleReminderSend = async (id: string) => {
    try {
      const data = await sendReminder(user?.shop?.id as string, id);
      console.log(data);
      fetchReminders();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "error calling api");
      }
    }
  };

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Reg#</TableHead>
              <TableHead>Whatsapp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>SMS</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              // Skeleton rows
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-4 w-8 mx-auto bg-muted animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredReminders.length > 0 ? (
              filteredReminders.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {new Date(r.due_date || r.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{r.owner?.name || "—"}</TableCell>
                  <TableCell>{r.vehicle?.registration_number || "—"}</TableCell>

                  {/* WhatsApp */}
                  <TableCell>
                    {r.channelStatuses?.find(
                      (s) => s.channel === "WHATSAPP"
                    ) ? (
                      <div className="relative group inline-block cursor-pointer">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                            r.channelStatuses.find(
                              (s) => s.channel === "WHATSAPP"
                            )?.status === "SENT"
                              ? "bg-green-100 text-green-700"
                              : r.channelStatuses.find(
                                  (s) => s.channel === "WHATSAPP"
                                )?.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {
                            r.channelStatuses.find(
                              (s) => s.channel === "WHATSAPP"
                            )?.status
                          }
                        </span>

                        {/* Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap z-10">
                          {r.channelStatuses.find(
                            (s) => s.channel === "WHATSAPP"
                          )?.error || "No error"}
                        </div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    {r.channelStatuses?.find((s) => s.channel === "EMAIL") ? (
                      <div className="relative group inline-block">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                            r.channelStatuses.find((s) => s.channel === "EMAIL")
                              ?.status === "SENT"
                              ? "bg-green-100 text-green-700"
                              : r.channelStatuses.find(
                                  (s) => s.channel === "EMAIL"
                                )?.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {
                            r.channelStatuses.find((s) => s.channel === "EMAIL")
                              ?.status
                          }
                        </span>

                        {/* Hover tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap z-10">
                          {r.channelStatuses.find((s) => s.channel === "EMAIL")
                            ?.error || "No error"}
                        </div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* SMS */}
                  <TableCell>
                    {r.channelStatuses?.find((s) => s.channel === "SMS") ? (
                      <div className="relative group inline-block">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                            r.channelStatuses.find((s) => s.channel === "SMS")
                              ?.status === "SENT"
                              ? "bg-green-100 text-green-700"
                              : r.channelStatuses.find(
                                  (s) => s.channel === "SMS"
                                )?.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {
                            r.channelStatuses.find((s) => s.channel === "SMS")
                              ?.status
                          }
                        </span>

                        {/* Hover tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap z-10">
                          {r.channelStatuses.find((s) => s.channel === "SMS")
                            ?.error || "No error"}
                        </div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(r.id!)}
                    >
                      {loadingId === r.id ? (
                        <Spinner />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleReminderSend(r.id as string)}
                      size={"sm"}
                      className="cursor-pointer"
                    >
                      send now
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No reminders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
