import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Lock,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
} from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Link from "next/link";

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Back button placeholder */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/super-admin/shops" prefetch>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Shop</h1>
        <p className="text-muted-foreground mt-1">
          Update shop and admin information
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
        {/* 🏪 Shop Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>Update the shop details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Shop Name */}
              <div className="space-y-2">
                <Label htmlFor="shopName" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Shop Name <span className="text-destructive">*</span>
                </Label>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label
                  htmlFor="shopAddress"
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Info box */}
              <div className="bg-muted/50 rounded-lg p-4 mt-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Update the shop information and admin details above.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🧑 Admin Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Admin Information</CardTitle>
                <CardDescription>
                  Update the shop administrator details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Admin Name */}
              <div className="space-y-2">
                <Label htmlFor="adminName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email <span className="text-destructive">*</span>
                </Label>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="adminPassword"
                  className="flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="adminPhone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Button */}
              <Button className="w-full mt-6">Update Shop</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
