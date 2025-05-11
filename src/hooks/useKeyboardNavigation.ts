"use client"
import { useEffect } from "react"
import type { Category } from "@/types/types"

interface KeyboardNavigationProps {
  localActiveCategory: string
  setLocalActiveCategory: (categoryId: string) => void
  setActiveCategory: (categoryId: string) => void
  getCurrentEditionCategories: () => Category[]
  handleCategoryTransition: (fromCategoryId: string, toCategoryId: string) => void
}

export function useKeyboardNavigation({
  localActiveCategory,
  setLocalActiveCategory,
  setActiveCategory,
  getCurrentEditionCategories,
  handleCategoryTransition,
}: KeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const categories = getCurrentEditionCategories()
      const currentIndex = categories.findIndex((cat) => cat.id === localActiveCategory)

      if (currentIndex === -1) return

      // Left arrow or up arrow navigates to previous category
      if ((e.key === "ArrowLeft" || e.key === "ArrowUp") && currentIndex > 0) {
        e.preventDefault()
        const prevCategory = categories[currentIndex - 1]
        handleCategoryTransition(localActiveCategory, prevCategory.id)
        setTimeout(() => {
          setLocalActiveCategory(prevCategory.id)
          setActiveCategory(prevCategory.id)
        }, 50)
      }

      // Right arrow or down arrow navigates to next category
      if ((e.key === "ArrowRight" || e.key === "ArrowDown") && currentIndex < categories.length - 1) {
        e.preventDefault()
        const nextCategory = categories[currentIndex + 1]
        handleCategoryTransition(localActiveCategory, nextCategory.id)
        setTimeout(() => {
          setLocalActiveCategory(nextCategory.id)
          setActiveCategory(nextCategory.id)
        }, 50)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    localActiveCategory,
    getCurrentEditionCategories,
    setLocalActiveCategory,
    setActiveCategory,
    handleCategoryTransition,
  ])
}
