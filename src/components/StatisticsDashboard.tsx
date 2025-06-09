"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Gamepad2, Award } from "lucide-react"
import type { EditionStats, GlobalStats } from "@/services/statisticsService"

function formatDate(date: Date | null) {
  if (!date) return "Não definida"
  // Se a data vier como string do Firestore, converter para Date
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

function getStatusColor(status: "upcoming" | "active" | "ended") {
  switch (status) {
    case "upcoming":
      return "bg-yellow-500"
    case "active":
      return "bg-green-500"
    case "ended":
      return "bg-gray-500"
    default:
      return "bg-gray-500"
  }
}

function getStatusText(status: "upcoming" | "active" | "ended") {
  switch (status) {
    case "upcoming":
      return "Em breve"
    case "active":
      return "Ativa"
    case "ended":
      return "Encerrada"
    default:
      return "Desconhecido"
  }
}

export function StatisticsDashboard() {
  const [editionStats, setEditionStats] = useState<EditionStats[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const response = await fetch("/api/statistics")
        if (!response.ok) {
          throw new Error("Erro ao carregar estatísticas")
        }
        const data = await response.json()
        setEditionStats(Object.values(data.editionStats))
        setGlobalStats(data.globalStats)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  if (isLoading) {
    return <div>Carregando estatísticas...</div>
  }

  if (error) {
    return <div>Erro: {error}</div>
  }

  return (
    <div className="space-y-8">
      {/* Estatísticas Globais */}
      {globalStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Edições</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.totalEditions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.totalCategories}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Votos</CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.totalVotes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Votantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.totalVoters}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Estatísticas por Edição */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Estatísticas por Edição</h2>
        {editionStats.map((edition) => (
          <Card key={edition.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{edition.name}</CardTitle>
                <Badge className={getStatusColor(edition.status)}>
                  {getStatusText(edition.status)}
                </Badge>
              </div>
              {edition.isLimitedTime && (
                <div className="text-sm text-muted-foreground">
                  Período: {formatDate(edition.startAt)} - {formatDate(edition.endAt)}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-sm font-medium">Total de Votos</div>
                  <div className="text-2xl font-bold">{edition.totalVotes}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Total de Votantes</div>
                  <div className="text-2xl font-bold">{edition.totalVoters}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Categorias</div>
                  <div className="text-2xl font-bold">
                    {Object.keys(edition.categories).length}
                  </div>
                </div>
              </div>

              {/* Top 3 Jogos por Categoria */}
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Top 3 Jogos por Categoria</h3>
                {Object.entries(edition.categories).map(([categoryId, category]) => (
                  <div key={categoryId} className="space-y-2">
                    <h4 className="font-medium">{categoryId}</h4>
                    <div className="grid gap-2">
                      {category.topGames.slice(0, 3).map((game) => (
                        <div
                          key={game.gameId}
                          className="flex items-center justify-between rounded-lg border p-2"
                        >
                          <span>{game.gameId}</span>
                          <span className="font-medium">{game.votes} votos</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 