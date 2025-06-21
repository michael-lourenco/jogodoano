import { motion, AnimatePresence } from 'framer-motion'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const handleRedirectToApoiase = () => {
    window.open('https://apoia.se/appjogodoano', '_blank')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">Contribuir com o Jogo do Ano BR 2025</h2>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Você será redirecionado para a página de doação no Apoia.se, onde poderá escolher o valor e método de pagamento de sua preferência.
                </p>
                
                <div className="bg-muted/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Como funciona:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Escolha o valor que deseja doar</li>
                    <li>• Selecione seu método de pagamento</li>
                    <li>• 50% do valor será destinado ao jogo vencedor</li>
                    <li>• Processo seguro via Apoia.se</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 p-3 border border-border rounded-lg hover:bg-muted/20 bg-background text-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRedirectToApoiase}
                  className="flex-1 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-bold shadow"
                >
                  Ir para Apoia.se
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 