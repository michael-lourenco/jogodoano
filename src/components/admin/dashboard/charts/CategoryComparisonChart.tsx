"use client"

import { useTheme } from "next-themes"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryComparisonChartProps {
  data: Array<{
    name: string
    value: number
  }>
  isLoading: boolean
}

export function CategoryComparisonChart({ data, isLoading }: CategoryComparisonChartProps) {
  const { theme } = useTheme()

  const COLORS = ["#8b5cf6", "#ec4899", "#f97316", "#14b8a6", "#06b6d4", "#6366f1"]

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Skeleton className="h-[250px] w-[90%]" />
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
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
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
