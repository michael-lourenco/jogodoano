"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/types"

interface CategorySelectorProps {
  categories: Category[]
  selectedCategoryId: string
  votes: Record<string, string>
  onCategoryChange: (categoryId: string) => void
  isMobile?: boolean
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  votes,
  onCategoryChange,
  isMobile = false
}: CategorySelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const currentIndex = categories.findIndex(cat => cat.id === selectedCategoryId)

  // Função para verificar se uma categoria foi votada
  const hasVote = (categoryId: string) => Boolean(votes[categoryId])

  // Função para calcular o índice circular
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
  ].filter(index => {
    return index >= 0 && index < categories.length && categories[index]?.id
  })

  // Função para verificar a visibilidade das setas
  const checkScroll = () => {
    if (!containerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
  }

  // Função para rolar para a esquerda ou direita
  const handleScroll = (direction: "left" | "right") => {
    if (!containerRef.current) return

    const scrollAmount = 200
    const targetScroll = direction === "left" 
      ? containerRef.current.scrollLeft - scrollAmount
      : containerRef.current.scrollLeft + scrollAmount

    containerRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth"
    })
  }

  // Função para lidar com o evento de wheel
  const handleWheel = (e: WheelEvent) => {
    if (!isMobile) return

    e.preventDefault()
    const delta = Math.sign(e.deltaY)
    
    if (delta > 0) {
      const nextIndex = getCircularIndex(currentIndex + 1)
      onCategoryChange(categories[nextIndex].id)
    } else {
      const prevIndex = getCircularIndex(currentIndex - 1)
      onCategoryChange(categories[prevIndex].id)
    }
  }

  // Adicionar e remover o evento de wheel
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [currentIndex, isMobile])

  // Verificar scroll inicial e quando o container mudar
  useEffect(() => {
    checkScroll()
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      return () => container.removeEventListener("scroll", checkScroll)
    }
  }, [categories, selectedCategoryId])

  // Centralizar a categoria selecionada
  useEffect(() => {
    if (!containerRef.current) return

    const selectedElement = containerRef.current.querySelector(`[data-category-id="${selectedCategoryId}"]`)
    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      })
    }
  }, [selectedCategoryId])

  return (
    <div className="relative w-full">
      {/* Botões de navegação */}
      <div className="absolute inset-y-0 left-0 flex items-center z-10">
        <button
          onClick={() => handleScroll("left")}
          className={cn(
            "p-1 rounded-full bg-background/80 backdrop-blur-sm shadow-lg transition-opacity duration-200",
            showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Categorias anteriores"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center z-10">
        <button
          onClick={() => handleScroll("right")}
          className={cn(
            "p-1 rounded-full bg-background/80 backdrop-blur-sm shadow-lg transition-opacity duration-200",
            showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Próximas categorias"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Container do carrossel */}
      <div
        ref={containerRef}
        className={cn(
          "flex space-x-2 overflow-x-auto scrollbar-hide",
          isMobile ? "px-8" : "px-12",
          "scroll-smooth"
        )}
      >
        {visibleIndices.map((index) => {
          const category = categories[index]
          if (!category?.id) return null

          return (
            <motion.button
              key={category.id}
              data-category-id={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-3 py-2 text-sm whitespace-nowrap rounded-md flex items-center transition-all duration-200",
                selectedCategoryId === category.id 
                  ? "bg-primary text-primary-foreground scale-105" 
                  : "bg-muted/30 hover:bg-muted/50",
                hasVote(category.id) && "text-success"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={selectedCategoryId === category.id}
              aria-label={`Categoria ${category.name} ${hasVote(category.id) ? "(votada)" : ""}`}
            >
              {isMobile ? category.name.split(" ").pop() : category.name}
              {hasVote(category.id) && (
                <span className="ml-1 text-success">✓</span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
} 