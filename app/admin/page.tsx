export default function AdminDashboard() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold text-pretty">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">Messages sent today — 0</div>
        <div className="rounded-lg border p-4">Total sales — 0</div>
        <div className="rounded-lg border p-4">Total products — 0</div>
        <div className="rounded-lg border p-4">Total customers — 0</div>
      </div>
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">Charts placeholder</div>
    </section>
  )
}
