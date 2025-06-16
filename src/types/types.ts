// Existing types file - adding or extending types as needed

// Assuming the User type already exists, we'll extend it with role
export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: "user" | "admin"
}

// Voting edition type
export interface VotingEdition {
  id: string
  name: string
  categories: Category[]
  isLimitedTime: boolean
  startAt?: Date
  endAt?: Date
  status: 'upcoming' | 'active' | 'ended'
}

// Category type
export interface Category {
  id: string
  name: string
  description: string
  gameIds: string[]
  /** opcionalmente preenchido após reidratação */
  games?: Game[]
}

// Game type
export interface Game {
  id: string
  title: string
  imageUrl: string
  developer: string
}

// Vote type
export interface Vote {
  id: string
  userId: string
  editionId: string
  categoryId: string
  gameId: string
  timestamp: number
}

// Vote statistics type
export interface VoteStats {
  editionId: string
  categoryId: string
  gameId: string
  voteCount: number
}

// Donation types
export interface DonationMeta {
  edition: string
  totalRaised: number
  startDate: string
  endDate: string
  donationUrl: string
  isRevealed: boolean
  winnerGameId?: string
}

export interface DonationTransaction {
  id: string
  userId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
  paymentMethod: 'pix' | 'picpay' | 'apoiase'
  paymentId?: string
}
