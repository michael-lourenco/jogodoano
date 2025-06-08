import { NextResponse } from "next/server"
import { generateStatistics } from "@/services/statisticsService"

export async function GET() {
  try {
    const stats = await generateStatistics()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erro ao gerar estatísticas:", error)
    return NextResponse.json(
      { error: "Erro ao gerar estatísticas" },
      { status: 500 }
    )
  }
} 