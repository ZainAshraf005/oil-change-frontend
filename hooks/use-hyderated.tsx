import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
};
