"use client"
import { useState, useEffect, Suspense } from "react"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/hooks/useAuth"
import { useVotes } from "@/hooks/useVotes"
import { useEditionManager } from "@/hooks/useEditionManager"
import { votingEditions } from "@/repositories/votingEditions"
import type { VotingEdition } from "@/types/types"
import { rehydrateVotingEditions } from "@/utils/utils"
import { VotingCompletePage } from "@/components/voting/VotingCompletePage"
import { VotingInterface } from "@/components/voting/VotingInterface"
import { LoginModal } from "@/components/voting/LoginModal"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"

function VotingContent() {
  const navigationService = useNavigation()
  const { user, loading, handleLogin, handleLogout } = useAuth()

  const [editions, setEditions] = useState<VotingEdition[]>([])

  const { selectedEditionId, activeCategory, setActiveCategory, handleEditionChange, getCurrentEditionCategories } =
    useEditionManager({ editions })

  const {
    votes,
    hasVoted,
    votedEditionId,
    isSubmitting,
    handleVote,
    handleSubmitVotes,
    setHasVoted,
    setVotedEditionId,
  } = useVotes({ user, editions })

  // Carregar edições
  useEffect(() => {
    const hydratedEditions = rehydrateVotingEditions(votingEditions)
    setEditions(hydratedEditions)
  }, [])

  const handleBackToHome = () => {
    navigationService.navigateTo("/")
  }

  const handleVoteInUI = (categoryId: string, gameId: string) => {
    handleVote(selectedEditionId, categoryId, gameId)
  }

  const handleSubmitVotesInUI = async () => {
    await handleSubmitVotes(selectedEditionId)
  }

  const handleBackToVoting = () => {
    setHasVoted(false)
    setVotedEditionId("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    )
  }

  // Se o usuário não estiver logado, exibir o modal de login
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-start pt-4 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <LoginModal handleLogin={handleLogin} />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (hasVoted) {
    return (
      <VotingCompletePage
        user={user}
        votes={votes}
        votedEditionId={votedEditionId}
        categories={editions.find((e) => e.id === votedEditionId)?.categories || []}
        onBackToVoting={handleBackToVoting}
        onBackToHome={handleBackToHome}
      />
    )
  }

  return (
    <VotingInterface
      user={user}
      editions={editions}
      selectedEditionId={selectedEditionId}
      activeCategory={activeCategory}
      votes={votes}
      isSubmitting={isSubmitting}
      getCurrentEditionCategories={getCurrentEditionCategories}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      handleBackToHome={handleBackToHome}
      handleEditionChange={handleEditionChange}
      setActiveCategory={setActiveCategory}
      handleVoteInUI={handleVoteInUI}
      handleSubmitVotesInUI={handleSubmitVotesInUI}
    />
  )
}

export default function VotingPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    }>
      <VotingContent />
    </Suspense>
  )
}
