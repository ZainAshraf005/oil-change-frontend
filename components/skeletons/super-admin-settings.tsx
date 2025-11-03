"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";

/**
 * Skeleton component for the Super Admin Quota Settings page.
 * It mirrors the layout of the SuperAdminSettings component.
 */
export default function SuperAdminSettingsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-6 h-6 text-primary opacity-50" />
            </div>
            {/* Title Placeholder */}
            <Skeleton className="h-8 w-64" />
          </div>
          {/* Subtitle Placeholder */}
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Current Usage Card Skeleton (The first, smaller card) */}
        <Card className="border-border/50 shadow-sm transition-shadow">
          <CardHeader className="pb-4">
            {/* Card Title Placeholder */}
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Usage Line 1 */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-6 w-full" /> {/* Progress Bar Placeholder */}
            </div>
            {/* Usage Line 2 */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" /> {/* Label */}
              <Skeleton className="h-6 w-full" /> {/* Progress Bar Placeholder */}
            </div>
          </CardContent>
        </Card>

        {/* Main Settings Card Skeleton */}
        <Card className="border-primary/20 shadow-sm transition-shadow">
          <CardHeader className="pb-4 border-b space-y-2">
            {/* Card Title Placeholder */}
            <Skeleton className="h-6 w-48" />
            {/* Card Description Placeholder */}
            <Skeleton className="h-4 w-72" />
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            
            {/* Email Limit Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded-full" /> {/* Icon Placeholder */}
                <Skeleton className="h-5 w-24" /> {/* Label */}
              </div>
              <Skeleton className="h-10 w-full" /> {/* Input Placeholder */}
              <Skeleton className="h-3 w-3/4" /> {/* Hint Text Placeholder */}
            </div>

            {/* SMS and WhatsApp Limits Section (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* SMS Limit */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded-full" /> {/* Icon Placeholder */}
                  <Skeleton className="h-5 w-20" /> {/* Label */}
                </div>
                <Skeleton className="h-10 w-full" /> {/* Input Placeholder */}
                <Skeleton className="h-3 w-full" /> {/* Hint Text Placeholder */}
              </div>

              {/* WhatsApp Limit */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded-full" /> {/* Icon Placeholder */}
                  <Skeleton className="h-5 w-32" /> {/* Label */}
                </div>
                <Skeleton className="h-10 w-full" /> {/* Input Placeholder */}
                <Skeleton className="h-3 w-full" /> {/* Hint Text Placeholder */}
              </div>
            </div>

            {/* Reset Period Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded-full" /> {/* Icon Placeholder */}
                <Skeleton className="h-5 w-24" /> {/* Label */}
              </div>
              <Skeleton className="h-10 w-48" /> {/* Select Input Placeholder */}
              <Skeleton className="h-3 w-2/3" /> {/* Hint Text Placeholder */}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border/50">
              <Skeleton className="h-10 w-32" /> {/* Button Placeholder */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
