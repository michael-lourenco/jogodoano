import { useMemo } from 'react'
import { VotingEdition } from '@/types/types'

export function useVotingPeriod(edition: VotingEdition) {
  const votingStatus = useMemo(() => {
    if (!edition.isLimitedTime) {
      return {
        canVote: true,
        status: 'active' as const,
        message: 'Votação aberta'
      }
    }

    const now = new Date()
    const startDate = edition.startAt ? new Date(edition.startAt) : null
    const endDate = edition.endAt ? new Date(edition.endAt) : null

    if (startDate && now < startDate) {
      return {
        canVote: false,
        status: 'upcoming' as const,
        message: `Votação inicia em ${startDate.toLocaleDateString()}`
      }
    }

    if (endDate && now > endDate) {
      return {
        canVote: false,
        status: 'ended' as const,
        message: `Votação encerrada em ${endDate.toLocaleDateString()}`
      }
    }

    return {
      canVote: true,
      status: 'active' as const,
      message: endDate 
        ? `Votação encerra em ${endDate.toLocaleDateString()}`
        : 'Votação aberta'
    }
  }, [edition])

  return votingStatus
} 