"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, TrendingUp, Calendar, Award } from "lucide-react"
import { motion } from "framer-motion"
import type { EditionResults } from "@/types/results"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ResultsSummaryProps {
  results: EditionResults
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  const topCategory = results.categories.reduce((max, cat) => 
    cat.totalVotes > max.totalVotes ? cat : max
  )

  const participationRate = Math.round((results.uniqueVoters / 1000) * 100) // Estimativa

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Votos</p>
                  <p className="text-2xl font-bold">{results.totalVotes.toLocaleString()}</p>
                </div>
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Participantes</p>
                  <p className="text-2xl font-bold">{results.uniqueVoters.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Participação</p>
                  <p className="text-2xl font-bold">{participationRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                  <p className="text-sm font-bold">
                    {format(new Date(results.lastUpdated), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Categoria Mais Votada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Categoria Mais Votada
            </CardTitle>
            <CardDescription>
              A categoria que recebeu mais participação dos votantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{topCategory.category.name}</h3>
                  <p className="text-sm text-muted-foreground">{topCategory.category.description}</p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {topCategory.totalVotes} votos
                </Badge>
              </div>
              
              {topCategory.topGame && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{topCategory.topGame.game.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {topCategory.topGame.votes} votos ({topCategory.topGame.percentage.toFixed(1)}%)
                      </p>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">
                      #{topCategory.topGame.position}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progresso por Categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
          <CardHeader>
            <CardTitle>Progresso por Categoria</CardTitle>
            <CardDescription>
              Distribuição de votos entre as categorias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.categories.map((category, index) => {
                const percentage = (category.totalVotes / results.totalVotes) * 100
                return (
                  <div key={category.category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {category.totalVotes} votos ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                      style={{
                        '--progress-background': 'hsl(var(--primary))'
                      } as React.CSSProperties}
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 