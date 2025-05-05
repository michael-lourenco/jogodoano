import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader"
import { GameForm } from "@/components/admin/games/GameForm"

export default function NewGamePage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Adicionar Novo Jogo"
        description="Crie um novo jogo para ser incluído nas categorias de votação"
      />

      <GameForm />
    </div>
  )
}
