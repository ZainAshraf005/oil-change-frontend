"use client";

import type React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import oilLogo from "@/public/on-time-oil.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

type NavItem = { href: string; label: string };

const superAdminNav: NavItem[] = [
  { href: "/super-admin", label: "Dashboard" },
  { href: "/super-admin/shops", label: "Shops" },
  { href: "/super-admin/packages", label: "Packages" },
  { href: "/super-admin/assign-package", label: "Assign Package" },
  { href: "/super-admin/settings", label: "Settings" },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/vehicles", label: "Vehicles" },
  { href: "/admin/sales", label: "Sales" },
  { href: "/admin/reminders", label: "Reminders" },
  { href: "/admin/settings", label: "Settings" },
];

export function AppShell({
  role,
  children,
}: {
  role: "SUPERADMIN" | "ADMIN";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const nav = role === "SUPERADMIN" ? superAdminNav : adminNav;
  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar className="border-r ">
        <SidebarHeader className="p-3">
          <Link
            href={role === "SUPERADMIN" ? "/super-admin" : "/admin"}
            className="flex items-center gap-2 px-1"
          >
            <div className="size-6 rounded bg-red-700">
              <Image src={oilLogo} alt="logo" width={100} height={100} />
            </div>
            <span className="text-sm font-medium">One Time Oil</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {nav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !==
                    (role === "SUPERADMIN" ? "/super-admin" : "/admin") &&
                    pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} prefetch>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
          <div className="px-2 py-2 text-xs text-muted-foreground">
            <div className="mb-2">
              Signed in as
              <span className="ml-1 font-medium">
                {user?.email ||
                  (role === "SUPERADMIN" ? "Super Admin" : "Admin")}
              </span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b bg-background px-3">
          <SidebarTrigger />

          <div className="flex text-muted-foreground items-center cursor-pointer ">
            <ChevronLeft onClick={() => router.back()} size={20} />
            <ChevronRight onClick={() => router.forward()} size={20} />
          </div>
          <div className="text-sm text-muted-foreground">
            {role === "SUPERADMIN" ? "Super Admin" : "Admin"} Panel
          </div>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
