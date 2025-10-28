"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { login } from "@/lib/api";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successLoading, setSuccessLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const setUser = useAuthStore((s) => s.login);
  const router = useRouter();

  useEffect(() => {
    if (successLoading) {
      const timer = setTimeout(() => {
        if (userRole === "SUPERADMIN") router.push("/super-admin");
        else router.push("/admin");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successLoading, userRole, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      setUser(res.user);
      setUserRole(res.user.role);
      setSuccessLoading(true);
    } catch (err) {
      if (err instanceof AxiosError && err.response)
        toast.error(err.response.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        {successLoading ? (
          <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
            <div className="hidden md:flex flex-col justify-between bg-linear-to-br from-primary/5 to-primary/10 p-8 md:p-12">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center border-2 border-primary/30">
                  <span className="text-2xl font-bold text-primary">OTO</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">
                    OnTimeOil
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Manage your auto shop, track customer vehicles, schedule oil
                    change reminders, and send automated follow-up messages—all
                    in one platform.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-muted-foreground">
                    Multi-shop management
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-muted-foreground">
                    Customer & vehicle tracking
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-muted-foreground">
                    Automated reminders & follow-ups
                  </span>
                </div>
              </div>
            </div>

            {/* Success Animation Screen */}
            <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
              {/* Animated Checkmark */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-primary animate-in zoom-in duration-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                      style={{
                        strokeDasharray: 24,
                        strokeDashoffset: 24,
                        animation: "dash 0.6s ease-in-out 0.3s forwards",
                      }}
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome back!
                </h2>
                <p className="text-muted-foreground">
                  Redirecting to your dashboard...
                </p>
              </div>

              {/* Loading Dots */}
              <div className="flex gap-2 animate-in fade-in duration-700 delay-500">
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="hidden md:flex flex-col justify-between bg-linear-to-br from-primary/5 to-primary/10 p-8 md:p-12">
              <div className="space-y-6">
                {/* Logo Placeholder */}
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center border-2 border-primary/30">
                  <span className="text-2xl font-bold text-primary">OTO</span>
                </div>

                {/* Company Info */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">
                    OnTimeOil
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Manage your auto shop, track customer vehicles, schedule oil
                    change reminders, and send automated follow-up messages—all
                    in one platform.
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-muted-foreground">
                    Multi-shop management
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-muted-foreground">
                    Customer & vehicle tracking
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-muted-foreground">
                    Automated reminders & follow-ups
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your OnTimeOil account
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>

                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Field>

                <FieldSeparator>Or continue with</FieldSeparator>
              </FieldGroup>
            </form>
          </CardContent>
        )}
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
