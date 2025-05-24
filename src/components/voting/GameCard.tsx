"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { CheckCircle2, Gamepad2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, memo, useCallback } from "react"
import type { Game } from "@/types/types"

interface GameCardProps {
  game: Game
  isSelected: boolean
  onSelect: () => void
}

// Usando memo para evitar renderizações desnecessárias
const GameCard = memo(function GameCard({ game, isSelected, onSelect }: GameCardProps) {
  // Estado local para animação suave
  const [localSelected, setLocalSelected] = useState(isSelected)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Atualiza o estado local quando a prop isSelected muda
  useEffect(() => {
    if (localSelected !== isSelected) {
      setLocalSelected(isSelected)
    }
  }, [isSelected, localSelected])

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

  // Variantes para animação de confirmação
  const confirmationVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1.2, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 15,
        duration: 0.3
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Função para reproduzir o som de confirmação
  const playConfirmationSound = useCallback(() => {
    const audio = new Audio('/sounds/select.mp3')
    audio.volume = 0.3 // Volume reduzido para não ser intrusivo
    audio.play().catch(() => {
      // Ignora erros de autoplay
    })
  }, [])

  // Função para lidar com o clique no card
  const handleClick = () => {
    // Só atualiza se o estado atual for diferente
    if (!localSelected) {
      // Atualizamos também o estado local para feedback imediato
      setLocalSelected(true)
      // Mostra a animação de confirmação
      setShowConfirmation(true)
      // Reproduz o som de confirmação
      playConfirmationSound()
      // Chamamos a função onSelect para registrar o voto
      onSelect()
      // Remove a animação de confirmação após um tempo
      setTimeout(() => {
        setShowConfirmation(false)
      }, 1000)
    }
  };

  return (
    <motion.div
      id={`game-${game.id}`}
      initial="normal"
      animate={localSelected ? "selected" : "normal"}
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full relative"
    >
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-lg border-2 overflow-hidden h-full rounded-xl",
          localSelected 
            ? "border-success bg-success/5 shadow-success/30" 
            : "border-transparent hover:border-primary/30",
        )}
        onClick={handleClick}
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
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
          <div className="flex flex-col justify-between p-4 flex-grow">
            <div>
              <h3 className="font-semibold text-base line-clamp-2 mb-2">{game.title}</h3>
              <p className="text-sm text-muted-foreground">{game.developer}</p>
            </div>
            <div className="mt-3">
              {localSelected ? (
                <div className="mt-2 flex items-center">
                  <span className="text-sm bg-success/15 text-success px-3 py-1.5 rounded-full font-medium">Selecionado</span>
                  <CheckCircle2 className="h-4 w-4 text-success ml-2" />
                </div>
              ) : (
                <div className="mt-2 text-sm text-muted-foreground/70">Clique para selecionar</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animação de confirmação */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            variants={confirmationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="bg-success/20 rounded-full p-8 backdrop-blur-sm">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
});

export { GameCard }
