import type { Game } from "@/types/types"

// Mock games data for development
const mockGames: Game[] = [
  {
    id: "the-talos-principle-reawakened",
    title: "The Talos Principle: Reawakened",
    imageUrl: "/placeholder.svg?height=80&width=80",
    developer: "Croteam",
  },
  {
    id: "despelote",
    title: "Despelote",
    imageUrl: "/placeholder.svg?height=80&width=80",
    developer: "Julián Cordero",
  },
  {
    id: "gosthofyotei",
    title: "Ghost of Yotei",
    imageUrl: "/placeholder.svg?height=80&width=80",
    developer: "Team Ninja",
  },
  {
    id: "likeadragonpirateyakuza",
    title: "Like a Dragon: Pirate Yakuza",
    imageUrl: "/placeholder.svg?height=80&width=80",
    developer: "Ryu Ga Gotoku Studio",
  },
  {
    id: "doomthedarkages",
    title: "DOOM: The Dark Ages",
    imageUrl: "/placeholder.svg?height=80&width=80",
    developer: "id Software",
  },
  {
    id: "borderlands4",
    title: "Borderlands 4",
    imageUrl: "/placeholder.svg?height=80&width=80",
    developer: "Gearbox Software",
  },
]

/**
 * Retrieves all games
 * @returns Promise<Game[]> Array of games
 */
export async function getAllGames(): Promise<Game[]> {
  // In a real application, this would fetch from an API or database
  // For now, we'll use the mock data
  return Promise.resolve(mockGames)
}

/**
 * Retrieves a specific game by ID
 * @param id Game ID
 * @returns Promise<Game | null> The game or null if not found
 */
export async function getGameById(id: string): Promise<Game | null> {
  // In a real application, this would fetch from an API or database
  const game = mockGames.find((game) => game.id === id) || null
  return Promise.resolve(game)
}

/**
 * Creates a new game
 * @param game Game data
 * @returns Promise<Game> The created game
 */
export async function createGame(game: Omit<Game, "id">): Promise<Game> {
  // In a real application, this would send a POST request to an API
  // For now, we'll just return a mock response
  const newGame: Game = {
    id: game.title.toLowerCase().replace(/\s+/g, "-"),
    ...game,
  }

  return Promise.resolve(newGame)
}

/**
 * Updates an existing game
 * @param id Game ID
 * @param game Updated game data
 * @returns Promise<Game> The updated game
 */
export async function updateGame(id: string, game: Partial<Game>): Promise<Game> {
  // In a real application, this would send a PUT/PATCH request to an API
  // For now, we'll just return a mock response
  const existingGame = await getGameById(id)

  if (!existingGame) {
    throw new Error(`Game with ID ${id} not found`)
  }

  const updatedGame: Game = {
    ...existingGame,
    ...game,
    id, // Ensure ID doesn't change
  }

  return Promise.resolve(updatedGame)
}

/**
 * Deletes a game
 * @param id Game ID
 * @returns Promise<void>
 */
export async function deleteGame(id: string): Promise<void> {
  // In a real application, this would send a DELETE request to an API
  // For now, we'll just return a mock response
  return Promise.resolve()
}
