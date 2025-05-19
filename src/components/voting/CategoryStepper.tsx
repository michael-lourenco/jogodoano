"use client"

import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Category } from "@/types/types"
import { cn } from "@/lib/utils"

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

  return (
    <div className={cn(
      "flex items-center justify-center gap-1.5 py-2",
      isMobile ? "overflow-x-auto px-4 scrollbar-none" : "px-2"
    )}>
      {categories.map((category, index) => {
        const isActive = category.id === currentCategoryId
        const isVoted = votes[category.id]
        const isPast = index < currentIndex
        const isPastAndVoted = isPast && isVoted

        return (
          <motion.button
            key={category.id}
            onClick={() => onStepClick(category.id)}
            className={cn(
              "relative flex items-center justify-center transition-all duration-200 group",
              isMobile ? "w-7 h-7" : "w-10 h-10"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Linha conectora */}
            {index < categories.length - 1 && (
              <div 
                className={cn(
                  "absolute top-1/2 -right-1/2 h-0.5 w-full -translate-y-1/2",
                  isPastAndVoted ? "bg-success" : "bg-muted"
                )}
              />
            )}

            {/* Círculo do step */}
            <div
              className={cn(
                "relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-200",
                isActive 
                  ? "border-primary bg-primary text-primary-foreground scale-110" 
                  : isVoted
                    ? "border-success bg-success text-success-foreground"
                    : "border-muted bg-background hover:border-primary/50",
                isMobile ? "w-5 h-5 text-xs" : "w-8 h-8 text-sm"
              )}
            >
              {isVoted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-success-foreground"
                >
                  ✓
                </motion.div>
              ) : (
                index + 1
              )}
            </div>

            {/* Tooltip com nome da categoria */}
            <div
              className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {category.name}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
} 