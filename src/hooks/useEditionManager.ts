"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { VotingEdition, Category } from "@/types/types"
import { useLocalEdition } from "@/hooks/useLocalEdition"

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
  
  // Obter edição inicial da URL ou localStorage
  const getInitialEdition = () => {
    const editionFromUrl = searchParams.get("votingEdition")
    if (editionFromUrl && editions.some(e => e.id === editionFromUrl)) {
      return editionFromUrl
    }
    if (localEdition && editions.some(e => e.id === localEdition)) {
      return localEdition
    }
    return "2025" // Edição padrão
  }

  const [selectedEditionId, setSelectedEditionId] = useState<string>(getInitialEdition())
  const [activeCategory, setActiveCategory] = useState<string>("")

  // Atualizar edição quando mudar na URL ou quando as edições forem carregadas
  useEffect(() => {
    if (editions.length > 0) {
      const editionFromUrl = searchParams.get("votingEdition")
      
      // Se houver edição na URL, usa ela
      if (editionFromUrl && editions.some(e => e.id === editionFromUrl)) {
        setSelectedEditionId(editionFromUrl)
        saveLocalEdition(editionFromUrl)
      } 
      // Se não houver edição na URL, verifica o localStorage
      else if (localEdition && editions.some(e => e.id === localEdition)) {
        setSelectedEditionId(localEdition)
      }
      // Se não houver nem na URL nem no localStorage, usa 2025
      else {
        setSelectedEditionId("2025")
      }
    }
  }, [searchParams, editions, localEdition])

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
