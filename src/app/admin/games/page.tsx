import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader"
import { GamesTable } from "@/components/admin/games/GamesTable"
import { getAllGames } from "@/services/admin/gamesService"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/admin/shared/TableSkeleton"

export default async function GamesPage() {
  const games = await getAllGames()

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Gerenciamento de Jogos"
        description="Visualize e gerencie os jogos disponíveis para votação"
        actionLabel="Novo Jogo"
        actionHref="/admin/games/new"
      />

      <Suspense fallback={<TableSkeleton />}>
        <GamesTable games={games} />
      </Suspense>
    </div>
  )
}
