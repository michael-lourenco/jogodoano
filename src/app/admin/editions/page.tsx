import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader"
import { EditionsTable } from "@/components/admin/editions/EditionsTable"
import { getAllEditions } from "@/services/admin/editionsService"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/admin/shared/TableSkeleton"

export default async function EditionsPage() {
  const editions = await getAllEditions()

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Gerenciamento de Edições"
        description="Visualize e gerencie as edições de votação"
        actionLabel="Nova Edição"
        actionHref="/admin/editions/new"
      />

      <Suspense fallback={<TableSkeleton />}>
        <EditionsTable editions={editions} />
      </Suspense>
    </div>
  )
}
