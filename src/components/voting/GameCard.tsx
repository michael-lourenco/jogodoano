import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Game } from "@/types/types"

interface GameCardProps {
  game: Game
  isSelected: boolean
  onSelect: () => void
}

export function GameCard({ game, isSelected, onSelect }: GameCardProps) {
  const imageUrl = game.imageUrl ? game.imageUrl.split("?")[0] : "/placeholder.svg"

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer overflow-hidden transition-all duration-200 h-full ${
          isSelected ? "ring-2 ring-green-500 shadow-lg shadow-green-500/10" : "hover:border-muted/50"
        }`}
        onClick={onSelect}
      >
        <div className="relative aspect-video">
          {game.imageUrl ? (
            <Image
              src={game.imageUrl || "/placeholder.svg"}
              alt={game.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <span className="text-white/70 text-sm font-medium">{game.title}</span>
            </div>
          )}
          {isSelected && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold line-clamp-1">{game.title}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">{game.developer}</p>
            {isSelected && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                Selecionado
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}