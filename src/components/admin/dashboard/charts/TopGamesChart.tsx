"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface TopGamesChartProps {
  data: Array<{
    name: string
    votes: number
  }>
  isLoading: boolean
}

export function TopGamesChart({ data, isLoading }: TopGamesChartProps) {
  const { theme } = useTheme()

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Skeleton className="h-[250px] w-[90%]" />
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
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
        <Bar dataKey="votes" fill={theme === "dark" ? "#14b8a6" : "#0d9488"} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
