import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Category } from "@/types/types"
import { GameCard } from "@/components/voting/GameCard"

interface CategorySectionProps {
  category: Category
  selectedGameId?: string
  onVote: (categoryId: string, gameId: string) => void
}

export function CategorySection({ category, selectedGameId, onVote }: CategorySectionProps) {
  return (
    <Card className="border border-muted/30 bg-background/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-muted/20">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-xl font-bold text-primary">{category.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
            {category.games?.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isSelected={selectedGameId === game.id}
                onSelect={() => onVote(category.id, game.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}