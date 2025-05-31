"use client"
import { useState } from 'react'
import { useLocalVotes } from '@/stores/useLocalVotes'
import { useToast } from '@/hooks/use-toast'
import { VotingEdition } from '@/types/types'

interface UseVotingManagerProps {
  selectedEditionId: string
  editions: VotingEdition[]
  votes: Record<string, Record<string, string>>
  handleVoteInUI: (categoryId: string, gameId: string) => void
  handleSubmitVotesInUI: () => void
  userEmail?: string | null
}

export function useVotingManager({
  selectedEditionId,
  editions,
  votes,
  handleVoteInUI,
  handleSubmitVotesInUI,
  userEmail
}: UseVotingManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const { setVote, getVotes, clearVotes } = useLocalVotes()
  const { toast } = useToast()

  const currentEdition = editions.find(edition => edition.id === selectedEditionId)

  const canVote = () => {
    if (!currentEdition) return false
    if (!currentEdition.isLimitedTime) return true

    const now = new Date()
    const startDate = currentEdition.startAt ? new Date(currentEdition.startAt) : null
    const endDate = currentEdition.endAt ? new Date(currentEdition.endAt) : null

    if (!startDate || !endDate) return false
    return now >= startDate && now <= endDate
  }

  const getVotingStatus = () => {
    if (!currentEdition) return { status: 'unknown', message: 'Edição não encontrada' }
    if (!currentEdition.isLimitedTime) return { status: 'active', message: 'Votação sempre disponível' }

    const now = new Date()
    const startDate = currentEdition.startAt ? new Date(currentEdition.startAt) : null
    const endDate = currentEdition.endAt ? new Date(currentEdition.endAt) : null

    if (!startDate || !endDate) {
      return { status: 'unknown', message: 'Período de votação não definido' }
    }

    if (now < startDate) {
      return {
        status: 'upcoming',
        message: `Votação iniciará em ${startDate.toLocaleDateString()}`
      }
    }

    if (now > endDate) {
      return {
        status: 'ended',
        message: `Votação encerrada em ${endDate.toLocaleDateString()}`
      }
    }

    return {
      status: 'active',
      message: `Votação disponível até ${endDate.toLocaleDateString()}`
    }
  }

  const handleGameSelection = (categoryId: string, gameId: string) => {
    if (!canVote()) {
      toast({
        title: "Votação indisponível",
        description: getVotingStatus().message,
        variant: "destructive"
      })
      return
    }

    if (!userEmail) {
      toast({
        title: "Usuário não autenticado",
        description: "Por favor, faça login para votar",
        variant: "destructive"
      })
      return
    }

    setSelectedGame(gameId)
    handleVoteInUI(categoryId, gameId)
  }

  const handleSubmitVotes = async () => {
    if (!canVote()) {
      toast({
        title: "Votação indisponível",
        description: getVotingStatus().message,
        variant: "destructive"
      })
      return
    }

    if (!userEmail) {
      toast({
        title: "Usuário não autenticado",
        description: "Por favor, faça login para enviar seus votos",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await handleSubmitVotesInUI()
      toast({
        title: "Votos enviados com sucesso!",
        description: "Obrigado por participar da votação",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Erro ao enviar votos",
        description: "Por favor, tente novamente",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadLocalVotes = () => {
    const localVotes = localStorage.getItem(`votes_${selectedEditionId}`)
    if (localVotes) {
      try {
        const parsedVotes = JSON.parse(localVotes)
        Object.entries(parsedVotes).forEach(([categoryId, gameId]) => {
          handleVoteInUI(categoryId, gameId as string)
        })
      } catch (error) {
        console.error('Erro ao carregar votos locais:', error)
      }
    }
  }

  const isAllCategoriesVoted = (categories: { id: string }[]) => {
    return categories.every(category => votes[selectedEditionId]?.[category.id])
  }

  const { status: votingStatus, message: votingMessage } = getVotingStatus()

  return {
    isSubmitting,
    selectedGame,
    handleGameSelection,
    handleSubmitVotes,
    loadLocalVotes,
    isAllCategoriesVoted,
    canVote: canVote(),
    votingStatus,
    votingMessage
  }
} 