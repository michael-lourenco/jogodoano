"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"
import { CheckCircle2, ArrowRight, Trophy, ArrowLeft, Clock, AlertCircle } from "lucide-react"
import { CategorySection } from "@/components/voting/CategorySection"
import { EditionsSelector } from "@/components/voting/EditionsSelector"
import { VotingProgress } from "@/components/voting/VotingProgress"
import { CategoryNavigation } from "@/components/voting/CategoryNavigation"
import { useVotingInterface } from "@/hooks/useVotingInterface"
import { useCategoryNavigation } from "@/hooks/useCategoryNavigation"
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation"
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation"
import { useStickyHeader } from "@/hooks/useStickyHeader"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState, useEffect, useRef, useCallback } from "react"
import type { VotingInterfaceProps } from "@/types/voting/interfaces"
import { CategorySelector } from "@/components/voting/CategorySelector"
import { useLocalVotes } from "@/stores/useLocalVotes"
import { CategoryStepper } from "@/components/voting/CategoryStepper"
import { cn } from "@/lib/utils"
import { useVotingManager } from "@/hooks/useVotingManager"
import { useFooterState } from "@/hooks/useFooterState"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { Header } from "@/components/Header"
import { useVotingPeriod } from '@/hooks/useVotingPeriod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GuestLoginModal } from "@/components/voting/GuestLoginModal"

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
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedGameElementId, setSelectedGameElementId] = useState<string | null>(null)
  const [showGuestLoginModal, setShowGuestLoginModal] = useState(false)
  const mobileMainContainerRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  
  const { setVote, getVotes, clearVotes } = useLocalVotes()

  const { tabsListRef, localActiveCategory, setLocalActiveCategory } = useVotingInterface({
    activeCategory,
    setActiveCategory,
    getCurrentEditionCategories,
    votes,
    selectedEditionId,
  })

  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleCategoryTransition } = useSwipeNavigation({
    getCurrentEditionCategories,
    localActiveCategory,
    setLocalActiveCategory,
    setActiveCategory,
    categoryRefs,
  })

  const { handleCategoryClick, navigateToCategory, scrollToCategoryTop } = useCategoryNavigation({
    getCurrentEditionCategories,
    localActiveCategory,
    setLocalActiveCategory,
    setActiveCategory,
    handleCategoryTransition,
    isMobile,
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

  const { scrollPosition, checkScrollPosition, resetScroll } = useScrollPosition({
    containerRef: contentContainerRef
  })

  const currentEdition = editions.find(edition => edition.id === selectedEditionId)
  const votingPeriod = useVotingPeriod(currentEdition!)

  // Atualiza o jogo selecionado quando a categoria muda
  useEffect(() => {
    // Usar o voto salvo da categoria atual em vez do selectedGame local
    const currentVote = votes[selectedEditionId]?.[localActiveCategory]
    if (currentVote) {
      updateSelectedGameRef(localActiveCategory, currentVote)
    }
  }, [localActiveCategory, votes, selectedEditionId])

  // Atualiza o localActiveCategory quando a edição muda
  useEffect(() => {
    const categories = getCurrentEditionCategories()
    // Se não houver categorias ou a categoria atual não existe na nova edição
    if (!categories.length || !categories.some(cat => cat.id === localActiveCategory)) {
      // Seleciona a primeira categoria disponível
      const newCategoryId = categories[0]?.id || ''
      setLocalActiveCategory(newCategoryId)
      setActiveCategory(newCategoryId)
    }
  }, [selectedEditionId, getCurrentEditionCategories, localActiveCategory, setLocalActiveCategory, setActiveCategory])

  const containerRef = useRef<HTMLDivElement>(null)
  const currentIndex = getCurrentEditionCategories().findIndex(cat => cat.id === localActiveCategory)

  // Função para calcular o índice real considerando o array circular
  const getCircularIndex = (index: number) => {
    const categories = getCurrentEditionCategories()
    if (!categories.length) return 0
    return (index + categories.length) % categories.length
  }

  // Array com os 5 índices que queremos mostrar (2 antes, atual, 2 depois)
  const visibleIndices = [
    getCircularIndex(currentIndex - 2),
    getCircularIndex(currentIndex - 1),
    currentIndex,
    getCircularIndex(currentIndex + 1),
    getCircularIndex(currentIndex + 2)
  ].filter(index => {
    const categories = getCurrentEditionCategories()
    return index >= 0 && index < categories.length && categories[index]
  })

  // Função para calcular a posição vertical ideal do botão com base no jogo selecionado
  const calculateButtonPosition = useCallback(() => {
    // Posição fixa logo acima do Footer
    return { bottom: '4rem' }; // 4rem corresponde à altura do Footer (h-16 = 4rem)
  }, []);

  // Atualizar a referência ao jogo selecionado
  const updateSelectedGameRef = useCallback((categoryId: string, gameId: string) => {
    // Apenas armazenar o ID do elemento para ser processado pelo effect
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

  // Adicionar um listener para resize da janela para recalcular a posição do botão
  useEffect(() => {
    const handleResize = () => {
      checkScrollPosition();
    };

    window.addEventListener('resize', handleResize);
    
    // Adicionar um observador de mutação para detectar mudanças no DOM que possam afetar o posicionamento
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

  // Adicionar uma função específica para resetar o scroll mobile
  const resetMobileScroll = useCallback(() => {
    if (contentContainerRef.current) {
      // Em vez de apenas scrollar para o topo, vamos procurar e focar no cabeçalho
      const headerElement = document.getElementById(`category-header-${localActiveCategory}`);
      
      if (headerElement) {
        // 1. Usar scrollIntoView para garantir que o cabeçalho esteja visível
        headerElement.scrollIntoView({ 
          block: 'start', 
          inline: 'nearest',
          behavior: 'auto'
        });
        
        // 2. Adicionalmente, podemos forçar o container a rolar para o topo
        contentContainerRef.current.scrollTop = 0;
        
        // 3. Usar setTimeout para garantir que o scrollIntoView tenha tempo para funcionar
        setTimeout(() => {
          // Verificar se o scrollIntoView funcionou corretamente
          const headerRect = headerElement.getBoundingClientRect();
          
          // Se o cabeçalho ainda não estiver no topo visível, tente novamente
          if (headerRect.top > 100) {  // tolerância de 100px
            headerElement.scrollIntoView({ 
              block: 'start', 
              inline: 'nearest',
              behavior: 'auto'
            });
          }
        }, 50);
      }
    }
  }, [localActiveCategory]);

  // Adicionar estado para controlar a animação de saída do botão
  const [isButtonExiting, setIsButtonExiting] = useState(false);

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
  const isLastCategory = currentCategoryIndex === categories.length - 1

  const isNextButtonVisible = (categoryId: string) => {
    return votes[selectedEditionId]?.[categoryId] && categoryId === localActiveCategory
  }

  // Adicionar um efeito para calcular e atualizar a altura do seletor de edições
  useEffect(() => {
    if (editionsSelectorRef.current && isSticky) {
      const height = editionsSelectorRef.current.offsetHeight;
      document.documentElement.style.setProperty('--editions-height', `${height}px`);
    }
  }, [isSticky]);

  // Adicionar useEffect para detectar mobile
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

  const styles = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-start pt-4 px-4">
          <div className="w-full max-w-4xl mx-auto">

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

            <div
              ref={editionsSelectorRef}
              className={`w-full transition-all duration-200 ${
                isSticky 
                  ? "fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-b border-muted shadow-sm" 
                  : ""
              }`}
            >
              <div className={`${isSticky ? "max-w-4xl mx-auto px-4 py-3" : ""}`}>
                <EditionsSelector
                  editions={editions}
                  selectedEditionId={selectedEditionId}
                  votes={votes}
                  getCurrentEditionCategories={getCurrentEditionCategories}
                  onEditionChange={handleEditionChange}
                />
              </div>
            </div>

            {isSticky && <div style={{ height: editionsSelectorHeight.current }}></div>}

            {selectedEditionId && editions.length > 0 && (
              <>
                {isMobile ? (
                  <div className="md:hidden mb-6 relative" ref={mobileMainContainerRef}>
                    {/* Category heading and description */}
                    <div 
                      className="mb-6 text-center" 
                      id={`category-header-${currentCategory?.id}`}
                      data-category-header="true"
                      style={{ 
                        scrollMarginTop: '180px',
                        paddingTop: isSticky ? '4rem' : '0'
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
                ) : (
                  // Desktop view with improved accessibility
                  <div className="hidden md:block mb-6">
                    <Tabs 
                      value={localActiveCategory} 
                      onValueChange={(newValue) => handleCategoryClick(newValue)} 
                      className="w-full"
                    >
                      <div
                        ref={tabsListRef}
                        className={`w-full ${
                          isSticky
                            ? "fixed top-0 left-0 right-0 z-10 bg-background px-4 py-2 shadow-md mt-12 max-w-4xl mx-auto"
                            : ""
                        }`}
                      >
                        <CategorySelector
                          categories={getCurrentEditionCategories()
                            .slice()
                            .sort((a, b) => {
                              const hasVoteA = Boolean(votes[selectedEditionId]?.[a.id])
                              const hasVoteB = Boolean(votes[selectedEditionId]?.[b.id])
                              if (hasVoteA === hasVoteB) {
                                return 0
                              }
                              return hasVoteA ? 1 : -1
                            })}
                          selectedCategoryId={localActiveCategory}
                          votes={votes[selectedEditionId] || {}}
                          onCategoryChange={handleCategoryClick}
                          isMobile={isMobile}
                        />
                      </div>

                      {isSticky && <div style={{ height: "3rem", marginBottom: "1rem" }}></div>}

                      {getCurrentEditionCategories().map((category) => (
                        <TabsContent
                          key={category.id}
                          value={category.id}
                          className="mt-4"
                          role="tabpanel"
                          aria-labelledby={`tab-${category.id}`}
                        >
                          <div 
                            className="mb-3 text-center" 
                            id={`category-header-${category.id}`}
                          >
                            <h2 className="text-xl font-bold text-primary mb-1 scroll-mt-20">{category.name}</h2>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                          <CategorySection
                            category={category}
                            selectedGameId={votes[selectedEditionId]?.[category.id]}
                            onVote={(gameId) => handleGameSelection(category.id, gameId)}
                            disabled={!canVote}
                          />

                          {/* Botões de navegação - Desktop */}
                          <div className="mt-6 px-4 pb-4 flex flex-col gap-4">
                            <VotingProgress
                              categories={categories}
                              votes={votes[selectedEditionId] || {}}
                              editionId={selectedEditionId}
                            />
                            <CategoryStepper
                              categories={categories}
                              currentCategoryId={localActiveCategory}
                              onStepClick={handleCategoryClick}
                              votes={votes[selectedEditionId] || {}}
                            />
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
                                  disabled={!votes[selectedEditionId]?.[category.id] || !canVote}
                                  className={cn(
                                    "flex-1 h-10 transition-all duration-300",
                                    votes[selectedEditionId]?.[category.id] && canVote
                                      ? "text-primary-foreground bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25"
                                      : "text-muted-foreground bg-muted/50 cursor-not-allowed"
                                  )}
                                >
                                  <span className="text-sm">Vote & Continue</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        <Footer />
        
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
      </div>
    </>
  )
}