"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Clock, Calendar, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { VotingEdition } from "@/types/types"
import { getEditionStatusMessage, isEditionActive, isEditionUpcoming } from "@/utils/editionUtils"

interface EditionNotAvailableProps {
  edition: VotingEdition
  onBackToHome?: () => void
}

export function EditionNotAvailable({ edition, onBackToHome }: EditionNotAvailableProps) {
  const statusMessage = getEditionStatusMessage(edition)
  const isUpcoming = isEditionUpcoming(edition)
  const isActive = isEditionActive(edition)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                {isUpcoming ? (
                  <Clock className="w-16 h-16 text-info" />
                ) : isActive ? (
                  <Calendar className="w-16 h-16 text-success" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-warning" />
                )}
              </div>
              
              <CardTitle className="text-3xl font-bold">
                Resultados {edition.name}
              </CardTitle>
              
              <CardDescription className="text-lg">
                {statusMessage}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Alert variant={isUpcoming ? "default" : isActive ? "default" : "destructive"}>
                <AlertDescription className="text-center">
                  {isUpcoming && (
                    <>
                      <strong>Votação ainda não começou!</strong><br />
                      Os resultados estarão disponíveis após o início da votação.
                    </>
                  )}
                  {isActive && (
                    <>
                      <strong>Votação em andamento!</strong><br />
                      Os resultados serão revelados após o encerramento da votação.
                    </>
                  )}
                  {!isUpcoming && !isActive && (
                    <>
                      <strong>Resultados não disponíveis!</strong><br />
                      Esta edição não pode exibir resultados no momento.
                    </>
                  )}
                </AlertDescription>
              </Alert>

              {/* Informações adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {edition.startAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      <strong>Início:</strong> {edition.startAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                
                {edition.endAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      <strong>Fim:</strong> {edition.endAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={onBackToHome} variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Início
                </Button>
                
                {isActive && (
                  <Button 
                    onClick={() => window.location.href = `/voting?edition=${edition.id}`}
                    className="flex items-center gap-2"
                  >
                    Ir para Votação
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
} 