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
import {
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "@/components/dashboard/stat-card-skeleton";
import Link from "next/link";


export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getSuperAdminStats();
        if (response.success) {
          setStats(response.data);
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Shops */}
        {loading ? (
          <StatCardSkeleton />
        ) : (
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
        )}

        {/* Active Packages */}
        {loading ? (
          <StatCardSkeleton />
        ) : (
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
        )}

        {/* Total Revenue */}
        {loading ? (
          <StatCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
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
        )}

        {/* Quota Usage */}
        {loading ? (
          <StatCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                System Quota
              </CardTitle>
              <CardDescription>Resource usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={stats?.quotaUsage || 0} className="h-2" />
              <p className="text-sm font-medium">{stats?.quotaUsage}% used</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Sales Trend Chart */}
        {loading ? (
          <ChartSkeleton />
        ) : (
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
        )}

        {/* Top Shops Chart */}
        {loading ? (
          <ChartSkeleton />
        ) : (
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
        )}
      </div>

      {/* Channel Usage & Reminders Row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Email Usage */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email Usage</CardTitle>
              <CardDescription>Messages sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    {stats?.channelUsage.email.used.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stats?.channelUsage.email.limit.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={
                    ((stats?.channelUsage.email.used || 0) /
                      (stats?.channelUsage.email.limit || 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  ((stats?.channelUsage.email.used || 0) /
                    (stats?.channelUsage.email.limit || 1)) *
                    100
                )}
                % of quota used
              </p>
            </CardContent>
          </Card>
        )}

        {/* SMS Usage */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SMS Usage</CardTitle>
              <CardDescription>Messages sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    {stats?.channelUsage.sms.used.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stats?.channelUsage.sms.limit.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={
                    ((stats?.channelUsage.sms.used || 0) /
                      (stats?.channelUsage.sms.limit || 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  ((stats?.channelUsage.sms.used || 0) /
                    (stats?.channelUsage.sms.limit || 1)) *
                    100
                )}
                % of quota used
              </p>
            </CardContent>
          </Card>
        )}

        {/* WhatsApp Usage */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">WhatsApp Usage</CardTitle>
              <CardDescription>Messages sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    {stats?.channelUsage.whatsapp.used.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stats?.channelUsage.whatsapp.limit.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={
                    ((stats?.channelUsage.whatsapp.used || 0) /
                      (stats?.channelUsage.whatsapp.limit || 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  ((stats?.channelUsage.whatsapp.used || 0) /
                    (stats?.channelUsage.whatsapp.limit || 1)) *
                    100
                )}
                % of quota used
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Recent Shops */}
        {loading ? (
          <TableSkeleton />
        ) : (
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
        )}

        {/* Reminder Statistics */}
        {loading ? (
          <TableSkeleton />
        ) : (
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
                  <p className="text-xs text-muted-foreground">
                    Delivery failed
                  </p>
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
        )}
      </div>
    </section>
  );
}
