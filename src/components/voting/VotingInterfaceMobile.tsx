"use client"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, AlertCircle, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { CategorySection } from "@/components/voting/CategorySection"
import { VotingProgress } from "@/components/voting/VotingProgress"
import { useCategoryNavigation } from "@/hooks/useCategoryNavigation"
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation"
import { useState, useEffect, useRef, useCallback } from "react"
import type { VotingInterfaceProps } from "@/types/voting/interfaces"
import { cn } from "@/lib/utils"
import { useVotingManager } from "@/hooks/useVotingManager"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GuestLoginModal } from "@/components/voting/GuestLoginModal"

interface VotingInterfaceMobileProps extends VotingInterfaceProps {
  localActiveCategory: string
  setLocalActiveCategory: (categoryId: string) => void
}

export function VotingInterfaceMobile({
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
}: VotingInterfaceMobileProps) {
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const [showGuestLoginModal, setShowGuestLoginModal] = useState(false)
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  
  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleCategoryTransition } = useSwipeNavigation({
    getCurrentEditionCategories,
    localActiveCategory,
    setLocalActiveCategory,
    setActiveCategory,
    categoryRefs,
  })

  const { handleCategoryClick } = useCategoryNavigation({
    getCurrentEditionCategories,
    localActiveCategory,
    setLocalActiveCategory,
    setActiveCategory,
    handleCategoryTransition,
    isMobile: true,
    containerRef: contentContainerRef
  })

  const categories = getCurrentEditionCategories()

  const {
    isSubmitting: isSubmittingVotes,
    handleGameSelection,
    handleSubmitVotes,
    loadLocalVotes,
    isAllCategoriesVoted,
    canVote,
    votingStatus,
    votingMessage
  } = useVotingManager({
    selectedEditionId,
    editions,
    votes,
    handleVoteInUI,
    handleSubmitVotesInUI: async () => {
      const success = await handleSubmitVotesInUI()
      if (!success && isGuestMode) {
        setShowGuestLoginModal(true)
      }
      return success
    },
    userEmail: user?.email
  })

  const currentEdition = editions.find(edition => edition.id === selectedEditionId)

  // Carregar votos locais ao entrar na edição
  useEffect(() => {
    loadLocalVotes()
  }, [loadLocalVotes])

  const navigateToNextCategory = useCallback(() => {
    const categories = getCurrentEditionCategories()
    const currentIndex = categories.findIndex(cat => cat.id === localActiveCategory)
    
    if (currentIndex < categories.length - 1) {
      const nextCategory = categories[currentIndex + 1]
      handleCategoryClick(nextCategory.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [getCurrentEditionCategories, localActiveCategory, handleCategoryClick])

  const navigateToPreviousCategory = useCallback(() => {
    const categories = getCurrentEditionCategories()
    const currentIndex = categories.findIndex(cat => cat.id === localActiveCategory)
    
    if (currentIndex > 0) {
      const previousCategory = categories[currentIndex - 1]
      handleCategoryClick(previousCategory.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [getCurrentEditionCategories, localActiveCategory, handleCategoryClick])

  const currentCategoryIndex = categories.findIndex((cat) => cat.id === localActiveCategory)
  const currentCategory = categories[currentCategoryIndex]

  return (
    <>
      {/* Alerta de Status da Votação - Simplificado */}
      {currentEdition && votingStatus !== 'active' && (
        <div className="mb-4">
          <Alert className={cn(
            "mb-4",
            votingStatus === 'upcoming' 
              ? 'bg-info/10 border-info/20 text-info' 
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          )}>
            <div className="flex items-center gap-2">
              {votingStatus === 'upcoming' ? (
                <Clock className="h-4 w-4 text-info" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <AlertDescription className="text-sm font-medium">
                {votingMessage}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {selectedEditionId && currentCategory && (
        <div className="w-full space-y-6">
          {/* Cabeçalho Simplificado */}
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Categoria {currentCategoryIndex + 1} de {categories.length}
            </div>
            <h1 className="text-2xl font-bold text-primary">{currentCategory.name}</h1>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto px-4">{currentCategory.description}</p>
          </div>

          {/* Barra de Progresso com Navegação */}
          <div className="w-full px-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToPreviousCategory}
                disabled={currentCategoryIndex === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Anterior</span>
              </Button>
              
              <div className="flex-1">
                <VotingProgress
                  categories={categories}
                  votes={votes[selectedEditionId] || {}}
                  editionId={selectedEditionId}
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToNextCategory}
                disabled={currentCategoryIndex === categories.length - 1 || !votes[selectedEditionId]?.[currentCategory.id]}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline text-xs">Próxima</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              {Object.keys(votes[selectedEditionId] || {}).length} de {categories.length} categorias votadas
            </div>
          </div>

          {/* Swipeable content area */}
          <div
            className="border border-muted rounded-md shadow-sm mx-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Área de votação"
            ref={contentContainerRef}
          >
            <div className="relative overflow-hidden">
              {getCurrentEditionCategories().map((category) => (
                <div
                  key={category.id}
                  ref={(el) => {
                    if (el) {
                      categoryRefs.current = {
                        ...categoryRefs.current,
                        [category.id]: el
                      }
                    } else if (categoryRefs.current[category.id]) {
                      const { [category.id]: _, ...rest } = categoryRefs.current
                      categoryRefs.current = rest
                    }
                  }}
                  className={`transition-all duration-300 ease-in-out ${
                    localActiveCategory === category.id ? "block opacity-100" : "hidden opacity-0"
                  }`}
                  role="tabpanel"
                  aria-labelledby={`tab-${category.id}`}
                  tabIndex={localActiveCategory === category.id ? 0 : -1}
                >
                  <div className="p-4">
                    <CategorySection
                      category={category}
                      selectedGameId={votes[selectedEditionId]?.[category.id]}
                      onVote={(gameId) => handleGameSelection(category.id, gameId)}
                      disabled={!canVote}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navegação Simplificada */}
          <div className="flex items-center justify-between gap-2 px-4 pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToPreviousCategory}
              disabled={currentCategoryIndex === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Anterior</span>
            </Button>

            {isAllCategoriesVoted(categories) ? (
              <Button
                onClick={handleSubmitVotes}
                disabled={isSubmittingVotes || !canVote}
                className="flex-1 h-11 text-base font-semibold text-primary-foreground bg-gradient-to-r from-chart-1 to-success hover:from-chart-1 hover:to-success-foreground shadow-lg hover:shadow-success/25 transition-all duration-300"
                aria-live="polite"
              >
                {isSubmittingVotes ? (
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin"
                      aria-hidden="true"
                    ></div>
                    <span className="text-sm">Processando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm">Enviar Votos</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </Button>
            ) : (
              <Button
                onClick={navigateToNextCategory}
                disabled={!votes[selectedEditionId]?.[currentCategory.id] || !canVote || currentCategoryIndex === categories.length - 1}
                className={cn(
                  "flex-1 h-11 text-base font-semibold transition-all duration-300",
                  votes[selectedEditionId]?.[currentCategory.id] && canVote && currentCategoryIndex < categories.length - 1
                    ? "text-primary-foreground bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25"
                    : "text-muted-foreground bg-muted/50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm">Próxima</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={navigateToNextCategory}
              disabled={currentCategoryIndex === categories.length - 1 || !votes[selectedEditionId]?.[currentCategory.id]}
              className="flex items-center gap-1"
            >
              <span className="hidden sm:inline text-xs">Próxima</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Indicador de Categorias */}
          <div className="flex items-center justify-center gap-2 pb-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => {
                  handleCategoryClick(category.id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  category.id === localActiveCategory
                    ? "w-6 bg-primary"
                    : votes[selectedEditionId]?.[category.id]
                    ? "bg-success"
                    : "bg-muted"
                )}
                aria-label={`Categoria ${index + 1}: ${category.name}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal de Login para Usuários Guest */}
      <GuestLoginModal
        isOpen={showGuestLoginModal}
        onClose={() => setShowGuestLoginModal(false)}
        onLogin={() => {
          setShowGuestLoginModal(false)
          handleLogin()
        }}
        votesCount={Object.keys(votes[selectedEditionId] || {}).length}
        editionName={editions.find(e => e.id === selectedEditionId)?.name || selectedEditionId}
      />
    </>
  )
}

