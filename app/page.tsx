"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    } else if (user.role === "SUPERADMIN") {
      router.replace("/super-admin")
    } else {
      router.replace("/admin")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <p className="text-muted-foreground">Redirecting you to your dashboard…</p>
      <Button asChild variant="secondary">
        <Link href="/login" prefetch>Go to Login</Link>
      </Button>
    </div>
  )
}
