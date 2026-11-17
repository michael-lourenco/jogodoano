"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import type { VotingEdition, Category } from "@/types/types"
import { useLocalEdition } from "@/hooks/useLocalEdition"
import { isEditionActive } from "@/utils/editionUtils"

const DEFAULT_EDITION_ID = "2026"

interface UseEditionManagerProps {
  editions: VotingEdition[]
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
}: UseEditionManagerProps): UseEditionManagerReturn {
  const searchParams = useSearchParams()
  const { localEdition, saveLocalEdition } = useLocalEdition()
  const userSelectedEdition = useRef(false)

  const [selectedEditionId, setSelectedEditionId] = useState<string>(DEFAULT_EDITION_ID)
  const [activeCategory, setActiveCategory] = useState<string>("")

  // A edição aberta para votação prevalece sobre uma edição encerrada salva no navegador.
  useEffect(() => {
    if (editions.length === 0 || userSelectedEdition.current) {
      return
    }

    const editionFromUrl = searchParams.get("votingEdition")
    const urlEdition = editions.find((edition) => edition.id === editionFromUrl)
    if (urlEdition && isEditionActive(urlEdition)) {
      setSelectedEditionId(urlEdition.id)
      if (localEdition !== urlEdition.id) {
        saveLocalEdition(urlEdition.id)
      }
      return
    }

    const storedEdition = editions.find((edition) => edition.id === localEdition)
    if (storedEdition && isEditionActive(storedEdition)) {
      setSelectedEditionId(storedEdition.id)
      return
    }

    const activeEdition = editions.find((edition) => isEditionActive(edition)) ?? editions.find((edition) => edition.id === DEFAULT_EDITION_ID)
    if (activeEdition) {
      setSelectedEditionId(activeEdition.id)
      if (localEdition !== activeEdition.id) {
        saveLocalEdition(activeEdition.id)
      }
      return
    }

    if (storedEdition) {
      setSelectedEditionId(storedEdition.id)
      return
    }

    setSelectedEditionId(DEFAULT_EDITION_ID)
  }, [searchParams, editions, localEdition, saveLocalEdition])

  // Atualizar categoria ativa quando mudar a edição
  useEffect(() => {
    if (selectedEditionId && editions.length > 0) {
      const currentEdition = editions.find((edition) => edition.id === selectedEditionId)
      if (currentEdition && currentEdition.categories.length > 0 && !activeCategory) {
        setActiveCategory(currentEdition.categories[0].id)
      }
    }
  }, [selectedEditionId, activeCategory, editions])

  const handleEditionChange = (editionId: string) => {
    if (editions.some(e => e.id === editionId)) {
      userSelectedEdition.current = true
      setSelectedEditionId(editionId)
      saveLocalEdition(editionId)

      const currentEdition = editions.find((edition) => edition.id === editionId)
      if (currentEdition && currentEdition.categories.length > 0) {
        setActiveCategory(currentEdition.categories[0].id)
      } else {
        setActiveCategory("")
      }
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
