"use client"

import { useStatistics } from "@/hooks/useStatistics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function StatisticsPage() {
  const { statistics, isLoading, error } = useStatistics()

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error.message || "Erro ao carregar estatísticas"}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Estatísticas de Votação</h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Estatísticas Globais */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Globais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total de Edições</p>
                  <p className="text-2xl font-bold">{statistics?.globalStats.totalEditions}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total de Categorias</p>
                  <p className="text-2xl font-bold">{statistics?.globalStats.totalCategories}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total de Votos</p>
                  <p className="text-2xl font-bold">{statistics?.globalStats.totalVotes}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total de Votantes</p>
                  <p className="text-2xl font-bold">{statistics?.globalStats.totalVoters}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas por Edição */}
          {Object.entries(statistics?.editionStats || {}).map(([editionId, edition]) => (
            <Card key={editionId}>
              <CardHeader>
                <CardTitle>Edição {edition.name || editionId}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Resumo da Edição */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Total de Votos</p>
                      <p className="text-2xl font-bold">{edition.totalVotes}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Total de Votantes</p>
                      <p className="text-2xl font-bold">{edition.totalVoters}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Total de Categorias</p>
                      <p className="text-2xl font-bold">{Object.keys(edition.categories).length}</p>
                    </div>
                  </div>

                  {/* Estatísticas por Categoria */}
                  {Object.entries(edition.categories).map(([categoryId, category]) => (
                    <div key={categoryId} className="space-y-4">
                      <h3 className="text-xl font-semibold">Categoria {categoryId}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Top 3 Jogos */}
                        {category.topGames.slice(0, 3).map((game, index) => (
                          <div key={game.gameId} className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              {index + 1}º Lugar
                            </p>
                            <p className="text-lg font-semibold">Jogo {game.gameId}</p>
                            <p className="text-sm">
                              {game.votes} votos ({game.voters.length} votantes)
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Lista Completa de Jogos */}
                      <div className="mt-4">
                        <h4 className="text-lg font-medium mb-2">Todos os Jogos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(category.games).map(([gameId, gameStats]) => (
                            <div key={gameId} className="p-4 bg-muted rounded-lg">
                              <p className="text-lg font-semibold">Jogo {gameId}</p>
                              <p className="text-sm">
                                {gameStats.votes} votos ({gameStats.voters.length} votantes)
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 