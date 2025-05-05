import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function DashboardHeader({ title, description, actionLabel, actionHref }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
