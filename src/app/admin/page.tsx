import { EditionStatsDashboard } from "@/components/admin/dashboard/EditionStatsDashboard"
import { EditionSelector } from "@/components/admin/dashboard/EditionSelector"
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader"
import { getEditionStats } from "@/services/admin/statsService"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/admin/dashboard/DashboardSkeleton"

export default async function AdminDashboardPage() {
  // Default to the first edition for initial load
  const defaultEditionId = "2025"
  const initialStats = await getEditionStats(defaultEditionId)

  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard Administrativo" description="Visualize estatísticas de votação por edição" />

      <EditionSelector />

      <Suspense fallback={<DashboardSkeleton />}>
        <EditionStatsDashboard initialStats={initialStats} initialEditionId={defaultEditionId} />
      </Suspense>
    </div>
  )
}
