import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocalVote {
  editionId: string
  votes: Record<string, string>
  lastUpdated: number
  userId?: string
}

interface LocalVotesState {
  votes: Record<string, LocalVote>
  setVote: (editionId: string, categoryId: string, gameId: string, userId?: string) => void
  getVotes: (editionId: string) => Record<string, string> | null
  clearVotes: (editionId: string) => void
  clearAllVotes: () => void
}

export const useLocalVotes = create<LocalVotesState>()(
  persist(
    (set, get) => ({
      votes: {},
      
      setVote: (editionId, categoryId, gameId, userId) => {
        set((state) => {
          const currentVotes = state.votes[editionId] || {
            editionId,
            votes: {},
            lastUpdated: Date.now(),
            userId
          }

          return {
            votes: {
              ...state.votes,
              [editionId]: {
                ...currentVotes,
                votes: {
                  ...currentVotes.votes,
                  [categoryId]: gameId
                },
                lastUpdated: Date.now(),
                userId
              }
            }
          }
        })
      },

      getVotes: (editionId) => {
        const editionVotes = get().votes[editionId]
        return editionVotes?.votes || null
      },

      clearVotes: (editionId) => {
        set((state) => {
          const { [editionId]: _, ...remainingVotes } = state.votes
          return { votes: remainingVotes }
        })
      },

      clearAllVotes: () => {
        set({ votes: {} })
      }
    }),
    {
      name: 'local-votes-storage',
      partialize: (state) => ({ votes: state.votes })
    }
  )
) 