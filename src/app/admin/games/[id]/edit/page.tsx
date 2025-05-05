import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader"
import { GameForm } from "@/components/admin/games/GameForm"
import { getGameById } from "@/services/admin/gamesService"
import { notFound } from "next/navigation"

interface EditGamePageProps {
  params: {
    id: string
  }
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const game = await getGameById(params.id)

  if (!game) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Editar Jogo" description={`Editar informações para ${game.title}`} />

      <GameForm game={game} isEditing />
    </div>
  )
}
