"use client";

import { Shop } from "@/lib/api";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "SUPERADMIN" | "ADMIN";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone:string;
  shop?: Shop;
};

type AuthState = {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "ocr-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state && console.log("✅ Zustand rehydrated:");
      },
    }
  )
);

export const isAuthenticated = () => !!useAuthStore.getState().user;
export const getRole = () => useAuthStore.getState().user?.role;
