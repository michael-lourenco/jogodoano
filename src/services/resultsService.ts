import { dbFirestore } from "@/services/FirebaseService"
import { collection, getDocs, type DocumentData } from "firebase/firestore"
import { votingEditions } from "@/repositories/votingEditions"
import { games } from "@/repositories/games"
import type { EditionResults, CategoryResult, GameResult, EditionStats, ResultsChartData } from "@/types/results"
import type { VotingEdition } from "@/types/types"

/**
 * Busca todos os votos de uma edição específica do Firebase
 */
async function fetchEditionVotes(editionId: string) {
  try {
    const usersRef = collection(dbFirestore, process.env.NEXT_PUBLIC_USERS_COLLECTION!)
    const usersSnapshot = await getDocs(usersRef)
    
    const votes: Array<{
      userId: string
      categoryId: string
      gameId: string
      timestamp: number
    }> = []

    usersSnapshot.forEach((doc: any) => {
      const userData = doc.data() as DocumentData
      
      // Verifica se o usuário tem votos e se tem votos para a edição específica
      if (userData.votes && userData.votes[editionId]) {
        const editionVotes = userData.votes[editionId]
        
        // Verifica se editionVotes é um objeto válido
        if (typeof editionVotes === 'object' && editionVotes !== null) {
          Object.entries(editionVotes).forEach(([categoryId, gameId]) => {
            // Verifica se o gameId é uma string válida
            if (typeof gameId === 'string' && gameId.trim() !== '') {
              votes.push({
                userId: doc.id,
                categoryId,
                gameId,
                timestamp: Date.now() // Usando timestamp atual como aproximação
              })
            }
          })
        }
      }
    })

    console.log(`Encontrados ${votes.length} votos para a edição ${editionId}`)
    return votes
  } catch (error) {
    console.error("Erro ao buscar votos da edição:", error)
    return []
  }
}

/**
 * Calcula os resultados de uma categoria específica
 */
function calculateCategoryResults(
  categoryId: string,
  votes: Array<{ userId: string; categoryId: string; gameId: string; timestamp: number }>,
  edition: VotingEdition
): CategoryResult {
  const category = edition.categories.find(cat => cat.id === categoryId)
  if (!category) {
    throw new Error(`Categoria ${categoryId} não encontrada`)
  }

  // Filtra votos da categoria
  const categoryVotes = votes.filter(vote => vote.categoryId === categoryId)
  
  // Conta votos por jogo
  const gameVoteCounts: Record<string, number> = {}
  category.gameIds.forEach(gameId => {
    gameVoteCounts[gameId] = 0
  })

  categoryVotes.forEach(vote => {
    if (gameVoteCounts[vote.gameId] !== undefined) {
      gameVoteCounts[vote.gameId]++
    }
  })

  // Cria resultados dos jogos
  const gameResults: GameResult[] = Object.entries(gameVoteCounts)
    .map(([gameId, votes]) => {
      const game = games.find(g => g.id === gameId)
      if (!game) {
        throw new Error(`Jogo ${gameId} não encontrado`)
      }

      return {
        game,
        votes,
        percentage: categoryVotes.length > 0 ? (votes / categoryVotes.length) * 100 : 0,
        position: 0 // Será calculado depois
      }
    })
    .sort((a, b) => b.votes - a.votes)

  // Calcula posições
  gameResults.forEach((result, index) => {
    result.position = index + 1
  })

  return {
    category,
    totalVotes: categoryVotes.length,
    games: gameResults,
    topGame: gameResults[0] || null
  }
}

/**
 * Calcula estatísticas gerais da edição
 */
function calculateEditionStats(results: CategoryResult[]): EditionStats {
  const totalVotes = results.reduce((sum, cat) => sum + cat.totalVotes, 0)
  const averageVotesPerCategory = results.length > 0 ? totalVotes / results.length : 0
  
  const mostVotedCategory = results.reduce((max, cat) => 
    cat.totalVotes > max.totalVotes ? cat : max
  ).category.name

  const leastVotedCategory = results.reduce((min, cat) => 
    cat.totalVotes < min.totalVotes ? cat : min
  ).category.name

  // Calcula votantes únicos baseado no total de votos
  // Assumindo que cada usuário vota em todas as categorias
  const uniqueVoters = results.length > 0 ? Math.max(...results.map(cat => cat.totalVotes)) : 0

  // Taxa de participação baseada no total de votos
  const participationRate = results.length > 0 ? 
    Math.min((totalVotes / (results.length * 100)) * 100, 100) : 0 // Estimativa mais realista

  return {
    totalVotes,
    uniqueVoters,
    averageVotesPerCategory,
    mostVotedCategory,
    leastVotedCategory,
    participationRate
  }
}

