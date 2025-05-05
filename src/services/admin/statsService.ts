import type { EditionStatsType } from "@/types/admin/stats"
import { getEditionById } from "./editionsService"
import type { VotingEdition } from "@/types/types"

/**
 * Generates mock statistics data for a voting edition
 * @param edition The voting edition
 * @returns Mock statistics data
 */
function generateMockStats(edition: VotingEdition): EditionStatsType {
  // Generate random data for demonstration purposes
  const totalVotes = Math.floor(Math.random() * 5000) + 1000
  const uniqueVoters = Math.floor(totalVotes * 0.7)
  const votesChange = Math.floor(Math.random() * 30) - 10
  const votersChange = Math.floor(Math.random() * 25) - 5

  // Get a random category as the top category
  const randomCategoryIndex = Math.floor(Math.random() * edition.categories.length)
  const topCategory = edition.categories[randomCategoryIndex].name
  const topCategoryVotes = Math.floor(Math.random() * 1000) + 500

  // Get a random game ID from the top category
  const randomGameIndex = Math.floor(Math.random() * edition.categories[randomCategoryIndex].gameIds.length)
  const topGameId = edition.categories[randomCategoryIndex].gameIds[randomGameIndex]
  // Format the game ID to display as a title (since we don't have the actual game objects)
  const topGame = topGameId.split("-").join(" ").toUpperCase()
  const topGameVotes = Math.floor(Math.random() * 800) + 300

  // Generate votes over time (last 7 days)
  const votesOverTime = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      votes: Math.floor(Math.random() * 500) + 100,
    }
  })

  // Generate category votes
  const categoryVotes = edition.categories.map((category) => ({
    name: category.name,
    value: Math.floor(Math.random() * 1000) + 200,
  }))

  // Generate top games
  const topGames = Array.from({ length: 10 })
    .map((_, i) => {
      // Get a random game ID from a random category
      const randomCatIndex = Math.floor(Math.random() * edition.categories.length)
      const randomGameIndex = Math.floor(Math.random() * edition.categories[randomCatIndex].gameIds.length)
      const gameId = edition.categories[randomCatIndex].gameIds[randomGameIndex]

      return {
        name: gameId.split("-").join(" ").toUpperCase(),
        votes: Math.floor(Math.random() * 500) + 100,
      }
    })
    .sort((a, b) => b.votes - a.votes)

  // Generate voting trends (votes per category over time)
  const votingTrends = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))

    const trendData: { date: string; [key: string]: string | number } = {
      date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    }

    // Add data for each category
    edition.categories.forEach((category) => {
      trendData[category.name] = Math.floor(Math.random() * 200) + 50
    })

    return trendData
  })

  return {
    totalVotes,
    uniqueVoters,
    votesChange,
    votersChange,
    topCategory,
    topCategoryVotes,
    topGame,
    topGameVotes,
    votesOverTime,
    categoryVotes,
    topGames,
    votingTrends,
  }
}

/**
 * Retrieves statistics for a specific voting edition
 * @param editionId Edition ID
 * @returns Promise<EditionStatsType> The edition statistics
 */
export async function getEditionStats(editionId: string): Promise<EditionStatsType> {
  // In a real application, this would fetch from an API or database
  // For now, we'll generate mock data
  const edition = await getEditionById(editionId)

  if (!edition) {
    throw new Error(`Edition with ID ${editionId} not found`)
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return generateMockStats(edition)
}
