import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"
import type { Category } from "@/types/types"
import type { CategoryVotes } from "@/types/voting/interfaces"

interface VotingProgressProps {
  categories: Category[]
  votes: CategoryVotes
  editionId: string
}

export function VotingProgress({ categories, votes, editionId }: VotingProgressProps) {
  const totalCategories = categories.length
  const votedCategories = Object.keys(votes || {}).length
  const progressPercentage = totalCategories > 0 ? (votedCategories / totalCategories) * 100 : 0

  return (
    <div className="mb-4 bg-muted/30 p-3 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Progresso da votação</span>
        <span className="text-sm text-muted-foreground">
          {votedCategories} de {totalCategories} categorias
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />

      {progressPercentage === 100 && (
        <div className="mt-2 text-sm text-success flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" />
          <span>Todas as categorias votadas! Você pode enviar seus votos.</span>
        </div>
      )}
    </div>
  )
}
