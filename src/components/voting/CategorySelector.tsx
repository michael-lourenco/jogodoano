"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import type { Category } from "@/types/types"
import type { CategoryVotes } from "@/types/voting/interfaces"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CategorySelectorProps {
  categories: Category[]
  selectedCategoryId: string
  votes: CategoryVotes
  onCategoryChange: (categoryId: string) => void
  isSticky?: boolean
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  votes,
  onCategoryChange,
  isSticky = false
}: CategorySelectorProps) {
  const isMobile = useIsMobile()
  const currentIndex = categories.findIndex(cat => cat.id === selectedCategoryId)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePrevious = () => {
    if (currentIndex === -1 || !categories.length) return
    const previousIndex = (currentIndex - 1 + categories.length) % categories.length
    const previousCategory = categories[previousIndex]
    if (previousCategory?.id) {
      onCategoryChange(previousCategory.id)
    }
  }

  const handleNext = () => {
    if (currentIndex === -1 || !categories.length) return
    const nextIndex = (currentIndex + 1) % categories.length
    const nextCategory = categories[nextIndex]
    if (nextCategory?.id) {
      onCategoryChange(nextCategory.id)
    }
  }

  // Função para calcular o índice real considerando o array circular
  const getCircularIndex = (index: number) => {
    if (!categories.length) return 0
    return (index + categories.length) % categories.length
  }

  // Array com os 5 índices que queremos mostrar (2 antes, atual, 2 depois)
  const visibleIndices = [
    getCircularIndex(currentIndex - 2),
    getCircularIndex(currentIndex - 1),
    currentIndex,
    getCircularIndex(currentIndex + 1),
    getCircularIndex(currentIndex + 2)
  ].filter(index => index >= 0 && index < categories.length)

  const isCategoryVoted = (categoryId: string) => {
    return votes[categoryId] !== undefined
  }

  // Função para lidar com o evento de wheel
  const handleWheel = (e: WheelEvent) => {
    if (!isMobile) return

    e.preventDefault()
    const delta = Math.sign(e.deltaY)
    
    if (delta > 0) {
      handleNext()
    } else {
      handlePrevious()
    }
  }

  // Adiciona e remove o evento de wheel
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [currentIndex, isMobile])

  return (
    <div className={cn(
      "relative",
      isSticky 
        ? "fixed top-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-b border-muted shadow-sm mt-[var(--editions-height,0px)]" 
        : "mb-4"
    )}>
      <div className={cn(
        "relative flex items-center justify-center py-2",
        isSticky ? "max-w-4xl mx-auto" : ""
      )}>
        {/* Botão Anterior */}
        <button
          onClick={handlePrevious}
          className={cn(
            "absolute left-0 z-20 rounded-full hover:bg-muted/50 transition-colors",
            isMobile ? "p-1" : "p-1.5"
          )}
          aria-label="Categoria anterior"
        >
          <ChevronLeft className={cn(isMobile ? "w-4 h-4" : "w-5 h-5")} />
        </button>

        {/* Container do Carrossel */}
        <div 
          ref={containerRef}
          className={cn(
            "relative w-full overflow-hidden",
            isMobile ? "max-w-[240px]" : "max-w-[280px]"
          )}
        >
          <div className="flex items-center justify-center gap-0.5">
            {visibleIndices.map((index, position) => {
              const category = categories[index]
              if (!category?.id) return null

              const isActive = category.id === selectedCategoryId
              const isVoted = isCategoryVoted(category.id)

              return (
                <motion.button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    "relative flex items-center justify-center transition-all duration-200 group",
                    isMobile ? "w-5 h-5" : "w-8 h-8"
                  )}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.7,
                    x: `${(position - 2) * (isMobile ? 20 : 32)}px`
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "transition-all duration-200",
                      isMobile 
                        ? "w-[90px] h-7 text-xs px-2" 
                        : "w-[120px] h-8 text-sm",
                      isActive
                        ? "bg-gradient-to-r from-chart-2 to-chart-5 text-primary-foreground shadow-lg"
                        : isVoted
                          ? "text-success border-success/30 hover:border-success/50"
                          : "hover:bg-muted/50"
                    )}
                  >
                    <span className="truncate">{category.name.split(" ").pop()}</span>
                    {isVoted && (
                      <CheckCircle2 className={cn(
                        "ml-1 flex-shrink-0",
                        isMobile ? "h-2.5 w-2.5" : "h-3 w-3"
                      )} />
                    )}
                  </Button>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Botão Próximo */}
        <button
          onClick={handleNext}
          className={cn(
            "absolute right-0 z-20 rounded-full hover:bg-muted/50 transition-colors",
            isMobile ? "p-1" : "p-1.5"
          )}
          aria-label="Próxima categoria"
        >
          <ChevronRight className={cn(isMobile ? "w-4 h-4" : "w-5 h-5")} />
        </button>
      </div>
    </div>
  )
} 