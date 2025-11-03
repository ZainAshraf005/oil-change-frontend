"use client";

import { useEffect } from "react";
import { getAdminDashboardStats } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useDashboardStore } from "@/stores/dashboard-store";

export const useSetDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { setData } = useDashboardStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.shop?.id) return;

      try {
        const res = await getAdminDashboardStats(user.shop.id as string);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboard();
  }, [user?.shop?.id, setData]);
};
