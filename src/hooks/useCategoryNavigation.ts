"use client"
import { useCallback } from 'react'
import { Category } from '@/types/types'

interface UseCategoryNavigationProps {
  getCurrentEditionCategories: () => Category[]
  localActiveCategory: string
  setLocalActiveCategory: (categoryId: string) => void
  setActiveCategory: (categoryId: string) => void
  handleCategoryTransition: (fromCategoryId: string, toCategoryId: string) => void
}

export function useCategoryNavigation({
  getCurrentEditionCategories,
  localActiveCategory,
  setLocalActiveCategory,
  setActiveCategory,
  handleCategoryTransition
}: UseCategoryNavigationProps) {
  const handleCategoryClick = useCallback((categoryId: string) => {
    const categories = getCurrentEditionCategories()
    if (!categories.length || !categories.some(cat => cat.id === categoryId)) return
    
    if (categoryId === localActiveCategory) return
    
    // Começar a transição visual
    handleCategoryTransition(localActiveCategory, categoryId)
    
    // Atualizar estados logo em seguida
    setLocalActiveCategory(categoryId)
    setActiveCategory(categoryId)
  }, [getCurrentEditionCategories, localActiveCategory, handleCategoryTransition, setLocalActiveCategory, setActiveCategory])

  const navigateToCategory = useCallback((direction: "prev" | "next") => {
    const categories = getCurrentEditionCategories()
    if (!categories.length) return

    const currentCategoryIndex = categories.findIndex((cat) => cat.id === localActiveCategory)
    if (currentCategoryIndex === -1) return

    let nextCategoryId: string | undefined

    if (direction === "prev") {
      const prevIndex = (currentCategoryIndex - 1 + categories.length) % categories.length
      nextCategoryId = categories[prevIndex]?.id
    } else {
      const nextIndex = (currentCategoryIndex + 1) % categories.length
      nextCategoryId = categories[nextIndex]?.id
    }

    if (!nextCategoryId) return

    // Começar a transição visual
    handleCategoryTransition(localActiveCategory, nextCategoryId)
    
    // Atualizar estados logo em seguida
    setLocalActiveCategory(nextCategoryId)
    setActiveCategory(nextCategoryId)
  }, [getCurrentEditionCategories, localActiveCategory, handleCategoryTransition, setLocalActiveCategory, setActiveCategory])

  const scrollToCategoryTop = useCallback(() => {
    const headerElement = document.getElementById(`category-header-${localActiveCategory}`)
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [localActiveCategory])

  return {
    handleCategoryClick,
    navigateToCategory,
    scrollToCategoryTop
  }
}
