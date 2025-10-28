"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton component for the Assign Package page.
 * It mirrors the layout: Header, a wide Form Card, and a narrow Summary Card.
 */
export default function AssignPackageSkeleton() {
  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      {/* Header Skeleton */}
      <header className="mb-4 md:mb-6 space-y-2">
        {/* Title Placeholder */}
        <Skeleton className="h-8 w-64" />
        {/* Subtitle Placeholder */}
        <Skeleton className="h-4 w-96" />
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {/* Form Card Skeleton (md:col-span-2) */}
        <Card className="md:col-span-2">
          <CardHeader>
            {/* Form Card Title */}
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Shop Selector Placeholder */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Select/Input */}
            </div>

            {/* Package Selector Placeholder */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Select/Input */}
            </div>

            {/* Start Date Placeholder */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-48" /> {/* Date Picker */}
            </div>

            {/* Assign Button Placeholder */}
            <div className="pt-2">
                <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Summary Card Skeleton (md:col-span-1) */}
        <Card className="md:col-span-1">
          <CardHeader>
            {/* Summary Card Title */}
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Summary Text Placeholder */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
