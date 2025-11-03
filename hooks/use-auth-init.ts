// useAuthInit.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { validate } from "@/lib/api";

export const useAuthInit = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {  
      console.log("verifying");
      if (!user) router.push("/login"); // No user, nothing to check

      try {
        const res = await validate();
        if (!res.data.valid) {
          logout();
          router.push("/login");
        }
      } catch (err) {
        logout();
        router.push("/login");
      }
    };

    verifyAuth();
  }, []);
};
