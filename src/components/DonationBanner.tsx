import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DonationMeta } from '@/types/types'

interface DonationBannerProps {
  donationMeta: DonationMeta
  onDonate: () => void
}

export function DonationBanner({ donationMeta, onDonate }: DonationBannerProps) {
  const timeLeft = formatDistanceToNow(new Date(donationMeta.endDate), {
    locale: ptBR,
    addSuffix: true,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-primary/90 to-primary rounded-lg p-6 text-primary-foreground shadow-lg"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Apoie o Jogo do Ano BR 2025!</h2>
          <span className="text-sm bg-primary-foreground/10 px-3 py-1 rounded-full">
            {timeLeft}
          </span>
        </div>

        <p className="text-primary-foreground/80">
          50% do valor arrecadado será destinado ao jogo vencedor da categoria BR
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">Arrecadado até agora:</span>
          <span className="text-lg font-bold">R$ {donationMeta.totalRaised.toLocaleString('pt-BR')}</span>
        </div>

        <div className="text-xs text-primary-foreground/70">
          Doações processadas via Apoia.se
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDonate}
          className="w-full bg-primary-foreground text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary-foreground/90 transition-colors"
        >
          Contribuir via Apoia.se
        </motion.button>
      </div>
    </motion.div>
  )
} 