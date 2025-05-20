"use client"
import { useCallback, useState } from 'react'
import { useLocalVotes } from '@/stores/useLocalVotes'

interface UseVotingManagerProps {
  selectedEditionId: string
  votes: Record<string, Record<string, string>>
  handleVoteInUI: (categoryId: string, gameId: string) => void
  handleSubmitVotesInUI: () => Promise<void>
  userEmail?: string
}

export function useVotingManager({
  selectedEditionId,
  votes,
  handleVoteInUI,
  handleSubmitVotesInUI,
  userEmail
}: UseVotingManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const { setVote, getVotes, clearVotes } = useLocalVotes()

  const handleGameSelection = useCallback((categoryId: string, gameId: string) => {
    // Verificar se o voto já está definido para este jogo
    const currentVote = votes[selectedEditionId]?.[categoryId]
    
    // Só atualizar se o voto for diferente
    if (currentVote !== gameId) {
      // Registra o voto no sistema
      handleVoteInUI(categoryId, gameId)
      
      // Salvar voto localmente
      setVote(selectedEditionId, categoryId, gameId, userEmail)
      
      // Atualizar o estado local
      setSelectedGame(gameId)
    }
  }, [votes, selectedEditionId, handleVoteInUI, setVote, userEmail])

  const handleSubmitVotes = useCallback(async () => {
    try {
      setIsSubmitting(true)
      await handleSubmitVotesInUI()
      // Limpar votos locais após envio bem-sucedido
      clearVotes(selectedEditionId)
    } catch (error) {
      console.error('Erro ao enviar votos:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [handleSubmitVotesInUI, clearVotes, selectedEditionId])

  const loadLocalVotes = useCallback(() => {
    if (selectedEditionId) {
      const localVotes = getVotes(selectedEditionId)
      if (localVotes) {
        // Atualizar o estado local com os votos salvos
        Object.entries(localVotes).forEach(([categoryId, gameId]) => {
          handleVoteInUI(categoryId, gameId as string)
        })
      }
    }
  }, [selectedEditionId, getVotes, handleVoteInUI])

  const isAllCategoriesVoted = useCallback((categories: Array<{ id: string }>) => {
    return categories.every(category => !!votes[selectedEditionId]?.[category.id])
  }, [votes, selectedEditionId])

  return {
    isSubmitting,
    selectedGame,
    handleGameSelection,
    handleSubmitVotes,
    loadLocalVotes,
    isAllCategoriesVoted
  }
} 