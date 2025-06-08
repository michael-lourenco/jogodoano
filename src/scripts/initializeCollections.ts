import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { votingEditions } from "@/repositories/votingEditions"
import * as dotenv from "dotenv"

// Carrega as variáveis de ambiente
dotenv.config()

// Verifica se as variáveis de ambiente necessárias estão presentes
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID não encontrado nas variáveis de ambiente")
}

if (!process.env.GOOGLE_CREDENTIALS_CLIENT_EMAIL) {
  throw new Error("GOOGLE_CREDENTIALS_CLIENT_EMAIL não encontrado nas variáveis de ambiente")
}

if (!process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY) {
  throw new Error("GOOGLE_CREDENTIALS_PRIVATE_KEY não encontrado nas variáveis de ambiente")
}

// Inicializa o Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.GOOGLE_CREDENTIALS_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY
  })
})

const db = getFirestore(app)

async function initializeCollections() {
  try {
    console.log("Iniciando criação das collections...")

    // 1. Criar collection voting_results
    console.log("Criando collection voting_results...")
    const votingResultsRef = db.collection("voting_results")
    
    // 2. Criar collection edition_statistics
    console.log("Criando collection edition_statistics...")
    const editionStatsRef = db.collection("edition_statistics")
    
    // Inicializar estatísticas para cada edição
    for (const edition of votingEditions) {
      const editionStats = {
        id: edition.id,
        name: edition.name,
        totalVotes: 0,
        totalVoters: 0,
        categories: {} as Record<string, { totalVotes: number; topGames: any[] }>,
        lastUpdated: Date.now()
      }

      // Inicializar categorias para cada edição
      for (const category of edition.categories) {
        editionStats.categories[category.id] = {
          totalVotes: 0,
          topGames: []
        }
      }

      await editionStatsRef.doc(edition.id).set(editionStats)
    }

    // 3. Criar collection global_statistics
    console.log("Criando collection global_statistics...")
    const globalStatsRef = db.collection("global_statistics")
    
    const globalStats = {
      id: "global",
      totalEditions: votingEditions.length,
      totalCategories: votingEditions.reduce((acc, edition) => acc + edition.categories.length, 0),
      totalVotes: 0,
      totalVoters: 0,
      editions: {} as Record<string, { totalVotes: number; totalVoters: number }>,
      lastUpdated: Date.now()
    }

    // Inicializar estatísticas por edição
    for (const edition of votingEditions) {
      globalStats.editions[edition.id] = {
        totalVotes: 0,
        totalVoters: 0
      }
    }

    await globalStatsRef.doc("global").set(globalStats)

    console.log("Collections criadas com sucesso!")
  } catch (error) {
    console.error("Erro ao criar collections:", error)
    throw error
  }
}

// Executar o script
initializeCollections()
  .then(() => {
    console.log("Script finalizado com sucesso!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Erro ao executar script:", error)
    process.exit(1)
  }) 