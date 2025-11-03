"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { useHydrated } from "@/hooks/use-hyderated";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hyderated = useHydrated();

  useEffect(() => {
    if (!hyderated) return;
    if (!user) router.replace("/login");
    else if (user.role !== "ADMIN") router.replace("/super-admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user || user.role !== "ADMIN") return null;

  return <AppShell role="ADMIN" >{children}</AppShell>;
}
