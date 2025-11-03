"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSuperAdminStats, type SuperAdminStats } from "@/lib/api";

import Link from "next/link";
import { SuperAdminSkeleton } from "@/components/super-admin-skeleton";
import { useSuperDashboardStore } from "@/stores/super-dashboard-store";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setData } = useSuperDashboardStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getSuperAdminStats();
        if (response.success) {
          setStats(response.data);
          setData(response.data);
        } else {
          setError("Failed to fetch statistics");
        }
      } catch (err) {
        setError("Error fetching dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <SuperAdminSkeleton />;

  if (error) {
    return (
      <section className="space-y-6 p-4 md:p-6">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-pretty">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of shops, packages, revenue, and system usage.
        </p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Shops */}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
            <CardDescription>Active shops in system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalShops}</p>
            <p className="text-xs text-muted-foreground mt-2">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        {/* Active Packages */}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Active Packages
            </CardTitle>
            <CardDescription>Running subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.activePackages}</p>
            <p className="text-xs text-muted-foreground mt-2">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}

        <Card className="sm:col-span-2 lg:col-span-1 sm:flex sm:flex-row sm:justify-between sm:items-center lg:block">
          <CardHeader className="pb-3 w-full">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-medium text-muted-foreground">
                ₨
              </span>
              <p className="text-3xl font-bold tracking-tight">
                {stats?.totalRevenue.toLocaleString("en-PK")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Sales Trend Chart */}

        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.salesTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  name="Sales Count"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  name="Revenue (₨)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Shops Chart */}

        <Card>
          <CardHeader>
            <CardTitle>Top Shops</CardTitle>
            <CardDescription>By sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.topShops || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue (₨)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Recent Shops */}

        <Card>
          <CardHeader>
            <CardTitle>Recent Shops</CardTitle>
            <CardDescription>Latest shops added to system</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                {stats?.recentShops.map((shop) => (
                  <Link
                    href={`/super-admin/shops/${shop.id}`}
                    key={shop.id}
                    className="flex justify-between items-center rounded-lg p-3 border hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{shop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(shop.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Reminder Statistics */}

        <Card>
          <CardHeader>
            <CardTitle>Reminder Statistics</CardTitle>
            <CardDescription>Message delivery status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sent</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.reminderStats.sent.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Successfully delivered
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats?.reminderStats.failed.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Delivery failed</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Queued</p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats?.reminderStats.queued.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Pending delivery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
