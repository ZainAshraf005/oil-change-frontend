"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { DashboardStats, getDashboardStats } from "@/lib/api";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalShops: 0,
    activePackages: 0,
    quotaUsage: 0,
    recentShops: [],
  });

  const fetchDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      console.log(data);
      setStats(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pretty">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of shops, packages, and quota usage.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Shops</CardTitle>
            <CardDescription>Number of shops registered</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.totalShops}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Packages</CardTitle>
            <CardDescription>Currently running packages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.activePackages}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quota Usage</CardTitle>
            <CardDescription>System resource usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={stats.quotaUsage} className="h-4 rounded-full" />
            <p className="text-sm text-muted-foreground">
              {stats.quotaUsage}% used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shops */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Shops</CardTitle>
          <CardDescription>Latest shops added to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40">
            <div className="space-y-3">
              {stats?.recentShops?.map((shop) => (
                <Link
                  href={`super-admin/shops/${shop.id}`}
                  key={shop.id}
                  className="flex justify-between items-center rounded-lg p-3 border hover:bg-muted transition-colors"
                >
                  <p className="font-medium">{shop?.name}</p>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}
