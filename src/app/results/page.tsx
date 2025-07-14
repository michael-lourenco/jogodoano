"use client"

import { Suspense, useState } from "react"
import { ResultsPage } from "@/components/results/ResultsPage"
import { AvailableEditions } from "@/components/results/AvailableEditions"
import { useRouter } from "next/navigation"

function ResultsContent() {
  const router = useRouter()
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null)

  const handleBackToHome = () => {
    router.push("/")
  }

  const handleEditionSelect = (editionId: string) => {
    setSelectedEdition(editionId)
    // Atualiza a URL sem recarregar a página
    const url = new URL(window.location.href)
    url.searchParams.set('edition', editionId)
    window.history.pushState({}, '', url.toString())
  }

  const handleBackToEditions = () => {
    setSelectedEdition(null)
    // Remove o parâmetro edition da URL
    const url = new URL(window.location.href)
    url.searchParams.delete('edition')
    window.history.pushState({}, '', url.toString())
  }

  // Se uma edição foi selecionada, mostra os resultados
  if (selectedEdition) {
    return (
      <ResultsPage 
        onBackToHome={handleBackToHome}
        onBackToEditions={handleBackToEditions}
        forcedEditionId={selectedEdition}
      />
    )
  }

  // Caso contrário, mostra a lista de edições disponíveis
  return <AvailableEditions onEditionSelect={handleEditionSelect} onBackToHome={handleBackToHome} />
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