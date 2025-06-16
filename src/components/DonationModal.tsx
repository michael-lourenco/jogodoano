import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDonation } from '@/hooks/useDonation'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_AMOUNTS = [5, 10, 20, 50, 100]

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<number>(PRESET_AMOUNTS[0])
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'picpay' | 'apoiase'>('pix')
  const { createDonation } = useDonation()

  const handleAmountSelect = (value: number) => {
    setAmount(value)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setCustomAmount(value)
    if (value) {
      setAmount(Number(value))
    }
  }

  const handleSubmit = async () => {
    try {
      await createDonation(amount, paymentMethod)
      onClose()
    } catch (error) {
      console.error('Erro ao criar doação:', error)
    }
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
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Selecione o valor
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map(value => (
                    <button
                      key={value}
                      onClick={() => handleAmountSelect(value)}
                      className={`p-2 rounded-lg border text-base font-semibold transition-colors
                        ${amount === value && !customAmount
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:border-primary/40 text-foreground'}
                      `}
                    >
                      R$ {value}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Outro valor"
                    className="w-full p-2 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Método de pagamento
                </label>
                <div className="space-y-2">
                  {['pix', 'picpay', 'apoiase'].map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method as 'pix' | 'picpay' | 'apoiase')}
                      className={`w-full p-3 rounded-lg border text-base font-semibold transition-colors
                        ${paymentMethod === method
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:border-primary/40 text-foreground'}
                      `}
                    >
                      {method.toUpperCase()}
                    </button>
                  ))}
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
                  onClick={handleSubmit}
                  className="flex-1 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-bold shadow"
                >
                  Contribuir R$ {amount}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 