/**
 * Gera dados para gráficos
 */
function generateChartData(results: CategoryResult[]): ResultsChartData {
  const categoryVotes = results.map(cat => ({
    name: cat.category.name,
    votes: cat.totalVotes
  }))

  // Combina todos os jogos e pega os top 10
  const allGames = results.flatMap(cat => cat.games)
  const topGames = allGames
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10)
    .map(game => ({
      name: game.game.title,
      votes: game.votes
    }))

  // Gera dados de votos ao longo do tempo (mock para demonstração)
  const votesOverTime = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      votes: Math.floor(Math.random() * 500) + 100
    }
  })

  return {
    categoryVotes,
    topGames,
    votesOverTime
  }
}

/**
 * Busca resultados completos de uma edição
 */
export async function getEditionResults(editionId: string): Promise<EditionResults> {
  try {
    // Busca a edição
    const edition = votingEditions.find(ed => ed.id === editionId)
    if (!edition) {
      throw new Error(`Edição ${editionId} não encontrada`)
    }

    // Busca votos do Firebase
    const votes = await fetchEditionVotes(editionId)
    
    console.log(`Processando ${votes.length} votos para ${edition.categories.length} categorias`)

    // Calcula resultados por categoria
    const categoryResults: CategoryResult[] = edition.categories.map(category =>
      calculateCategoryResults(category.id, votes, edition)
    )

    // Calcula estatísticas gerais
    const stats = calculateEditionStats(categoryResults)

    // Gera dados para gráficos
    const chartData = generateChartData(categoryResults)

    // Combina todos os jogos para ranking geral
    const allGames = categoryResults.flatMap(cat => cat.games)
    const topGames = allGames
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10)

    const results: EditionResults = {
      editionId,
      editionName: edition.name,
      totalVotes: stats.totalVotes,
      uniqueVoters: stats.uniqueVoters,
      categories: categoryResults,
      topGames,
      lastUpdated: new Date().toISOString(),
      isRevealed: true // Por padrão, assume que está revelado
    }

    console.log(`Resultados processados: ${stats.totalVotes} votos totais, ${stats.uniqueVoters} votantes únicos`)
    return results
  } catch (error) {
    console.error("Erro ao buscar resultados da edição:", error)
    throw error
  }
}

/**
 * Busca resultados de múltiplas edições
 */
export async function getMultipleEditionResults(editionIds: string[]): Promise<EditionResults[]> {
  const results = await Promise.all(
    editionIds.map(id => getEditionResults(id))
  )
  return results
}

/**
 * Verifica se uma edição tem resultados disponíveis
 */
export async function hasEditionResults(editionId: string): Promise<boolean> {
  try {
    const votes = await fetchEditionVotes(editionId)
    const hasResults = votes.length > 0
    console.log(`Edição ${editionId} tem resultados: ${hasResults} (${votes.length} votos)`)
    return hasResults
  } catch (error) {
    console.error(`Erro ao verificar resultados da edição ${editionId}:`, error)
    return false
  }
}

/**
 * Busca estatísticas básicas de uma edição
 */
export async function getEditionBasicStats(editionId: string): Promise<{
  totalVotes: number
  uniqueVoters: number
  categories: number
  hasData: boolean
}> {
  try {
    const votes = await fetchEditionVotes(editionId)
    const edition = votingEditions.find(ed => ed.id === editionId)
    
    return {
      totalVotes: votes.length,
      uniqueVoters: new Set(votes.map(v => v.userId)).size,
      categories: edition?.categories.length || 0,
      hasData: votes.length > 0
    }
  } catch (error) {
    console.error(`Erro ao buscar estatísticas básicas da edição ${editionId}:`, error)
    return {
      totalVotes: 0,
      uniqueVoters: 0,
      categories: 0,
      hasData: false
    }
  }
} 