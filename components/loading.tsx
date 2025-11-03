import { Spinner } from "@/components/ui/spinner"

interface LoadingProps {
  message?: string
  fullScreen?: boolean
}

export function Loading({ message = "Loading...", fullScreen = false }: LoadingProps) {
  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center gap-3 py-12"

  return (
    <div className={containerClass}>
      <Spinner className="size-8" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}
