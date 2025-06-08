import { dbFirestore } from "@/services/firebase/FirebaseService"
import { collection, getDocs, doc, writeBatch } from "firebase/firestore"
import type { UserData } from "@/application/entities/User"

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

interface UserVotes {
  [editionId: string]: {
    [categoryId: string]: string
  }
}

export async function generateStatistics() {
  try {
    console.log("Iniciando geração de estatísticas...")

    // 1. Buscar todos os usuários com votos
    const usersCollection = collection(dbFirestore, "users")
    const usersSnapshot = await getDocs(usersCollection)
    const users = usersSnapshot.docs.map(doc => doc.data() as UserData)

    // 2. Agregar votos por jogo em cada categoria de cada edição
    const editionStats: { [editionId: string]: EditionStats } = {}
    const globalStats: GlobalStats = {
      id: "global",
      totalEditions: 0,
      totalCategories: 0,
      totalVotes: 0,
      totalVoters: 0,
      editions: {},
      lastUpdated: new Date()
    }

    // Processar votos de cada usuário
    for (const user of users) {
      if (!user.votes) continue

      // Processar votos de cada edição
      for (const [editionId, categoryVotes] of Object.entries(user.votes)) {
        // Inicializar estatísticas da edição se não existir
        if (!editionStats[editionId]) {
          editionStats[editionId] = {
            id: editionId,
            name: "", // Será preenchido depois
            totalVotes: 0,
            totalVoters: 0,
            categories: {},
            lastUpdated: new Date()
          }
        }

        // Incrementar contador de votantes
        editionStats[editionId].totalVoters++
        globalStats.totalVoters++

        // Processar votos de cada categoria
        for (const [categoryId, gameId] of Object.entries(categoryVotes)) {
          // Inicializar estatísticas da categoria se não existir
          if (!editionStats[editionId].categories[categoryId]) {
            editionStats[editionId].categories[categoryId] = {
              totalVotes: 0,
              topGames: []
            }
          }

          // Incrementar contadores
          editionStats[editionId].totalVotes++
          editionStats[editionId].categories[categoryId].totalVotes++
          globalStats.totalVotes++

          // Atualizar contagem de votos do jogo
          const categoryStats = editionStats[editionId].categories[categoryId]
          const gameIndex = categoryStats.topGames.findIndex(g => g.gameId === gameId)
          
          if (gameIndex === -1) {
            categoryStats.topGames.push({ gameId, votes: 1 })
          } else {
            categoryStats.topGames[gameIndex].votes++
          }
        }
      }
    }

    // 3. Ordenar jogos por número de votos em cada categoria
    for (const edition of Object.values(editionStats)) {
      for (const category of Object.values(edition.categories)) {
        category.topGames.sort((a, b) => b.votes - a.votes)
      }
    }

    // 4. Atualizar estatísticas globais
    globalStats.totalEditions = Object.keys(editionStats).length
    globalStats.totalCategories = Object.values(editionStats).reduce(
      (acc, edition) => acc + Object.keys(edition.categories).length,
      0
    )

    // 5. Salvar estatísticas no Firestore
    const batch = writeBatch(dbFirestore)

    // Salvar estatísticas por edição
    for (const [editionId, stats] of Object.entries(editionStats)) {
      const editionRef = doc(dbFirestore, "edition_statistics", editionId)
      batch.set(editionRef, stats)
    }

    // Salvar estatísticas globais
    const globalStatsRef = doc(dbFirestore, "global_statistics", "global")
    batch.set(globalStatsRef, globalStats)

    // Executar batch
    await batch.commit()

    console.log("Estatísticas geradas com sucesso!")
    return {
      editionStats,
      globalStats
    }
  } catch (error) {
    console.error("Erro ao gerar estatísticas:", error)
    throw error
  }
} 