"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award } from "lucide-react"
import { motion } from "framer-motion"
import type { EditionResults, ResultsFilters } from "@/types/results"

interface CategoryResultsProps {
  results: EditionResults
  filters: ResultsFilters
}

export function CategoryResults({ results, filters }: CategoryResultsProps) {
  // Aplica filtros
  const filteredCategories = filters.categoryId 
    ? results.categories.filter(cat => cat.category.id === filters.categoryId)
    : results.categories

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{position}</span>
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700 text-white"
      default:
        return "bg-muted text-foreground"
    }
  }

  // Se não há categorias após filtrar, mostra mensagem
  if (filteredCategories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Nenhuma categoria encontrada com os filtros aplicados</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={filteredCategories[0]?.category.id} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredCategories.map((category) => (
            <TabsTrigger key={category.category.id} value={category.category.id}>
              {category.category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredCategories.map((category, categoryIndex) => (
          <TabsContent key={category.category.id} value={category.category.id} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.category.name}
                    <Badge variant="secondary">
                      {category.totalVotes} votos
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {category.category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.games.map((game, gameIndex) => (
                      <motion.div
                        key={game.game.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: gameIndex * 0.05 }}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          game.position <= 3 ? 'bg-gradient-to-r from-muted/50 to-muted/30' : 'bg-muted/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getPositionColor(game.position)}`}>
                            {getPositionIcon(game.position)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{game.game.title}</h3>
                              {game.position <= 3 && (
                                <Badge className={getPositionColor(game.position)}>
                                  {game.position === 1 ? '1º Lugar' : game.position === 2 ? '2º Lugar' : '3º Lugar'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {game.game.developer}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-chart-2">
                              {game.votes} votos
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {game.percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        
                        {/* Barra de progresso */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progresso</span>
                            <span>{game.percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                game.position === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                game.position === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                                game.position === 3 ? 'bg-gradient-to-r from-amber-500 to-amber-700' :
                                'bg-gradient-to-r from-chart-2 to-chart-5'
                              }`}
                              style={{ width: `${game.percentage}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 