"use client"

import { useStatistics } from "@/hooks/useStatistics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StatisticsDashboard() {
  const { statistics, loading, error } = useStatistics()

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
        {error}
      </div>
    )
  }

  if (!statistics) {
    return null
  }

  const { globalStats, editionStats } = statistics

  return (
    <div className="space-y-8">
      {/* Estatísticas Globais */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Estatísticas Globais</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total de Edições</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{globalStats.totalEditions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total de Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{globalStats.totalCategories}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total de Votos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{globalStats.totalVotes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total de Votantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{globalStats.totalVoters}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Estatísticas por Edição */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Estatísticas por Edição</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(editionStats).map(([editionId, stats]) => (
            <Card key={editionId}>
              <CardHeader>
                <CardTitle>{stats.name || `Edição ${editionId}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Votos</p>
                    <p className="text-2xl font-bold">{stats.totalVotes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Votantes</p>
                    <p className="text-2xl font-bold">{stats.totalVoters}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categorias</p>
                    <p className="text-2xl font-bold">
                      {Object.keys(stats.categories).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
} 