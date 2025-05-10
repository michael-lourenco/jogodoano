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
          setLocalActiveCategory(newCategory.id)
          setActiveCategory(newCategory.id)

          // Scroll the category into view
          setTimeout(() => {
            categoryRefs.current[newCategory.id]?.scrollIntoView({ behavior: "smooth", block: "start" })
          }, 100)
        }
      }
    }
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
