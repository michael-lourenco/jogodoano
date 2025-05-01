"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function VotingEditionRedirect({ params }: { params: { votingEdition: string } }) {
  const router = useRouter()
  const { votingEdition } = params

  useEffect(() => {
    router.push(`/voting?votingEdition=${votingEdition}`)
  }, [votingEdition, router])

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="animate-pulse text-primary">Redirecionando...</div>
    </div>
  )
}
