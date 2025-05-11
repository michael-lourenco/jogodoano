"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
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
    <div className="flex justify-between items-center p-3 border-t border-muted">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToCategory("prev")}
        disabled={!hasPrevCategory}
        className="flex items-center gap-1"
        aria-label="Categoria anterior"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Anterior
      </Button>

      <span className="text-xs text-muted-foreground" aria-live="polite">
        {currentCategoryIndex + 1} / {categories.length}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToCategory("next")}
        disabled={!hasNextCategory}
        className="flex items-center gap-1"
        aria-label="Próxima categoria"
      >
        Próxima
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
