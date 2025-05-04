"use client"

import { useState, useEffect } from "react"
import type { VotingEdition, Category } from "@/types/types"

interface UseEditionManagerProps {
  editions: VotingEdition[]
  initialEditionId?: string
}

interface UseEditionManagerReturn {
  selectedEditionId: string
  activeCategory: string
  setSelectedEditionId: (editionId: string) => void
  setActiveCategory: (categoryId: string) => void
  handleEditionChange: (editionId: string) => void
  getCurrentEditionCategories: () => Category[]
}

export function useEditionManager({
  editions,
  initialEditionId = "2025",
}: UseEditionManagerProps): UseEditionManagerReturn {
  const [selectedEditionId, setSelectedEditionId] = useState<string>(initialEditionId)
  const [activeCategory, setActiveCategory] = useState<string>("")


  useEffect(() => {
    if (!selectedEditionId && editions.length > 0) {
      setSelectedEditionId(initialEditionId)
    }
  }, [editions, initialEditionId, selectedEditionId])

  useEffect(() => {
    if (selectedEditionId) {
      const currentEdition = editions.find((edition) => edition.id === selectedEditionId)
      if (currentEdition && currentEdition.categories.length > 0 && !activeCategory) {
        setActiveCategory(currentEdition.categories[0].id)
      }
    }
  }, [selectedEditionId, activeCategory, editions])

  const handleEditionChange = (editionId: string) => {
    setSelectedEditionId(editionId)

    const currentEdition = editions.find((edition) => edition.id === editionId)
    if (currentEdition && currentEdition.categories.length > 0) {
      setActiveCategory(currentEdition.categories[0].id)
    } else {
      setActiveCategory("")
    }
  }

  const getCurrentEditionCategories = () => {
    return editions.find((edition) => edition.id === selectedEditionId)?.categories || []
  }

  return {
    selectedEditionId,
    activeCategory,
    setSelectedEditionId,
    setActiveCategory,
    handleEditionChange,
    getCurrentEditionCategories,
  }
}
