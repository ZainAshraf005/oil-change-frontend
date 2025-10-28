"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton component for the PackagesPage.
 * It mimics the two-column layout (Package List and Create Package Form)
 * to provide a smooth loading experience without layout shifts.
 */
export default function PackageSkeleton() {
  // Array to map and create multiple package list item placeholders
  const packageListItems = [1, 2, 3, 4];

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {/* Left Side: Package List Skeletons */}
      <div className="space-y-3">
        {/* Title Placeholder */}
        <Skeleton className="h-7 w-36" /> 
        
        {/* Package List Container Placeholder */}
        <div className="rounded-lg border p-4 text-sm text-muted-foreground space-y-3">
          {packageListItems.map((i) => (
            <div
              key={i}
              className="border rounded p-3 flex justify-between items-center"
            >
              <div className="flex flex-col gap-2 w-3/4">
                {/* Package Name */}
                <Skeleton className="h-4 w-1/2" /> 
                {/* Limits/Details */}
                <div className="flex gap-2">
                    <Skeleton className="h-3 w-1/6" /> 
                    <Skeleton className="h-3 w-1/6" /> 
                    <Skeleton className="h-3 w-1/6" /> 
                </div>
              </div>
              <div className="flex gap-2">
                {/* Edit/Delete Button Placeholders */}
                <Skeleton className="h-8 w-8 rounded" /> 
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Create/Edit Form Card Skeleton */}
      <Card>
        <CardHeader>
          {/* Card Title Placeholder */}
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Name Input Placeholder */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-12" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>

            {/* Checkboxes Placeholder */}
            <div className="flex flex-wrap gap-6">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Conditional Inputs Placeholder (Mimicking all are open) */}
            <div className="grid gap-3">
              <div className="grid gap-1">
                <Skeleton className="h-4 w-20" /> {/* Email Label */}
                <Skeleton className="h-10 w-full" /> {/* Email Input */}
              </div>
              <div className="grid gap-1">
                <Skeleton className="h-4 w-16" /> {/* SMS Label */}
                <Skeleton className="h-10 w-full" /> {/* SMS Input */}
              </div>
              <div className="grid gap-1">
                <Skeleton className="h-4 w-24" /> {/* WhatsApp Label */}
                <Skeleton className="h-10 w-full" /> {/* WhatsApp Input */}
              </div>
            </div>

            {/* Submit Button Placeholder */}
            <Skeleton className="h-10 w-full" />
          </div> {/* Corrected: This div closes the grid started in CardContent */}
        </CardContent>
      </Card>
    </section>
  );
}
