import type { VotingEdition } from "@/types/types"

/**
 * Verifica se uma edição pode mostrar resultados
 * Regras:
 * 1. Edições sem limite de tempo (isLimitedTime: false) sempre podem mostrar
 * 2. Edições com limite de tempo só podem mostrar se já terminaram (endAt < hoje)
 */
export function canShowResults(edition: VotingEdition): boolean {
  // Se não tem limite de tempo, sempre pode mostrar
  if (!edition.isLimitedTime) {
    return true
  }

  // Se tem limite de tempo, verifica se já terminou
  if (edition.endAt) {
    const now = new Date()
    return edition.endAt < now
  }

  // Se tem limite de tempo mas não tem data de fim, não pode mostrar
  return false
}

/**
 * Verifica se uma edição está ativa (período de votação)
 */
export function isEditionActive(edition: VotingEdition): boolean {
  if (!edition.isLimitedTime) {
    return edition.status === 'active'
  }

  if (!edition.startAt || !edition.endAt) {
    return false
  }

  const now = new Date()
  return edition.startAt <= now && now <= edition.endAt
}

/**
 * Verifica se uma edição já terminou
 */
export function isEditionEnded(edition: VotingEdition): boolean {
  if (!edition.isLimitedTime) {
    return edition.status === 'ended'
  }

  if (!edition.endAt) {
    return false
  }

  const now = new Date()
  return edition.endAt < now
}

/**
 * Verifica se uma edição ainda não começou
 */
export function isEditionUpcoming(edition: VotingEdition): boolean {
  if (!edition.isLimitedTime) {
    return edition.status === 'upcoming'
  }

  if (!edition.startAt) {
    return false
  }

  const now = new Date()
  return edition.startAt > now
}

/**
 * Retorna o status atual de uma edição baseado na data atual
 */
export function getCurrentEditionStatus(edition: VotingEdition): 'upcoming' | 'active' | 'ended' {
  if (isEditionUpcoming(edition)) {
    return 'upcoming'
  }
  
  if (isEditionActive(edition)) {
    return 'active'
  }
  
  return 'ended'
}

/**
 * Retorna uma mensagem descritiva sobre o status da edição
 */
export function getEditionStatusMessage(edition: VotingEdition): string {
  if (!edition.isLimitedTime) {
    return "Edição permanente - sempre disponível"
  }

  if (isEditionUpcoming(edition)) {
    const startDate = edition.startAt?.toLocaleDateString('pt-BR')
    return `Votação começará em ${startDate}`
  }

  if (isEditionActive(edition)) {
    const endDate = edition.endAt?.toLocaleDateString('pt-BR')
    return `Votação ativa até ${endDate}`
  }

  if (isEditionEnded(edition)) {
    const endDate = edition.endAt?.toLocaleDateString('pt-BR')
    return `Votação encerrada em ${endDate}`
  }

  return "Status desconhecido"
}

/**
 * Filtra edições que podem mostrar resultados
 */
export function filterEditionsWithResults(editions: VotingEdition[]): VotingEdition[] {
  return editions.filter(canShowResults)
}

/**
 * Filtra edições que estão ativas para votação
 */
export function filterActiveEditions(editions: VotingEdition[]): VotingEdition[] {
  return editions.filter(isEditionActive)
} 