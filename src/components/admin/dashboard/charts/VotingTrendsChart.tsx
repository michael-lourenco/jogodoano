"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface VotingTrendsChartProps {
  data: Array<{
    date: string
    [key: string]: string | number
  }>
  isLoading: boolean
}

export function VotingTrendsChart({ data, isLoading }: VotingTrendsChartProps) {
  const { theme } = useTheme()

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Skeleton className="h-[250px] w-[90%]" />
      </div>
    )
  }

  // Get all keys except 'date' to use as lines
  const dataKeys = Object.keys(data[0] || {}).filter((key) => key !== "date")

  const COLORS = ["#8b5cf6", "#ec4899", "#f97316", "#14b8a6", "#06b6d4", "#6366f1"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
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
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            background: theme === "dark" ? "#020817" : "#ffffff",
            border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`,
            borderRadius: "6px",
          }}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
