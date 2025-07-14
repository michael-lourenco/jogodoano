"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Clock, Trophy } from "lucide-react"
import { motion } from "framer-motion"
import { votingEditions } from "@/repositories/votingEditions"
import { filterEditionsWithResults, getEditionStatusMessage, getCurrentEditionStatus } from "@/utils/editionUtils"

interface AvailableEditionsProps {
  onEditionSelect: (editionId: string) => void
  onBackToHome?: () => void
}

export function AvailableEditions({ onEditionSelect, onBackToHome }: AvailableEditionsProps) {
  const availableEditions = filterEditionsWithResults(votingEditions)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'ended':
        return 'bg-blue-500'
      case 'upcoming':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa'
      case 'ended':
        return 'Encerrada'
      case 'upcoming':
        return 'Em Breve'
      default:
        return 'Desconhecido'
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-none shadow-none relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-2/10 to-chart-5/10 animate-gradient" />
              <CardHeader className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-chart-2 to-chart-5 text-transparent bg-clip-text">
                      Resultados Disponíveis
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                      Escolha uma edição para visualizar os resultados
                    </CardDescription>
                  </div>
                  {onBackToHome && (
                    <Button onClick={onBackToHome} variant="outline" size="sm">
                      Voltar ao Início
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Lista de Edições */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {availableEditions.map((edition, index) => {
              const status = getCurrentEditionStatus(edition)
              const statusMessage = getEditionStatusMessage(edition)
              
              return (
                <motion.div
                  key={edition.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border border-muted/50 hover:border-primary/50 transition-all duration-200 hover:shadow-lg cursor-pointer group"
                        onClick={() => onEditionSelect(edition.id)}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Trophy className="w-8 h-8 text-yellow-500" />
                          <div>
                            <CardTitle className="text-xl">{edition.name}</CardTitle>
                            <CardDescription>{statusMessage}</CardDescription>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(status)} text-white`}>
                          {getStatusText(status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Informações da edição */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            <strong>Categorias:</strong> {edition.categories.length}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>
                            <strong>Tipo:</strong> {edition.isLimitedTime ? 'Limitada' : 'Permanente'}
                          </span>
                        </div>
                      </div>

                      {/* Datas se disponíveis */}
                      {(edition.startAt || edition.endAt) && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          {edition.startAt && (
                            <div>Início: {edition.startAt.toLocaleDateString('pt-BR')}</div>
                          )}
                          {edition.endAt && (
                            <div>Fim: {edition.endAt.toLocaleDateString('pt-BR')}</div>
                          )}
                        </div>
                      )}

                      {/* Botão de ação */}
                      <Button 
                        className="w-full group-hover:bg-primary/90 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditionSelect(edition.id)
                        }}
                      >
                        Ver Resultados
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Mensagem se não há edições disponíveis */}
          {availableEditions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhuma edição disponível</h3>
                  <p className="text-muted-foreground">
                    Não há edições com resultados disponíveis no momento.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
} 