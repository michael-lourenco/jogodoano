"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import type { Category } from "@/types/types"

interface CategoryNavigationProps {
  categories: Category[]
  currentCategoryId: string
  navigateToCategory: (direction: "prev" | "next") => void
}

export function CategoryNavigation({ categories, currentCategoryId, navigateToCategory }: CategoryNavigationProps) {
  const currentCategoryIndex = categories.findIndex((cat) => cat.id === currentCategoryId)
  const hasPrevCategory = currentCategoryIndex > 0
  const hasNextCategory = currentCategoryIndex < categories.length - 1

  return (
    <div className="flex flex-col border-t border-muted">
      {/* Indicadores de progresso */}
      <div className="flex justify-center items-center gap-1 py-2">
        {categories.map((category, index) => (
          <motion.div 
            key={category.id}
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: currentCategoryIndex === index ? 1 : 0.8,
              opacity: currentCategoryIndex === index ? 1 : 0.5
            }}
            className={`h-2 rounded-full transition-colors duration-300 ${
              currentCategoryIndex === index 
                ? "bg-primary w-4" 
                : index < currentCategoryIndex 
                  ? "bg-success w-2" 
                  : "bg-muted w-2"
            }`}
          />
        ))}
      </div>
      
      {/* Botões de navegação */}
      <div className="flex justify-between items-center p-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToCategory("prev")}
          disabled={!hasPrevCategory}
          className="flex items-center gap-1 transition-all duration-200"
          aria-label="Categoria anterior"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Anterior
        </Button>

        <span className="text-xs text-muted-foreground font-medium" aria-live="polite">
          {currentCategoryIndex + 1} de {categories.length}
        </span>

        <Button
          variant={hasNextCategory ? "default" : "outline"}
          size="sm"
          onClick={() => navigateToCategory("next")}
          disabled={!hasNextCategory}
          className={`flex items-center gap-1 transition-all duration-200 ${
            hasNextCategory ? "bg-primary hover:bg-primary/90" : ""
          }`}
          aria-label="Próxima categoria"
        >
          Próxima
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
