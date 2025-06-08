"use client"

import { useState, useEffect } from "react"

interface CategoryStats {
  totalVotes: number
  topGames: Array<{
    gameId: string
    votes: number
  }>
}

interface EditionStats {
  id: string
  name: string
  totalVotes: number
  totalVoters: number
  categories: {
    [categoryId: string]: CategoryStats
  }
  lastUpdated: Date
}

interface GlobalStats {
  id: string
  totalEditions: number
  totalCategories: number
  totalVotes: number
  totalVoters: number
  editions: {
    [editionId: string]: {
      totalVotes: number
      totalVoters: number
    }
  }
  lastUpdated: Date
}

interface Statistics {
  editionStats: {
    [editionId: string]: EditionStats
  }
  globalStats: GlobalStats
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatistics() {
      try {
        setLoading(true)
        const response = await fetch("/api/statistics")
        
        if (!response.ok) {
          throw new Error("Erro ao buscar estatísticas")
        }

        const data = await response.json()
        setStatistics(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
        setStatistics(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  return {
    statistics,
    loading,
    error
  }
} 