"use client"

import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Category } from "@/types/types"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CategoryStepperProps {
  categories: Category[]
  currentCategoryId: string
  onStepClick: (categoryId: string) => void
  votes: Record<string, string>
}

export function CategoryStepper({ 
  categories, 
  currentCategoryId, 
  onStepClick,
  votes 
}: CategoryStepperProps) {
  const isMobile = useIsMobile()
  const currentIndex = categories.findIndex(cat => cat.id === currentCategoryId)

  const handlePrevious = () => {
    const previousIndex = (currentIndex - 1 + categories.length) % categories.length
    onStepClick(categories[previousIndex].id)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % categories.length
    onStepClick(categories[nextIndex].id)
  }

  // Função para calcular o índice real considerando o array circular
  const getCircularIndex = (index: number) => {
    return (index + categories.length) % categories.length
  }

  // Array com os 5 índices que queremos mostrar (2 antes, atual, 2 depois)
  const visibleIndices = [
    getCircularIndex(currentIndex - 2),
    getCircularIndex(currentIndex - 1),
    currentIndex,
    getCircularIndex(currentIndex + 1),
    getCircularIndex(currentIndex + 2)
  ]

  return (
    <div className="relative flex items-center justify-center py-2">
      {/* Botão Anterior */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 z-20 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
        aria-label="Categoria anterior"
      >
        <ChevronLeft className={cn("w-5 h-5", isMobile ? "w-4 h-4" : "w-5 h-5")} />
      </button>

      {/* Container do Carrossel */}
      <div className="relative w-full max-w-[400px] overflow-hidden">
        <div className="flex items-center justify-center gap-2">
          {visibleIndices.map((index, position) => {
            const category = categories[index]
            if (!category?.id) return null
            
            const isActive = category.id === currentCategoryId
            const isVoted = votes[category.id]

            return (
              <motion.button
                key={category.id}
                onClick={() => onStepClick(category.id)}
                className={cn(
                  "relative flex items-center justify-center transition-all duration-200 group",
                  isMobile ? "w-6 h-6" : "w-8 h-8"
                )}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  opacity: isActive ? 1 : 0.7,
                  x: `${(position - 2) * (isMobile ? 32 : 48)}px`
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Círculo do step */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-200",
                    isActive 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : isVoted
                        ? "border-success bg-success text-success-foreground"
                        : "border-muted bg-background hover:border-primary/50",
                    isMobile ? "w-5 h-5 text-xs" : "w-7 h-7 text-sm"
                  )}
                >
                  {isVoted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-success-foreground"
                    >
                    {index + 1}
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Tooltip com nome da categoria */}
                <div
                  className={cn(
                    "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    isMobile ? "text-[10px]" : "text-xs"
                  )}
                >
                  {category.name}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Botão Próximo */}
      <button
        onClick={handleNext}
        className="absolute right-0 z-20 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
        aria-label="Próxima categoria"
      >
        <ChevronRight className={cn("w-5 h-5", isMobile ? "w-4 h-4" : "w-5 h-5")} />
      </button>
    </div>
  )
} 