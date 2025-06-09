import { dbFirestore } from "@/services/firebase/FirebaseService"
import { collection, getDocs, doc, writeBatch, Timestamp, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import type { UserData } from "@/application/entities/User"
import type { VotingEdition } from "@/types/types"
import { votingEditions } from "@/repositories/votingEditions"

interface GameVotes {
  gameId: string
  votes: number
  voters: string[] // Array de IDs dos usuários que votaram
}

export interface CategoryStats {
  totalVotes: number
  topGames: GameVotes[]
  games: {
    [gameId: string]: {
      votes: number
      voters: string[]
    }
  }
}

export interface EditionStats {
  id: string
  name: string
  isLimitedTime: boolean
  startAt: Date | null
  endAt: Date | null
  status: "upcoming" | "active" | "ended"
  totalVotes: number
  totalVoters: number
  categories: {
    [categoryId: string]: CategoryStats
  }
  lastUpdated: Date
}

export interface GlobalStats {
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

    // 1. Usar as edições do repositório
    const editions = votingEditions.reduce((acc, edition) => {
      console.log(`Processando edição ${edition.id}:`, {
        startAt: edition.startAt,
        endAt: edition.endAt,
        isLimitedTime: edition.isLimitedTime
      })

      acc[edition.id] = {
        name: edition.name,
        isLimitedTime: edition.isLimitedTime,
        startAt: edition.startAt || null,
        endAt: edition.endAt || null,
        status: edition.status
      }
      return acc
    }, {} as Record<string, { 
      name: string
      isLimitedTime: boolean
      startAt: Date | null
      endAt: Date | null
      status: "upcoming" | "active" | "ended"
    }>)

    // 2. Buscar todos os usuários com votos
    const usersCollection = collection(dbFirestore, "users")
    const usersSnapshot = await getDocs(usersCollection)
    const users = usersSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as UserData)

    // 3. Agregar votos por jogo em cada categoria de cada edição
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
      for (const [editionId, categoryVotes] of Object.entries(user.votes as unknown as UserVotes)) {
        // Inicializar estatísticas da edição se não existir
        if (!editionStats[editionId]) {
          const editionData = editions[editionId] || { 
            name: `Edição ${editionId}`,
            isLimitedTime: false,
            startAt: null,
            endAt: null,
            status: "upcoming"
          }

          editionStats[editionId] = {
            id: editionId,
            name: editionData.name,
            isLimitedTime: editionData.isLimitedTime,
            startAt: editionData.startAt,
            endAt: editionData.endAt,
            status: editionData.status,
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
              topGames: [],
              games: {}
            }
          }

          const categoryStats = editionStats[editionId].categories[categoryId]

          // Inicializar estatísticas do jogo se não existir
          if (!categoryStats.games[gameId]) {
            categoryStats.games[gameId] = {
              votes: 0,
              voters: []
            }
          }

          // Incrementar contadores
          editionStats[editionId].totalVotes++
          categoryStats.totalVotes++
          categoryStats.games[gameId].votes++
          categoryStats.games[gameId].voters.push(user.email)
          globalStats.totalVotes++

          // Atualizar topGames
          const gameIndex = categoryStats.topGames.findIndex(g => g.gameId === gameId)
          if (gameIndex === -1) {
            categoryStats.topGames.push({
              gameId,
              votes: 1,
              voters: [user.email]
            })
          } else {
            categoryStats.topGames[gameIndex].votes++
            categoryStats.topGames[gameIndex].voters.push(user.email)
          }
        }
      }
    }

    // 4. Ordenar jogos por número de votos em cada categoria
    for (const edition of Object.values(editionStats)) {
      for (const category of Object.values(edition.categories)) {
        category.topGames.sort((a, b) => b.votes - a.votes)
      }
    }

    // 5. Atualizar estatísticas globais
    globalStats.totalEditions = Object.keys(editionStats).length
    globalStats.totalCategories = Object.values(editionStats).reduce(
      (acc, edition) => acc + Object.keys(edition.categories).length,
      0
    )

    // 6. Salvar estatísticas no Firestore
    const batch = writeBatch(dbFirestore)

    // Salvar estatísticas por edição
    for (const [editionId, stats] of Object.entries(editionStats)) {
      const editionRef = doc(dbFirestore, "edition_statistics", editionId)
      
      // Verificar e converter as datas
      console.log(`Salvando estatísticas para edição ${editionId}:`, {
        startAt: stats.startAt,
        endAt: stats.endAt,
        isLimitedTime: stats.isLimitedTime
      })

      const statsToSave = {
        ...stats,
        startAt: stats.startAt ? Timestamp.fromDate(new Date(stats.startAt)) : null,
        endAt: stats.endAt ? Timestamp.fromDate(new Date(stats.endAt)) : null,
        lastUpdated: Timestamp.fromDate(new Date())
      }

      console.log(`Dados convertidos para salvar:`, {
        startAt: statsToSave.startAt,
        endAt: statsToSave.endAt
      })

      batch.set(editionRef, statsToSave)
    }

    // Salvar estatísticas globais
    const globalStatsRef = doc(dbFirestore, "global_statistics", "global")
    const globalStatsToSave = {
      ...globalStats,
      lastUpdated: Timestamp.fromDate(new Date())
    }
    batch.set(globalStatsRef, globalStatsToSave)

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