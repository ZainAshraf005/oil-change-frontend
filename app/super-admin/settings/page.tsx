"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Clock, Settings } from "lucide-react";

export default function SuperAdminSettingsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage system defaults and quota limits for all channels
          </p>
        </div>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <CardTitle>System Defaults</CardTitle>
                <CardDescription>
                  Default configuration for the system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Default Timezone</Label>
              <Input
                value="Asia/Karachi"
                readOnly
                className="bg-muted/50 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                System timezone is set to Asia/Karachi
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
