"use client"

import { useState, useEffect } from "react"
import type { EditionStats, GlobalStats, CategoryStats } from "@/services/statisticsService"

interface Statistics {
  editionStats: {
    [editionId: string]: EditionStats
  }
  globalStats: GlobalStats
}

interface StatisticsError {
  message: string
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<StatisticsError | null>(null)

  useEffect(() => {
    async function fetchStatistics() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/statistics")
        if (!response.ok) {
          throw new Error("Erro ao carregar estatísticas")
        }
        const data = await response.json()
        setStatistics(data)
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : "Erro desconhecido"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  return { statistics, isLoading, error }
} 