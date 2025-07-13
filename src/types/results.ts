import type { Game, Category } from "./types"

/**
 * Interface para estatísticas de um jogo específico
 */
export interface GameResult {
  game: Game
  votes: number
  percentage: number
  position: number
}

/**
 * Interface para resultados de uma categoria
 */
export interface CategoryResult {
  category: Category
  totalVotes: number
  games: GameResult[]
  topGame: GameResult
}

/**
 * Interface para resultados completos de uma edição
 */
export interface EditionResults {
  editionId: string
  editionName: string
  totalVotes: number
  uniqueVoters: number
  categories: CategoryResult[]
  topGames: GameResult[]
  lastUpdated: string
  isRevealed: boolean
}

/**
 * Interface para estatísticas gerais da edição
 */
export interface EditionStats {
  totalVotes: number
  uniqueVoters: number
  averageVotesPerCategory: number
  mostVotedCategory: string
  leastVotedCategory: string
  participationRate: number
}

/**
 * Interface para dados de gráficos de resultados
 */
export interface ResultsChartData {
  categoryVotes: Array<{
    name: string
    votes: number
  }>
  topGames: Array<{
    name: string
    votes: number
  }>
  votesOverTime: Array<{
    date: string
    votes: number
  }>
}

/**
 * Interface para filtros de resultados
 */
export interface ResultsFilters {
  categoryId?: string
  minVotes?: number
  sortBy?: 'votes' | 'percentage' | 'position'
  sortOrder?: 'asc' | 'desc'
} 