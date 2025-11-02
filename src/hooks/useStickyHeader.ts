"use client"
import { useRef, useState, useEffect } from "react"
import type { StickyHeaderState } from "@/types/voting/interfaces"

export function useStickyHeader(): StickyHeaderState {
  const [isSticky, setIsSticky] = useState(false)
  const editionsSelectorRef = useRef<HTMLDivElement>(null)
  const [editionsSelectorHeightValue, setEditionsSelectorHeightValue] = useState(0)
  const [originalTopOffsetValue, setOriginalTopOffsetValue] = useState<number | null>(null)
  const categoryTabsRef = useRef<HTMLDivElement>(null)
  const [categoryTabsHeightValue, setCategoryTabsHeightValue] = useState(0)

  // Criamos objetos que são compatíveis com a interface esperada,
  // mas usando useState internamente
  const editionsSelectorHeight = {
    current: editionsSelectorHeightValue
  }
  
  const originalTopOffset = {
    current: originalTopOffsetValue
  }
  
  const categoryTabsHeight = {
    current: categoryTabsHeightValue
  }

  useEffect(() => {
    const handleScroll = () => {
      if (editionsSelectorRef.current) {
        const scrollPosition = window.scrollY
        const selectorRect = editionsSelectorRef.current.getBoundingClientRect()

        if (!originalTopOffsetValue && selectorRect.top >= 0) {
          setOriginalTopOffsetValue(selectorRect.top + scrollPosition)
          setEditionsSelectorHeightValue(selectorRect.height)
        }

        if (originalTopOffsetValue) {
          const isCurrentlySticky = scrollPosition > originalTopOffsetValue
          setIsSticky(isCurrentlySticky)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Initial calculation after render
    queueMicrotask(() => {
      if (editionsSelectorRef.current) {
        const selectorRect = editionsSelectorRef.current.getBoundingClientRect()
        setOriginalTopOffsetValue(selectorRect.top + window.scrollY)
        setEditionsSelectorHeightValue(selectorRect.height)
      }

      if (categoryTabsRef.current) {
        const tabsRect = categoryTabsRef.current.getBoundingClientRect()
        setCategoryTabsHeightValue(tabsRect.height)
      }
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [originalTopOffsetValue])

  // Atualizar alturas quando sticky muda, com delay para garantir que o DOM foi atualizado
  useEffect(() => {
    if (!isSticky) return

    const updateHeights = () => {
      requestAnimationFrame(() => {
        if (editionsSelectorRef.current) {
          const height = editionsSelectorRef.current.offsetHeight
          setEditionsSelectorHeightValue(height)
        }

        if (categoryTabsRef.current) {
          const height = categoryTabsRef.current.offsetHeight
          setCategoryTabsHeightValue(height)
        }
      })
    }

    // Pequeno delay para garantir que o DOM foi atualizado com as classes sticky
    const timeoutId = setTimeout(updateHeights, 10)
    
    return () => clearTimeout(timeoutId)
  }, [isSticky])

  return {
    isSticky,
    editionsSelectorRef,
    editionsSelectorHeight,
    categoryTabsRef,
    categoryTabsHeight,
  }
}
