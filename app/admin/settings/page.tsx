"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Setting,
  Shop,
  updateColor,
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

  // Email Template Preview State
  const [emailColor, setEmailColor] = useState(
    user?.shop?.settings?.email_template_color as string
  );

  // Dummy data for email preview
  const dummyData = {
    customerName: "Ali Ahmed",
    regNo: "ABC-1234",
    oilChangeDate: "10-Oct-2025",
    mileage: "45,000 km",
    currentDate: "02-Nov-2025",
    shopName: user?.shop?.name,
  };

  const generateEmailTemplatePreview = (color: string) => {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
        <div style="background: ${color}; color: #fff; padding: 16px; text-align: center; font-size: 20px; font-weight: bold;">
          ${dummyData.shopName}
        </div>
        <div style="padding: 20px; color: #333; line-height: 1.6;">
          <p>Dear <b>${dummyData.customerName}</b>,</p>
          <p>
            You had an engine oil change for your car <b>${
              dummyData.regNo
            }</b> on
            <b>${dummyData.oilChangeDate}</b> when the mileage was <b>${
      dummyData.mileage
    }</b>.
          </p>
          <p>
            It has now been <b>${dummyData.currentDate}</b> since that service.
            Please check whether your vehicle is due for its next oil change to ensure optimal performance.
          </p>
          <p>Regards,<br/><b>${dummyData.shopName}</b></p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          <p dir="rtl" style="font-family: 'Noto Nastaliq Urdu', serif; color: #222; line-height:normal;">
            محترم <b>${dummyData.customerName}</b>،<br/>
            آپ کی گاڑی <b>${dummyData.regNo}</b> کا انجن آئل <b>${
      dummyData.oilChangeDate
    }</b> کو بدلا گیا تھا، اُس وقت مائلیج <b>${dummyData.mileage}</b> تھی۔<br/>
            اب اس خدمت کو <b>${dummyData.currentDate}</b> گزر چکے ہیں۔<br/>
            براہِ کرم اپنی گاڑی کا آئل چیک کر لیں تاکہ وقت پر آئل چینج کر کے گاڑی کی بہترین کارکردگی برقرار رکھی جا سکے۔<br/>
            نیک تمنائیں،<br/><b>${dummyData.shopName}</b>
          </p>
        </div>
        <div style="background: ${color}; color: #fff; text-align: center; padding: 10px; font-size: 12px;">
          © ${new Date().getFullYear()} ${
      dummyData.shopName
    } | All Rights Reserved
        </div>
      </div>
    </div>
    `;
  };

  // --- Logic Functions ---
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
        toast.success(data.message || "Password updated successfully");
        setPassword({ current: "", new: "", confirm: "" });
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "Error updating password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleColorSave = async () => {
    const shopId = user?.shop?.id as string;
    try {
      const data = await updateColor(emailColor, shopId);
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "error changing color");
        setEmailColor(user?.shop?.settings?.email_template_color as string);
      }
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
      if (data.success) {
        setUser(data.user);
        setBusinessProfile({
          address: data.user.shop.address,
          replyPhone: data.user.phone,
          shopName: data.user.shop.name,
        });
        toast.success(data.message || "Profile updated");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "Error updating profile");
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
        toast.success(data.message || "Notifications updated successfully");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data.message || "Error updating notifications"
        );
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleChannelToggle = (channel: "whatsapp" | "email" | "sms") => {
    const updatedChannels = { ...notifications.enabledChannels };
    const enabledCount = Object.values(updatedChannels).filter(Boolean).length;
    if (updatedChannels[channel] && enabledCount === 1) {
      alert("At least one notification channel must be enabled");
      return;
    }
    updatedChannels[channel] = !updatedChannels[channel];
    setNotifications({ ...notifications, enabledChannels: updatedChannels });
  };

  // --- Render ---
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
          <Card className="col-span-2">
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

          {/* Email Template Settings */}
          <Card className="col-span-2 relative">
            {emailColor !== user?.shop?.settings?.email_template_color && (
              <Button
                variant={"outline"}
                onClick={handleColorSave}
                className="absolute top-3 right-3 cursor-pointer"
              >
                save changes
              </Button>
            )}
            <CardHeader>
              <CardTitle>Email Template Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>Email Theme Color</Label>
                <div className="flex items-center gap-3">
                  {["#0d6efd", "#198754", "#fd7e14", "#6c757d"].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2"
                      style={{
                        backgroundColor: color,
                        borderColor: color === emailColor ? "black" : "#ccc",
                      }}
                      onClick={() => setEmailColor(color)}
                    />
                  ))}
                  <input
                    type="color"
                    value={emailColor}
                    onChange={(e) => setEmailColor(e.target.value)}
                    className="w-10 h-10 p-1 border rounded-md"
                  />
                </div>
              </div>

              <div className=" overflow-hidden">
                <div
                  className="p-6"
                  dangerouslySetInnerHTML={{
                    __html: generateEmailTemplatePreview(emailColor),
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
