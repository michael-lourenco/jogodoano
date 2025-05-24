"use client"
import { useState } from "react"
import type { TouchEvent } from "react"
import type { SwipeNavigationProps } from "@/types/voting/interfaces"

export function useSwipeNavigation({
  getCurrentEditionCategories,
  localActiveCategory,
  setLocalActiveCategory,
  setActiveCategory,
  categoryRefs,
  onCategoryChange,
}: SwipeNavigationProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const swipeThreshold = 50 // Minimum distance required for a swipe
  const transitionDuration = 400 // Duração da transição em ms (aumentada para ser mais suave)

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleCategoryTransition = (fromCategoryId: string, toCategoryId: string) => {
    // Get the elements
    const fromElement = categoryRefs.current[fromCategoryId]
    const toElement = categoryRefs.current[toCategoryId]

    if (!fromElement || !toElement) return

    // Get the categories
    const categories = getCurrentEditionCategories()
    const fromIndex = categories.findIndex((cat) => cat.id === fromCategoryId)
    const toIndex = categories.findIndex((cat) => cat.id === toCategoryId)

    // Determine direction
    const isNext = toIndex > fromIndex

    // Set initial states
    fromElement.style.transition = "none"
    toElement.style.transition = "none"
    fromElement.style.opacity = "1"
    fromElement.style.transform = "translateX(0)"
    toElement.style.opacity = "1" // Manter ambos os elementos com opacidade total para uma transição mais suave
    toElement.style.transform = isNext ? "translateX(100%)" : "translateX(-100%)"

    // Show both elements during transition
    fromElement.style.display = "block"
    toElement.style.display = "block"

    // Force reflow
    void fromElement.offsetWidth

    // Add transitions back with easing
    const transitionStyle = `transform ${transitionDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`
    fromElement.style.transition = transitionStyle
    toElement.style.transition = transitionStyle

    // Animate
    fromElement.style.transform = isNext ? "translateX(-100%)" : "translateX(100%)"
    toElement.style.transform = "translateX(0)"

    // Clean up after transition
    setTimeout(() => {
      // Restaura todos os elementos para garantir que o swipe continue funcionando
      Object.values(categoryRefs.current).forEach(element => {
        if (element) {
          if (element === toElement) {
            element.style.display = "block"
            element.style.opacity = "1"
            element.style.transform = "translateX(0)"
          } else {
            element.style.display = "none"
            element.style.transform = ""
          }
          element.style.transition = ""
        }
      });
    }, transitionDuration + 50)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > swipeThreshold
    const isRightSwipe = distance < -swipeThreshold

    if (isLeftSwipe || isRightSwipe) {
      const categories = getCurrentEditionCategories()
      const currentIndex = categories.findIndex((cat) => cat.id === localActiveCategory)

      if (currentIndex !== -1) {
        let newIndex

        if (isLeftSwipe) {
          // Swipe left to go to next category (circular)
          newIndex = (currentIndex + 1) % categories.length
        } else if (isRightSwipe) {
          // Swipe right to go to previous category (circular)
          newIndex = (currentIndex - 1 + categories.length) % categories.length
        }

        if (newIndex !== undefined) {
          const newCategory = categories[newIndex]
          const currentCategory = categories[currentIndex]

          // Apply the transition effect
          handleCategoryTransition(currentCategory.id, newCategory.id)

          // Update state after a small delay to allow the animation to start
          setTimeout(() => {
            setLocalActiveCategory(newCategory.id)
            setActiveCategory(newCategory.id)
            
            // Chamar o callback com o ID da nova categoria, se fornecido
            if (onCategoryChange) {
              setTimeout(() => onCategoryChange(newCategory.id), 100);
            }
          }, 50)
        }
      }
    }
  }

  const getCategoryPosition = (categoryId: string) => {
    const categories = getCurrentEditionCategories()
    const currentIndex = categories.findIndex((cat) => cat.id === localActiveCategory)
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId)

    if (currentIndex === categoryIndex) return "current"
    if (categoryIndex < currentIndex) return "previous"
    return "next"
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleCategoryTransition,
    getCategoryPosition,
    transitionDuration,
  }
}
