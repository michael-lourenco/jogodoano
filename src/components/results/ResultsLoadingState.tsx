"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Database, Users, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultsLoadingStateProps {
  editionId: string
  basicStats?: {
    totalVotes: number
    uniqueVoters: number
    categories: number
    hasData: boolean
  } | null | undefined
  onRefresh?: () => void
}

export function ResultsLoadingState({ 
  editionId, 
  basicStats, 
  onRefresh 
}: ResultsLoadingStateProps) {
  return (
    <div className="space-y-6">
      {/* Header com informações básicas */}
      <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Resultados {editionId}</h2>
              <p className="text-muted-foreground">
                Carregando dados da votação...
              </p>
            </div>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas básicas se disponíveis */}
      {basicStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Votos</p>
                  <p className="text-2xl font-bold">{basicStats.totalVotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Votantes Únicos</p>
                  <p className="text-2xl font-bold">{basicStats.uniqueVoters}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Categorias</p>
                  <p className="text-2xl font-bold">{basicStats.categories}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alert se não há dados */}
      {basicStats && !basicStats.hasData && (
        <Alert>
          <AlertDescription>
            Nenhum voto encontrado para esta edição. Os resultados aparecerão aqui assim que os usuários começarem a votar.
          </AlertDescription>
        </Alert>
      )}

      {/* Skeletons para o conteúdo */}
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
} 