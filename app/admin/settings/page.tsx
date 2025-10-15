import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function AdminSettingsPage() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div className="grid gap-2">
            <Label>New Password</Label>
            <Input type="password" />
          </div>
          <div className="grid gap-2">
            <Label>Confirm New Password</Label>
            <Input type="password" />
          </div>
          <div className="text-sm text-muted-foreground">Submit to update.</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label>Shop Name</Label>
            <Input placeholder="Khawer Moto" />
          </div>
          <div className="grid gap-2">
            <Label>Address</Label>
            <Input placeholder="Street, City" />
          </div>
          <div className="grid gap-2">
            <Label>Reply Phone/WhatsApp</Label>
            <Input placeholder="+92..." />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
