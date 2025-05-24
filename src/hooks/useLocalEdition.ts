"use client"

import { useState, useEffect } from "react"

const LOCAL_EDITION_KEY = "jogodoano_selected_edition"

export function useLocalEdition() {
  const [localEdition, setLocalEdition] = useState<string>("")

  // Carregar edição do localStorage
  useEffect(() => {
    const storedEdition = localStorage.getItem(LOCAL_EDITION_KEY)
    if (storedEdition) {
      setLocalEdition(storedEdition)
    }
  }, [])

  // Salvar edição no localStorage
  const saveLocalEdition = (editionId: string) => {
    localStorage.setItem(LOCAL_EDITION_KEY, editionId)
    setLocalEdition(editionId)
  }

  return {
    localEdition,
    saveLocalEdition
  }
} 