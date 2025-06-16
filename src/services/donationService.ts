import { 
  dbFirestore, 
  getDonationMeta, 
  createDonationTransaction, 
  updateDonationStatus, 
  setWinnerGame,
  type DonationMeta,
  type DonationTransaction
} from "@/services/FirebaseService"

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
    return getDonationMeta(dbFirestore)
  }

  public async createDonation(amount: number, paymentMethod: 'pix' | 'picpay' | 'apoiase'): Promise<DonationTransaction> {
    const transaction: Omit<DonationTransaction, 'id'> = {
      userId: 'current-user-id', // TODO: Pegar do contexto de autenticação
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMethod
    }

    return createDonationTransaction(transaction, dbFirestore)
  }

  public async updateDonationStatus(transactionId: string, status: 'completed' | 'failed'): Promise<void> {
    await updateDonationStatus(transactionId, status, dbFirestore)
  }

  public async setWinnerGame(gameId: string): Promise<void> {
    await setWinnerGame(gameId, dbFirestore)
  }
} 