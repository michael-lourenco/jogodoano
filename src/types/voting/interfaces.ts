import type React from "react"
import type { UserData } from "@/services/FirebaseService"
import type { VotingEdition, Category } from "@/types/types"

// Definindo o tipo para os votos por categoria
export type CategoryVotes = Record<string, string>

export interface VotingInterfaceProps {
  user: UserData | null
  editions: VotingEdition[]
  selectedEditionId: string
  activeCategory: string
  votes: Record<string, CategoryVotes>
  isSubmitting: boolean
  getCurrentEditionCategories: () => Category[]
  handleLogin: () => void
  handleLogout: () => void
  handleBackToHome: () => void
  handleEditionChange: (editionId: string) => void
  setActiveCategory: (categoryId: string) => void
  handleVoteInUI: (categoryId: string, gameId: string) => void
  handleSubmitVotesInUI: () => Promise<void>
}

export interface VotingInterfaceHookProps {
  activeCategory: string
  setActiveCategory: (categoryId: string) => void
  getCurrentEditionCategories: () => Category[]
  votes: Record<string, CategoryVotes>
  selectedEditionId: string
}

export interface SwipeNavigationProps {
  getCurrentEditionCategories: () => Category[]
  localActiveCategory: string
  setLocalActiveCategory: (category: string) => void
  setActiveCategory: (category: string) => void
  categoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  onCategoryChange?: (categoryId: string) => void
}

export interface StickyHeaderState {
  isSticky: boolean
  editionsSelectorRef: React.RefObject<HTMLDivElement>
  editionsSelectorHeight: React.MutableRefObject<number>
  categoryTabsRef: React.RefObject<HTMLDivElement>
  categoryTabsHeight: React.MutableRefObject<number>
}
