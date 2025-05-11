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
}: SwipeNavigationProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const swipeThreshold = 50 // Minimum distance required for a swipe

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
    toElement.style.opacity = "0"
    fromElement.style.transform = "translateX(0)"
    toElement.style.transform = isNext ? "translateX(100%)" : "translateX(-100%)"

    // Show both elements during transition
    fromElement.style.display = "block"
    toElement.style.display = "block"

    // Force reflow
    void fromElement.offsetWidth

    // Add transitions back
    fromElement.style.transition = "transform 300ms ease-in-out, opacity 300ms ease-in-out"
    toElement.style.transition = "transform 300ms ease-in-out, opacity 300ms ease-in-out"

    // Animate
    fromElement.style.transform = isNext ? "translateX(-100%)" : "translateX(100%)"
    fromElement.style.opacity = "0"
    toElement.style.transform = "translateX(0)"
    toElement.style.opacity = "1"

    // Clean up after transition
    setTimeout(() => {
      fromElement.style.display = "none"
      fromElement.style.transition = ""
      fromElement.style.transform = ""
      toElement.style.transition = ""
    }, 300)
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

        if (isLeftSwipe && currentIndex < categories.length - 1) {
          // Swipe left to go to next category
          newIndex = currentIndex + 1
        } else if (isRightSwipe && currentIndex > 0) {
          // Swipe right to go to previous category
          newIndex = currentIndex - 1
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
  }
}
