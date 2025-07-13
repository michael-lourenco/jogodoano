"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ResultsFilters } from "@/types/results"

interface ResultsFiltersProps {
  filters: ResultsFilters
  onFiltersChange: (filters: ResultsFilters) => void
}

export function ResultsFilters({ filters, onFiltersChange }: ResultsFiltersProps) {
  const handleFilterChange = (key: keyof ResultsFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'votes',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = filters.categoryId || filters.minVotes || filters.sortBy !== 'votes' || filters.sortOrder !== 'desc'

  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-muted/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          {/* Filtro por Categoria */}
          <div className="flex items-center gap-2">
            <Label htmlFor="category-filter" className="text-sm">Categoria:</Label>
            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) => handleFilterChange('categoryId', value === "all" ? undefined : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="goty">Jogo do Ano</SelectItem>
                <SelectItem value="rpg">RPG</SelectItem>
                <SelectItem value="action">Ação/Aventura</SelectItem>
                <SelectItem value="indie">Indie</SelectItem>
                <SelectItem value="multiplayer">Multiplayer</SelectItem>
                <SelectItem value="fighting">Luta</SelectItem>
                <SelectItem value="sportsracing">Esportes/Corridas</SelectItem>
                <SelectItem value="simstrategy">Simulador/Estratégia</SelectItem>
                <SelectItem value="gotybr">Jogo do Ano BR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Mínimo de Votos */}
          <div className="flex items-center gap-2">
            <Label htmlFor="min-votes" className="text-sm">Mín. votos:</Label>
            <Input
              id="min-votes"
              type="number"
              placeholder="0"
              value={filters.minVotes || ""}
              onChange={(e) => handleFilterChange('minVotes', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-20"
            />
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-by" className="text-sm">Ordenar por:</Label>
            <Select
              value={filters.sortBy || "votes"}
              onValueChange={(value) => handleFilterChange('sortBy', value as 'votes' | 'percentage' | 'position')}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="votes">Votos</SelectItem>
                <SelectItem value="percentage">Porcentagem</SelectItem>
                <SelectItem value="position">Posição</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ordem */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-order" className="text-sm">Ordem:</Label>
            <Select
              value={filters.sortOrder || "desc"}
              onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Decrescente</SelectItem>
                <SelectItem value="asc">Crescente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão Limpar Filtros */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 