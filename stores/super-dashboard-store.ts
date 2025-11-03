"use client";

import { SuperAdminStats } from "@/lib/api";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type DashboardState = {
  data: SuperAdminStats | null;
  setData: (data: SuperAdminStats) => void;
  clearData: () => void;
};

export const useSuperDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set({ data }),
      clearData: () => set({ data: null }),
    }),
    {
      name: "super-admin-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ data: state.data }),
      onRehydrateStorage: () => (state) => {
        state && console.log("✅ Dashboard store rehydrated");
      },
    }
  )
);

export const getDashboardData = () => useSuperDashboardStore.getState().data;
export const hasDashboardData = () => !!useSuperDashboardStore.getState().data;
