"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  updateNotifications,
  UpdateNotificationsReq,
  updatePassword,
  UpdatePasswordReq,
  updateProfile,
  UpdateProfileReq,
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { AxiosError } from "axios";
import { Spinner } from "@/components/ui/spinner";

export default function AdminSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.login);
  // Password state
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Business profile state
  const [businessProfile, setBusinessProfile] = useState({
    shopName: user?.shop?.name,
    address: user?.shop?.address,
    replyPhone: user?.phone,
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    lowStockEnabled: user?.shop?.settings?.low_stock_notifications,
    enabledChannels: {
      whatsapp: user?.shop?.settings?.default_reminder_channels.whatsapp,
      email: user?.shop?.settings?.default_reminder_channels.email,
      sms: user?.shop?.settings?.default_reminder_channels.sms,
    },
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const isPasswordChanged = () => {
    return (
      password.current.length > 0 ||
      password.new.length > 0 ||
      password.confirm.length > 0
    );
  };

  const isBusinessProfileChanged = () => {
    return (
      businessProfile.shopName !== user?.shop?.name ||
      businessProfile.address !== user?.shop?.address ||
      businessProfile.replyPhone !== user?.phone
    );
  };

  const isNotificationsChanged = () => {
    return (
      notifications.lowStockEnabled !==
        user?.shop?.settings?.low_stock_notifications ||
      notifications.enabledChannels.email !==
        user?.shop?.settings?.default_reminder_channels.email ||
      notifications.enabledChannels.whatsapp !==
        user?.shop?.settings?.default_reminder_channels.whatsapp ||
      notifications.enabledChannels.sms !==
        user?.shop?.settings?.default_reminder_channels.sms
    );
  };

  const handlePasswordUpdate = async () => {
    if (!password.current || !password.new || !password.confirm) {
      toast.error("Please fill all password fields");
      return;
    }
    if (password.new !== password.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    const payload_data: UpdatePasswordReq = {
      currentPassword: password.current,
      newPassword: password.new,
      userId: user!.id,
    };

    try {
      setPasswordLoading(true);
      const data = await updatePassword(payload_data);
      if (data.success) {
        toast.success(data.message || "password updated successfully");
        setPassword({ current: "", new: "", confirm: "" });
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "error updating password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleBusinessProfileUpdate = async () => {
    const profilePayload: UpdateProfileReq = {
      shop_address: businessProfile.address!,
      shop_id: user?.shop?.id as string,
      shop_name: businessProfile.shopName!,
      user_phone: businessProfile.replyPhone!,
    };
    try {
      setProfileLoading(true);
      const data = await updateProfile(profilePayload);
      console.log(data);
      if (data.success) {
        setUser(data.user);
        setBusinessProfile({
          address: data.user.shop.address,
          replyPhone: data.user.phone,
          shopName: data.user.shop.name,
        });
        toast.success(data.message || "profile updated");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "error updating profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleNotificationsUpdate = async () => {
    const payload: UpdateNotificationsReq = {
      low_stock: notifications.lowStockEnabled!,
      email: notifications.enabledChannels.email!,
      whatsapp: notifications.enabledChannels.whatsapp!,
      sms: notifications.enabledChannels.sms!,
    };
    try {
      setNotificationLoading(true);
      // console.log(payload)
      const data = await updateNotifications(payload, user?.shop?.id as string);
      if (data.success) {
        setUser(data.user);
        setNotifications({
          lowStockEnabled: data.settings.low_stock_notifications,
          enabledChannels: {
            email: data.settings.default_reminder_channels.email,
            whatsapp: data.settings.default_reminder_channels.whatsapp,
            sms: data.settings.default_reminder_channels.sms,
          },
        });
        toast.success(data.message || "notifications updated successfully");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data.message || "error updating notifications"
        );
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleChannelToggle = (channel: "whatsapp" | "email" | "sms") => {
    const updatedChannels = { ...notifications.enabledChannels };
    const enabledCount = Object.values(updatedChannels).filter(Boolean).length;

    // Prevent disabling if it's the last enabled channel
    if (updatedChannels[channel] && enabledCount === 1) {
      alert("At least one notification channel must be enabled");
      return;
    }

    updatedChannels[channel] = !updatedChannels[channel];
    setNotifications({ ...notifications, enabledChannels: updatedChannels });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Change Password */}
          <Card>
            <form onSubmit={(e) => e.preventDefault()}>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={password.current}
                    onChange={(e) =>
                      setPassword({ ...password, current: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={password.new}
                    onChange={(e) =>
                      setPassword({ ...password, new: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={password.confirm}
                    onChange={(e) =>
                      setPassword({ ...password, confirm: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="submit"
                  onClick={handlePasswordUpdate}
                  className="w-full"
                  disabled={!isPasswordChanged()}
                >
                  {passwordLoading ? <Spinner /> : "Update Password"}
                </Button>
              </CardContent>
            </form>
          </Card>

          {/* Business Profile */}
          <Card>
            <form onSubmit={(e) => e.preventDefault()}>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Shop Name</Label>
                  <Input
                    placeholder="Khawer Moto"
                    value={businessProfile.shopName}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        shopName: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Previous: {user?.shop?.name}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Address</Label>
                  <Input
                    placeholder="Street, City"
                    value={businessProfile.address}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        address: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Previous: {user?.shop?.address}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Reply Phone/WhatsApp</Label>
                  <Input
                    placeholder="+92..."
                    value={businessProfile.replyPhone}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        replyPhone: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Previous: {user?.phone}
                  </p>
                </div>
                <Button
                  type="submit"
                  onClick={handleBusinessProfileUpdate}
                  className="w-full"
                  disabled={!isBusinessProfileChanged()}
                >
                  {profileLoading ? <Spinner /> : "Update Profile"}
                </Button>
              </CardContent>
            </form>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Low Stock Notifications</Label>
                <Switch
                  checked={notifications.lowStockEnabled}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      lowStockEnabled: checked,
                    })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Previous:{" "}
                {user?.shop?.settings?.low_stock_notifications
                  ? "Enabled"
                  : "Disabled"}
              </p>

              <div className="grid gap-3 mt-4">
                <Label>Notification Channels</Label>
                <div className="space-y-2">
                  {["whatsapp", "email", "sms"].map((channel) => (
                    <div
                      key={channel}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <Label className="capitalize cursor-pointer">
                        {channel}
                      </Label>
                      <Switch
                        checked={
                          notifications.enabledChannels[
                            channel as keyof typeof notifications.enabledChannels
                          ]
                        }
                        onCheckedChange={() =>
                          handleChannelToggle(
                            channel as "whatsapp" | "email" | "sms"
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Previous:{" "}
                  {Object.entries(
                    user!.shop?.settings?.default_reminder_channels as object
                  )
                    .filter(([, enabled]) => enabled)
                    .map(
                      ([channel]) =>
                        channel.charAt(0).toUpperCase() + channel.slice(1)
                    )
                    .join(", ")}
                </p>
              </div>

              <Button
                onClick={handleNotificationsUpdate}
                className="w-full mt-4"
                disabled={!isNotificationsChanged()}
              >
                {notificationLoading ? <Spinner /> : "Update Notifications"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
