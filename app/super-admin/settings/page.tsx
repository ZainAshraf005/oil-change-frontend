import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function SuperAdminSettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Defaults</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label>Default Timezone</Label>
            <Input value="Asia/Karachi" readOnly />
          </div>
          <div className="rounded-lg border p-3 text-sm text-muted-foreground">General configuration placeholders</div>
        </CardContent>
      </Card>
    </section>
  )
}
