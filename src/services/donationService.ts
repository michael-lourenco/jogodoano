import { 
  dbFirestore, 
  fetchDonationMeta
} from '@/services/firebase/FirebaseService'
import type { DonationMeta } from '@/types/types'

export class DonationService {
  private static instance: DonationService

  private constructor() {}

  public static getInstance(): DonationService {
    if (!DonationService.instance) {
      DonationService.instance = new DonationService()
    }
    return DonationService.instance
  }

  public async getDonationMeta(): Promise<DonationMeta> {
    return fetchDonationMeta(dbFirestore)
  }
} 