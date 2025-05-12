"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { CheckCircle2, Gamepad2 } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import type { Game } from "@/types/types"

interface GameCardProps {
  game: Game
  isSelected: boolean
  onSelect: () => void
}

export function GameCard({ game, isSelected, onSelect }: GameCardProps) {
  // Estado local para animação suave
  const [localSelected, setLocalSelected] = useState(isSelected)

  // Atualiza o estado local quando a prop isSelected muda
  useEffect(() => {
    setLocalSelected(isSelected)
  }, [isSelected])

  // Variantes para animação do card
  const cardVariants = {
    normal: { scale: 1, y: 0 },
    selected: { scale: 1.03, y: -5 },
  };

  // Variantes para animação do ícone de seleção
  const checkVariants = {
    initial: { scale: 0, opacity: 0 },
    selected: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } },
  };

  // Função para lidar com o clique no card
  const handleClick = () => {
    // Chamamos a função onSelect para registrar o voto
    onSelect();
    
    // Como o sistema de votação pode levar um tempo para atualizar,
    // atualizamos também o estado local para feedback imediato
    setLocalSelected(true);
  };

  // Forçando a renderização do componente quando isSelected muda
  useEffect(() => {
    console.log("GameCard: isSelected changed", isSelected, game.title);
  }, [isSelected, game.title]);

  return (
    <motion.div
      id={`game-${game.id}`}
      initial="normal"
      animate={localSelected ? "selected" : "normal"}
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-lg border-2 overflow-hidden h-full",
          localSelected 
            ? "border-success bg-success/5 shadow-success/30" 
            : "border-transparent hover:border-primary/30",
        )}
        onClick={handleClick}
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-video w-full overflow-hidden">
            {game.imageUrl ? (
              <Image
                src={game.imageUrl}
                alt={game.title}
                className={cn(
                  "object-cover transition-all duration-500",
                  localSelected ? "scale-105" : "hover:scale-105"
                )}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                priority={localSelected}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Gamepad2 className={cn(
                  "text-muted-foreground/50 transition-all duration-300",
                  localSelected ? "text-success h-20 w-20" : "h-16 w-16"
                )} />
              </div>
            )}
            {localSelected && (
              <div className="absolute inset-0 bg-success/15 flex items-center justify-center backdrop-blur-[1px]">
                <motion.div
                  initial="initial"
                  animate="selected"
                  variants={checkVariants}
                  className="bg-success text-success-foreground rounded-full p-2"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </motion.div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between p-3 flex-grow">
            <div>
              <h3 className="font-semibold line-clamp-2 mb-1">{game.title}</h3>
              <p className="text-xs text-muted-foreground">{game.developer}</p>
            </div>
            <div className="mt-2">
              {localSelected ? (
                <div className="mt-1 flex items-center">
                  <span className="text-xs bg-success/15 text-success px-2 py-1 rounded-full font-medium">Selecionado</span>
                  <CheckCircle2 className="h-3 w-3 text-success ml-1" />
                </div>
              ) : (
                <div className="mt-1 text-xs text-muted-foreground/70">Clique para selecionar</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
