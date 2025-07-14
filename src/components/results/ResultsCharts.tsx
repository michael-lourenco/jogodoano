"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { motion } from "framer-motion"
import type { EditionResults } from "@/types/results"

interface ResultsChartsProps {
  results: EditionResults
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

export function ResultsCharts({ results }: ResultsChartsProps) {
  const { theme } = useTheme()

  // Dados para gráfico de barras por categoria
  const categoryData = results.categories.map(cat => ({
    name: cat.category.name,
    votes: cat.totalVotes
  }))

  // Dados para gráfico de pizza dos top jogos
  const topGamesData = results.categories
    .flatMap(cat => cat.games.slice(0, 3))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10)
    .map(game => ({
      name: game.game.title,
      votes: game.votes
    }))

  // Dados para gráfico de linha (mock para demonstração)
  const timeData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      votes: Math.floor(Math.random() * 500) + 100
    }
  })

  return (
    <div className="space-y-6">
      {/* Gráfico de Votos por Categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
          <CardHeader>
            <CardTitle>Votos por Categoria</CardTitle>
            <CardDescription>
              Distribuição de votos entre as diferentes categorias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis
                    type="number"
                    stroke={theme === "dark" ? "#888888" : "#888888"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke={theme === "dark" ? "#888888" : "#888888"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip
                    cursor={{ fill: theme === "dark" ? "#1e293b" : "#f1f5f9" }}
                    contentStyle={{
                      background: theme === "dark" ? "#020817" : "#ffffff",
                      border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`,
                      borderRadius: "6px",
                    }}
                  />
                  <Bar 
                    dataKey="votes" 
                    fill={theme === "dark" ? "hsl(var(--primary))" : "hsl(var(--primary))"} 
                    radius={[0, 4, 4, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráfico de Pizza dos Top Jogos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
          <CardHeader>
            <CardTitle>Top 10 Jogos Mais Votados</CardTitle>
            <CardDescription>
              Os jogos que receberam mais votos em todas as categorias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topGamesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="votes"
                  >
                    {topGamesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: theme === "dark" ? "#020817" : "#ffffff",
                      border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`,
                      borderRadius: "6px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráfico de Linha - Votos ao Longo do Tempo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
          <CardHeader>
            <CardTitle>Votos ao Longo do Tempo</CardTitle>
            <CardDescription>
              Evolução da participação durante o período de votação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <XAxis
                    dataKey="date"
                    stroke={theme === "dark" ? "#888888" : "#888888"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={theme === "dark" ? "#888888" : "#888888"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme === "dark" ? "#020817" : "#ffffff",
                      border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`,
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="votes"
                    stroke={theme === "dark" ? "hsl(var(--primary))" : "hsl(var(--primary))"}
                    strokeWidth={2}
                    dot={{ fill: theme === "dark" ? "hsl(var(--primary))" : "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Estatísticas Adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {results.categories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categorias</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {results.categories.reduce((sum, cat) => sum + cat.games.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Jogos Votados</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {Math.round(results.totalVotes / results.categories.length)}
              </div>
              <div className="text-sm text-muted-foreground">Média por Categoria</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-5">
                {Math.round((results.uniqueVoters / 1000) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Participação</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 