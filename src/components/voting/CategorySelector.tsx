"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import type { Category } from "@/types/types"
import type { CategoryVotes } from "@/types/voting/interfaces"

interface CategorySelectorProps {
  categories: Category[]
  selectedCategoryId: string
  votes: CategoryVotes
  onCategoryChange: (categoryId: string) => void
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  votes,
  onCategoryChange,
}: CategorySelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const container = containerRef.current
      const itemWidth = 120 // Largura aproximada de cada item
      const visibleItems = Math.floor(container.clientWidth / itemWidth)
      const scrollAmount = itemWidth * (visibleItems - 1)
      
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  const isCategoryVoted = (categoryId: string) => {
    return votes[categoryId] !== undefined
  }

  return (
    <div className="relative group">
      {/* Container do carrossel com padding para mostrar os itens adjacentes */}
      <div className="w-full overflow-hidden">
        <div
          ref={containerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto scrollbar-hide py-1.5 px-[calc(50%-60px)]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex-shrink-0 px-1.5"
            >
              <Button
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                className={`w-[120px] h-8 text-sm transition-all duration-200 ${
                  selectedCategoryId === category.id
                    ? "bg-gradient-to-r from-chart-2 to-chart-5 text-primary-foreground shadow-lg scale-100"
                    : isCategoryVoted(category.id)
                      ? "text-success border-success/30 hover:border-success/50 scale-95"
                      : "hover:bg-muted/50 scale-95"
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="truncate">{category.name.split(" ").pop()}</span>
                {isCategoryVoted(category.id) && (
                  <CheckCircle2 className="ml-1.5 h-3 w-3 flex-shrink-0" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Seta esquerda */}
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-sm shadow-md rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Seta direita */}
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-sm shadow-md rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleScroll("right")}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
} 