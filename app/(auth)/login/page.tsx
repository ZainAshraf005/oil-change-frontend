"use client";
import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  useEffect(() => {
    if (user)
      user.role === "SUPERADMIN"
        ? router.push("/super-admin")
        : router.push("/admin");
  }, [user,router]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
