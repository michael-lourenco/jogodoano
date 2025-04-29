"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function YearRedirect({ params }: { params: { year: string } }) {
  const router = useRouter()
  const { year } = params

  useEffect(() => {
    // Redireciona para a página principal de votação com o ano selecionado
    router.push(`/voting?year=${year}`)
  }, [year, router])

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="animate-pulse text-primary">Redirecionando...</div>
    </div>
  )
}
