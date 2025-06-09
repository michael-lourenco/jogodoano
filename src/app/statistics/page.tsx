"use client"

import { StatisticsDashboard } from "@/components/StatisticsDashboard"

export default function StatisticsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Estatísticas de Votação</h1>
      <StatisticsDashboard />
    </div>
  )
} 