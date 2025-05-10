"use client"
import { useRef, useState, useEffect } from "react"
import type { StickyHeaderState } from "@/types/voting/interfaces"

export function useStickyHeader(): StickyHeaderState {
  const [isSticky, setIsSticky] = useState(false)
  const editionsSelectorRef = useRef<HTMLDivElement>(null)
  const editionsSelectorHeight = useRef<number>(0)
  const originalTopOffset = useRef<number | null>(null)
  const categoryTabsRef = useRef<HTMLDivElement>(null)
  const categoryTabsHeight = useRef<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      if (editionsSelectorRef.current) {
        const scrollPosition = window.scrollY
        const selectorRect = editionsSelectorRef.current.getBoundingClientRect()

        if (!originalTopOffset.current && selectorRect.top >= 0) {
          originalTopOffset.current = selectorRect.top + scrollPosition
          editionsSelectorHeight.current = selectorRect.height
        }

        if (originalTopOffset.current) {
          setIsSticky(scrollPosition > originalTopOffset.current)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Initial calculation after render
    queueMicrotask(() => {
      if (editionsSelectorRef.current) {
        const selectorRect = editionsSelectorRef.current.getBoundingClientRect()
        originalTopOffset.current = selectorRect.top + window.scrollY
        editionsSelectorHeight.current = selectorRect.height
      }

      if (categoryTabsRef.current) {
        const tabsRect = categoryTabsRef.current.getBoundingClientRect()
        categoryTabsHeight.current = tabsRect.height
      }
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return {
    isSticky,
    editionsSelectorRef,
    editionsSelectorHeight,
    categoryTabsRef,
    categoryTabsHeight,
  }
}
