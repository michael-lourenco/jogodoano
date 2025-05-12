import { MutableRefObject } from "react"
import { Category, Game, VotingEdition } from "../types"

export interface GameVotingProps {
  editions: VotingEdition[]
  selectedEditionId: string
  votes: Record<string, Record<string, string>> // editionId -> categoryId -> gameId
  user: any
  isSubmitting: boolean
  onVote: (categoryId: string, gameId: string) => void
  onSubmit: () => void
  onCategoryChange: (categoryId: string) => void
}

export interface CategorySwipeProps {
  categories: Category[]
  currentCategoryId: string
  votes: Record<string, string> // categoryId -> gameId
  onVote: (categoryId: string, gameId: string) => void
  onNextCategory: () => void
  onPrevCategory: () => void
  categoryRefs: MutableRefObject<Record<string, HTMLDivElement | null>>
}

export interface GameCardProps {
  game: Game
  isSelected: boolean
  onSelect: () => void
}

export interface CategoryNavigationProps {
  currentIndex: number
  totalCategories: number
  onNext: () => void
  onPrev: () => void
  isNextDisabled: boolean
}

export interface SwipeNavigationProps {
  categoryRefs: MutableRefObject<Record<string, HTMLDivElement | null>>
  currentCategoryId: string
  setCurrentCategoryId: (categoryId: string) => void
  categories: Category[]
} 