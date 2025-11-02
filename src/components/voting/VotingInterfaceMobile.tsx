"use client"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/Footer"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { CategorySection } from "@/components/voting/CategorySection"
import { EditionsSelector } from "@/components/voting/EditionsSelector"
import { VotingProgress } from "@/components/voting/VotingProgress"
import { useCategoryNavigation } from "@/hooks/useCategoryNavigation"
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation"
import { useStickyHeader } from "@/hooks/useStickyHeader"
import { useState, useEffect, useRef, useCallback } from "react"
import type { VotingInterfaceProps } from "@/types/voting/interfaces"
import { CategorySelector } from "@/components/voting/CategorySelector"
import { CategoryStepper } from "@/components/voting/CategoryStepper"
import { cn } from "@/lib/utils"
import { useVotingManager } from "@/hooks/useVotingManager"
import { useFooterState } from "@/hooks/useFooterState"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { useVotingPeriod } from '@/hooks/useVotingPeriod'
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
  const [selectedGameElementId, setSelectedGameElementId] = useState<string | null>(null)
  const [showGuestLoginModal, setShowGuestLoginModal] = useState(false)
  const mobileMainContainerRef = useRef<HTMLDivElement>(null)
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

  const { isSticky, editionsSelectorRef, editionsSelectorHeight, categoryTabsRef, categoryTabsHeight } =
    useStickyHeader()

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

  const footerState = useFooterState()

  const { checkScrollPosition } = useScrollPosition({
    containerRef: contentContainerRef
  })

  const currentEdition = editions.find(edition => edition.id === selectedEditionId)
  const votingPeriod = useVotingPeriod(currentEdition!)

  // Atualiza o jogo selecionado quando a categoria muda
  useEffect(() => {
    const currentVote = votes[selectedEditionId]?.[localActiveCategory]
    if (currentVote) {
      updateSelectedGameRef(localActiveCategory, currentVote)
    }
  }, [localActiveCategory, votes, selectedEditionId])

  // Atualizar a referência ao jogo selecionado
  const updateSelectedGameRef = useCallback((categoryId: string, gameId: string) => {
    setSelectedGameElementId(`game-${gameId}`)
  }, [])

  // Efeito para atualizar a referência quando o ID do elemento mudar
  useEffect(() => {
    if (selectedGameElementId) {
      setTimeout(() => {
        const selectedGameElement = document.getElementById(selectedGameElementId)
        if (selectedGameElement) {
          checkScrollPosition()
        }
      }, 100)
    }
  }, [selectedGameElementId, checkScrollPosition])

  // Adicionar um listener para resize da janela
  useEffect(() => {
    const handleResize = () => {
      checkScrollPosition();
    };

    window.addEventListener('resize', handleResize);
    
    if (contentContainerRef.current) {
      const observer = new MutationObserver(() => {
        checkScrollPosition();
      });
      
      observer.observe(contentContainerRef.current, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
      
      return () => {
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
      };
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [checkScrollPosition]);

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
    }
  }, [getCurrentEditionCategories, localActiveCategory, handleCategoryClick])

  const currentCategoryIndex = categories.findIndex((cat) => cat.id === localActiveCategory)
  const currentCategory = categories[currentCategoryIndex]

  // Estado para recalcular posição quando alturas mudarem
  const [categorySelectorTop, setCategorySelectorTop] = useState(0)

  // Função para atualizar posição do CategorySelector
  const updateCategorySelectorPosition = useCallback(() => {
    if (!isSticky) {
      setCategorySelectorTop(0)
      return
    }

    requestAnimationFrame(() => {
      let editionsHeight = editionsSelectorHeight.current
      
      // Atualizar altura do EditionsSelector quando sticky
      if (editionsSelectorRef.current) {
        editionsHeight = editionsSelectorRef.current.offsetHeight
        editionsSelectorHeight.current = editionsHeight
      }
      
      // Atualizar altura do CategorySelector quando sticky
      if (categoryTabsRef.current) {
        const height = categoryTabsRef.current.offsetHeight
        categoryTabsHeight.current = height
      }
      
      // Recalcular posição do CategorySelector: Header (64px) + altura do EditionsSelector
      setCategorySelectorTop(64 + editionsHeight)
    })
  }, [isSticky, editionsSelectorRef, editionsSelectorHeight, categoryTabsRef, categoryTabsHeight])

  // Atualizar posição quando sticky muda
  useEffect(() => {
    updateCategorySelectorPosition()
  }, [updateCategorySelectorPosition])

  // ResizeObserver para atualizar quando as alturas mudarem
  useEffect(() => {
    if (!isSticky) return

    const resizeObserver = new ResizeObserver(() => {
      updateCategorySelectorPosition()
    })

    if (editionsSelectorRef.current) {
      resizeObserver.observe(editionsSelectorRef.current)
    }

    if (categoryTabsRef.current) {
      resizeObserver.observe(categoryTabsRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [isSticky, updateCategorySelectorPosition])

  return (
    <>
      {/* Alerta de Status da Votação */}
      {currentEdition && (
        <div className="mb-6">
          <Alert className={cn(
            "mb-4",
            votingStatus === 'upcoming' 
              ? 'bg-info/10 border-info/20 text-info' 
              : votingStatus === 'ended'
              ? 'bg-destructive/10 border-destructive/20 text-destructive'
              : 'bg-success/10 border-success/20 text-success'
          )}>
            <div className="flex items-center gap-2">
              {votingStatus === 'upcoming' ? (
                <Clock className="h-4 w-4 text-info" />
              ) : votingStatus === 'ended' ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-success" />
              )}
              <AlertDescription className="text-sm font-medium">
                {votingMessage}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {/* EditionsSelector com sticky */}
      <div
        ref={editionsSelectorRef}
        className={cn(
          "w-full transition-all duration-200",
          isSticky && "fixed top-16 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-b border-muted shadow-sm"
        )}
      >
        <div className={cn(isSticky && "max-w-4xl mx-auto px-4 py-3")}>
          <EditionsSelector
            editions={editions}
            selectedEditionId={selectedEditionId}
            votes={votes}
            getCurrentEditionCategories={getCurrentEditionCategories}
            onEditionChange={handleEditionChange}
          />
        </div>
      </div>

      {/* Espaçador para quando EditionsSelector fica sticky */}
      {isSticky && <div style={{ height: editionsSelectorHeight.current }}></div>}

      {selectedEditionId && editions.length > 0 && (
        <>
          {/* Category Selector Sticky para Mobile */}
          <div 
            ref={categoryTabsRef}
            className={cn(
              "w-full transition-all duration-200",
              isSticky && "fixed left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-b border-muted shadow-sm"
            )}
            style={isSticky ? { top: `${categorySelectorTop}px` } : undefined}
          >
            <div className={cn("max-w-4xl mx-auto px-4", isSticky ? "py-2" : "py-0")}>
              <CategorySelector
                categories={getCurrentEditionCategories()}
                selectedCategoryId={localActiveCategory}
                onCategoryChange={handleCategoryClick}
                votes={votes[selectedEditionId] || {}}
                isMobile={true}
              />
            </div>
          </div>

          {/* Espaçador para quando CategorySelector fica sticky */}
          {isSticky && <div style={{ height: categoryTabsHeight.current }}></div>}
          
          <div className="md:hidden mb-6 relative" ref={mobileMainContainerRef}>
            {/* Category heading and description */}
            <div 
              className="mb-6 text-center" 
              id={`category-header-${currentCategory?.id}`}
              data-category-header="true"
              style={{ 
                scrollMarginTop: isSticky ? `${64 + editionsSelectorHeight.current + categoryTabsHeight.current + 16}px` : '0',
                paddingTop: isSticky ? '1rem' : '0'
              }}
            >
              <h2 className="text-xl font-bold text-primary mb-2">{currentCategory?.name}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{currentCategory?.description}</p>
            </div>

            {/* Swipeable content area */}
            <div
              className="border border-muted rounded-md shadow-sm"
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
                    <div className="p-4 pb-24">
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

              {/* Container para progresso e botão */}
              <div 
                className="sticky left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-muted transition-all duration-300"
                style={{
                  bottom: footerState.isExpanded ? '4rem' : '1rem',
                  marginBottom: '0',
                  zIndex: footerState.isExpanded ? 20 : 50
                }}
              >
                <VotingProgress
                  categories={categories}
                  votes={votes[selectedEditionId] || {}}
                  editionId={selectedEditionId}
                />
                {/* Category Stepper */}
                <div className="px-4 py-2">
                  <CategoryStepper
                    categories={categories}
                    currentCategoryId={localActiveCategory}
                    onStepClick={handleCategoryClick}
                    votes={votes[selectedEditionId] || {}}
                  />
                </div>

                {/* Botões de navegação */}
                <div className="px-4 pb-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    {isAllCategoriesVoted(categories) ? (
                      <Button
                        onClick={handleSubmitVotes}
                        disabled={isSubmittingVotes || !canVote}
                        className="flex-1 h-10 text-primary-foreground bg-gradient-to-r from-chart-1 to-success hover:from-chart-1 hover:to-success-foreground shadow-lg hover:shadow-success/25 hover:text-secondary-foreground transition-all duration-300"
                        aria-live="polite"
                      >
                        {isSubmittingVotes ? (
                          <div className="flex items-center justify-center">
                            <div
                              className="w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin mr-2"
                              aria-hidden="true"
                            ></div>
                            <span className="text-sm">Processando...</span>
                          </div>
                        ) : (
                          <span className="text-sm">Enviar Votos</span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={navigateToNextCategory}
                        disabled={!votes[selectedEditionId]?.[localActiveCategory] || !canVote}
                        className={cn(
                          "flex-1 h-10 transition-all duration-300",
                          votes[selectedEditionId]?.[localActiveCategory] && canVote
                            ? "text-primary-foreground bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25"
                            : "text-muted-foreground bg-muted/50 cursor-not-allowed"
                        )}
                      >
                        <span className="text-sm">Vote & Continue</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
      )}
    </>
  )
}

