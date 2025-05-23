import { Progress } from "@/components/ui/progress"
import type { Category } from "@/types/types"
import type { CategoryVotes } from "@/types/voting/interfaces"

interface VotingProgressProps {
  categories: Category[]
  votes: CategoryVotes
  editionId: string
}

export function VotingProgress({ categories, votes }: VotingProgressProps) {
  const totalCategories = categories.length
  const votedCategories = Object.keys(votes || {}).length
  const progressPercentage = totalCategories > 0 ? (votedCategories / totalCategories) * 100 : 0

  return (
    <div className="w-full">
      <Progress 
        value={progressPercentage} 
        className="h-1"
      />
    </div>
  )
}
