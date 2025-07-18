import { useState, useEffect } from 'react'
import { DonationMeta } from '@/types/types'
import { DonationService } from '@/services/donationService'

export function useDonation() {
  const [donationMeta, setDonationMeta] = useState<DonationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const donationService = DonationService.getInstance()

  useEffect(() => {
    async function loadDonationMeta() {
      try {
        const meta = await donationService.getDonationMeta()
        setDonationMeta(meta)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar dados da doação'))
      } finally {
        setIsLoading(false)
      }
    }

    loadDonationMeta()
  }, [])

  return {
    donationMeta,
    isLoading,
    error
  }
} 