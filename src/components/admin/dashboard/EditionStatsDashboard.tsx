"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VotesOverviewChart } from "./charts/VotesOverviewChart"
import { CategoryComparisonChart } from "./charts/CategoryComparisonChart"
import { TopGamesChart } from "./charts/TopGamesChart"
import { VotingTrendsChart } from "./charts/VotingTrendsChart"
import type { EditionStatsType } from "@/types/admin/stats"
import { getEditionStats } from "@/services/admin/statsService"

interface EditionStatsDashboardProps {
  initialStats: EditionStatsType
  initialEditionId: string
}

export function EditionStatsDashboard({ initialStats, initialEditionId }: EditionStatsDashboardProps) {
  const searchParams = useSearchParams()
  const [stats, setStats] = useState<EditionStatsType>(initialStats)
  const [isLoading, setIsLoading] = useState(false)

  const editionId = searchParams.get("edition") || initialEditionId

  useEffect(() => {
    const fetchStats = async () => {
      if (editionId) {
        setIsLoading(true)
        try {
          const newStats = await getEditionStats(editionId)
          setStats(newStats)
        } catch (error) {
          console.error("Failed to fetch stats:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (editionId !== initialEditionId) {
      fetchStats()
    }
  }, [editionId, initialEditionId])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Votos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.votesChange > 0 ? "+" : ""}
              {stats.votesChange}% em relação à última semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVoters}</div>
            <p className="text-xs text-muted-foreground">
              {stats.votersChange > 0 ? "+" : ""}
              {stats.votersChange}% em relação à última semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias Mais Votadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topCategory}</div>
            <p className="text-xs text-muted-foreground">{stats.topCategoryVotes} votos totais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jogo Mais Votado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{stats.topGame}</div>
            <p className="text-xs text-muted-foreground">{stats.topGameVotes} votos totais</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="games">Jogos</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral de Votos</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <VotesOverviewChart data={stats.votesOverTime} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Categorias</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <CategoryComparisonChart data={stats.categoryVotes} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Jogos</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <TopGamesChart data={stats.topGames} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Votação</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <VotingTrendsChart data={stats.votingTrends} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
