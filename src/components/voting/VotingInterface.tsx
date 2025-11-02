"use client"
import { Footer } from "@/components/Footer"
import { useVotingInterface } from "@/hooks/useVotingInterface"
import { useState, useEffect } from "react"
import type { VotingInterfaceProps } from "@/types/voting/interfaces"
import { Header } from "@/components/Header"
import { VotingInterfaceMobile } from "@/components/voting/VotingInterfaceMobile"
import { VotingInterfaceDesktop } from "@/components/voting/VotingInterfaceDesktop"

export function VotingInterface({
  user,
  editions,
  selectedEditionId,
  activeCategory,
  votes,
  isSubmitting,
  isGuestMode,
  getCurrentEditionCategories,
  handleLogin,
  handleLogout,
  handleBackToHome,
  handleEditionChange,
  setActiveCategory,
  handleVoteInUI,
  handleSubmitVotesInUI,
}: VotingInterfaceProps) {
  const [isMobile, setIsMobile] = useState(false)

  const { localActiveCategory, setLocalActiveCategory } = useVotingInterface({
    activeCategory,
    setActiveCategory,
    getCurrentEditionCategories,
    votes,
    selectedEditionId,
  })

  // Atualiza o localActiveCategory quando a edição muda
  useEffect(() => {
    const categories = getCurrentEditionCategories()
    if (!categories.length || !categories.some(cat => cat.id === localActiveCategory)) {
      const newCategoryId = categories[0]?.id || ''
      setLocalActiveCategory(newCategoryId)
      setActiveCategory(newCategoryId)
    }
  }, [selectedEditionId, getCurrentEditionCategories, localActiveCategory, setLocalActiveCategory, setActiveCategory])

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const commonProps = {
    user,
    editions,
    selectedEditionId,
    activeCategory,
    votes,
    isSubmitting,
    isGuestMode,
    getCurrentEditionCategories,
    handleLogin,
    handleLogout,
    handleBackToHome,
    handleEditionChange,
    setActiveCategory,
    handleVoteInUI,
    handleSubmitVotesInUI,
    localActiveCategory,
    setLocalActiveCategory,
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start pt-4 px-4">
        <div className="w-full max-w-4xl mx-auto">
          {isMobile ? (
            <VotingInterfaceMobile {...commonProps} />
          ) : (
            <VotingInterfaceDesktop {...commonProps} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
