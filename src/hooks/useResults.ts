import { useState, useEffect, useCallback } from "react"
import type { EditionResults, ResultsFilters } from "@/types/results"
import { getEditionResults, hasEditionResults, getEditionBasicStats } from "@/services/resultsService"

interface UseResultsProps {
  editionId?: string
}

interface UseResultsReturn {
  results: EditionResults | null
  isLoading: boolean
  error: string | null
  filters: ResultsFilters
  setFilters: (filters: ResultsFilters) => void
  loadResults: (editionId: string) => Promise<void>
  refreshResults: () => Promise<void>
  checkDataAvailability: (editionId: string) => Promise<boolean>
  getBasicStats: (editionId: string) => Promise<{
    totalVotes: number
    uniqueVoters: number
    categories: number
    hasData: boolean
  }>
}

export function useResults({ editionId }: UseResultsProps = {}): UseResultsReturn {
  const [results, setResults] = useState<EditionResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ResultsFilters>({
    sortBy: 'votes',
    sortOrder: 'desc'
  })

  // Função para carregar resultados do Firebase
  const loadResults = useCallback(async (editionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Busca resultados reais do Firebase
      const realResults = await getEditionResults(editionId)
      setResults(realResults)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar resultados"
      setError(errorMessage)
      console.error("Erro ao carregar resultados:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para atualizar resultados
  const refreshResults = useCallback(async () => {
    if (results?.editionId) {
      await loadResults(results.editionId)
    }
  }, [results?.editionId, loadResults])

  // Carrega resultados quando editionId muda
  useEffect(() => {
    if (editionId) {
      loadResults(editionId)
    }
  }, [editionId, loadResults])

  return {
    results,
    isLoading,
    error,
    filters,
    setFilters,
    loadResults,
    refreshResults,
    checkDataAvailability: hasEditionResults,
    getBasicStats: getEditionBasicStats
  }
} 