import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AssignPackageForm from "@/components/assign-package-form";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-4 md:mb-6">
        <h1 className="text-balance text-2xl font-semibold tracking-tight">
          Assign Package
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Pick a shop, choose a package, and set the start date. Review the
          details on the right before assigning.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {/* Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="text-sm text-muted-foreground">Loading...</div>
              }
            >
              <AssignPackageForm />
            </Suspense>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {/* The summary lives inside the form via a portal-like prop drilling, 
                but to keep things simple and decoupled we render a live preview
                from internal state in AssignPackageForm using a colocated component. */}
            <div id="assign-summary" className="text-sm text-muted-foreground">
              {/* Filled by AssignPackageForm via a mounted component */}
              Select a shop to preview current and new assignment details.
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
