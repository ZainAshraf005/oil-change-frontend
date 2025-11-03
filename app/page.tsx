"use client"

import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleDashboardClick = () => {
    if (!user) router.push("/login")
    else if (user.role === "SUPERADMIN") router.push("/super-admin")
    else router.push("/admin")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-white to-gray-100 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          On<span className="text-primary">Time</span>Oil
        </h1>
        <p className="mt-3 text-gray-600 text-lg">
          Smart oil change reminders to keep your customers’ vehicles running smoothly.
        </p>

        <div className="mt-8">
          {user ? (
            <Button onClick={handleDashboardClick} size="lg">
              Go to Dashboard
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/login" prefetch>
                Login to Dashboard
              </Link>
            </Button>
          )}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Want to register your shop on OnTimeOil?</p>
          <p>
            Email us at{" "}
            <a
              href="mailto:support@ontimeoil.com"
              className="text-primary font-medium hover:underline"
            >
              support@ontimeoil.com
            </a>
          </p>
        </div>
      </motion.div>

      <footer className="absolute bottom-4 text-xs text-gray-400">
        © {new Date().getFullYear()} OnTimeOil. All rights reserved.
      </footer>
    </main>
  )
}
