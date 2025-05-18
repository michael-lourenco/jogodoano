import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"
import type { Category } from "@/types/types"
import type { CategoryVotes } from "@/types/voting/interfaces"
import { useIsMobile } from "@/hooks/use-mobile"

interface VotingProgressProps {
  categories: Category[]
  votes: CategoryVotes
  editionId: string
}

export function VotingProgress({ categories, votes, editionId }: VotingProgressProps) {
  const isMobile = useIsMobile()
  const totalCategories = categories.length
  const votedCategories = Object.keys(votes || {}).length
  const progressPercentage = totalCategories > 0 ? (votedCategories / totalCategories) * 100 : 0
  const isComplete = progressPercentage === 100

  if (isMobile) {
    return (
      <div className="relative flex items-center gap-2">
        <div className="flex-1 relative">
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${isComplete ? 'bg-success/20' : ''}`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium bg-background/95 px-2 py-0.5 rounded-full">
              {votedCategories}/{totalCategories}
            </span>
          </div>
        </div>
        {isComplete && (
          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" />
        )}
      </div>
    )
  }

  // Versão desktop mantém o layout original
  return (
    <div className="mb-4 bg-muted/30 p-3 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Progresso da votação</span>
        <span className="text-sm text-muted-foreground">
          {votedCategories} de {totalCategories} categorias
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />

      {isComplete && (
        <div className="mt-2 text-sm text-success flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" />
          <span>Todas as categorias votadas! Você pode enviar seus votos.</span>
        </div>
      )}
    </div>
  )
}
