"use client"

import { Suspense } from "react"
import { ResultsPage } from "@/components/results/ResultsPage"
import { useRouter } from "next/navigation"

function ResultsContent() {
  const router = useRouter()

  const handleBackToHome = () => {
    router.push("/")
  }

  return <ResultsPage onBackToHome={handleBackToHome} />
}

export default function Results() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando resultados...</p>
          </div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
} 