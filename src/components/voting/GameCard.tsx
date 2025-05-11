"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import type { Game } from "@/types/types"

interface GameCardProps {
  game: Game
  isSelected: boolean
  onSelect: () => void
}

export function GameCard({ game, isSelected, onSelect }: GameCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
        isSelected ? "border-success bg-success/5 shadow-success/20" : "border-transparent hover:border-primary/20",
      )}
      onClick={onSelect}
    >
      <CardContent className="p-3 flex flex-col gap-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={game.imageUrl || `/placeholder.svg?height=200&width=350`}
            alt={game.title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            priority={isSelected}
          />
          {isSelected && (
            <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
              <div className="bg-success text-success-foreground rounded-full p-2 animate-in zoom-in-50 duration-200">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium line-clamp-2">{game.title}</h3>
            <p className="text-sm text-muted-foreground">{game.developer}</p>
          </div>
          {isSelected && (
            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">Selecionado</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
