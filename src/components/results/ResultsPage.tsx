"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { useResults } from "@/hooks/useResults"
import { ResultsSummary } from "@/components/results/ResultsSummary"
import { CategoryResults } from "@/components/results/CategoryResults"
import { ResultsCharts } from "@/components/results/ResultsCharts"
import { ResultsFilters } from "@/components/results/ResultsFilters"
import { ResultsLoadingState } from "@/components/results/ResultsLoadingState"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, RefreshCw, Trophy, BarChart3, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { votingEditions } from "@/repositories/votingEditions"

interface ResultsPageProps {
  onBackToHome?: () => void
}

export function ResultsPage({ onBackToHome }: ResultsPageProps) {
  const [editionId, setEditionId] = useState("2025")
  const [activeTab, setActiveTab] = useState("summary")

  // Carrega o editionId do searchParams no lado do cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const edition = params.get("edition") || "2025"
      setEditionId(edition)
    }
  }, [])

  const { 
    results, 
    isLoading, 
    error, 
    filters, 
    setFilters, 
    refreshResults,
    getBasicStats 
  } = useResults({
    editionId
  })

  const [basicStats, setBasicStats] = useState<{
    totalVotes: number
    uniqueVoters: number
    categories: number
    hasData: boolean
  } | undefined>(undefined)

  const edition = votingEditions.find(ed => ed.id === editionId)

  const handleBackToHome = () => {
    onBackToHome?.()
  }

  const handleRefresh = async () => {
    await refreshResults()
  }

  // Carrega estatísticas básicas quando a edição muda
  useEffect(() => {
    const loadBasicStats = async () => {
      try {
        const stats = await getBasicStats(editionId)
        setBasicStats(stats)
      } catch (error) {
        console.error("Erro ao carregar estatísticas básicas:", error)
      }
    }

    loadBasicStats()
  }, [editionId, getBasicStats])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow p-4">
          <div className="max-w-7xl mx-auto">
            <ResultsLoadingState 
              editionId={editionId}
              basicStats={basicStats}
              onRefresh={handleRefresh}
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleBackToHome} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Nenhum resultado encontrado</p>
              <Button onClick={handleBackToHome} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto space-y-6">
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
                      Resultados {results.editionName}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                      Confira os vencedores e estatísticas da votação
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Atualizar
                    </Button>
                    <Button onClick={handleBackToHome} variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ResultsFilters filters={filters} onFiltersChange={setFilters} />
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Resumo
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Categorias
                </TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Gráficos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-6">
                <ResultsSummary results={results} />
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <CategoryResults results={results} filters={filters} />
              </TabsContent>

              <TabsContent value="charts" className="space-y-6">
                <ResultsCharts results={results} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 