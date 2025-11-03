"use client";

import { AdminDashboardStats } from "@/lib/api";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type DashboardState = {
  data: AdminDashboardStats | null;
  setData: (data: AdminDashboardStats) => void;
  clearData: () => void;
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set({ data }),
      clearData: () => set({ data: null }),
    }),
    {
      name: "dashboard-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ data: state.data }),
      onRehydrateStorage: () => (state) => {
        state && console.log("✅ Dashboard store rehydrated");
      },
    }
  )
);

export const getDashboardData = () => useDashboardStore.getState().data;
export const hasDashboardData = () => !!useDashboardStore.getState().data;
