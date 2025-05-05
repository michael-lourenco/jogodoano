"use client"

import { useState, useEffect } from "react"
import type { VotingEdition } from "@/types/types"
import { getAllEditions } from "@/services/admin/editionsService"

export function useEditions() {
  const [editions, setEditions] = useState<VotingEdition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchEditions = async () => {
      setIsLoading(true)
      try {
        const data = await getAllEditions()
        setEditions(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch editions"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchEditions()
  }, [])

  return { editions, isLoading, error }
}
