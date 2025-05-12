"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"
import { CheckCircle2, ArrowRight, Trophy } from "lucide-react"
import { UserInfo } from "@/components/UserInfo"
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

export function VotingInterface({
  user,
  editions,
  selectedEditionId,
  activeCategory,
  votes,
  isSubmitting,
  getCurrentEditionCategories,
  handleLogin,
  handleLogout,
  handleBackToHome,
  handleEditionChange,
  setActiveCategory,
  handleVoteInUI,
  handleSubmitVotesInUI,
}: VotingInterfaceProps) {
  const isMobile = useIsMobile()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const [selectedGameElementId, setSelectedGameElementId] = useState<string | null>(null)

  const { tabsListRef, localActiveCategory, setLocalActiveCategory } = useVotingInterface({
    activeCategory,
    setActiveCategory,
    getCurrentEditionCategories,
    votes,
    selectedEditionId,
  })

  const { categoryRefs } = useCategoryNavigation()

  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleCategoryTransition, transitionDuration } = useSwipeNavigation({
    getCurrentEditionCategories,
    localActiveCategory,
    setLocalActiveCategory,
    setActiveCategory,
    categoryRefs,
  })

  // Add keyboard navigation
  useKeyboardNavigation({
    localActiveCategory,
    setLocalActiveCategory,
    setActiveCategory,
    getCurrentEditionCategories,
    handleCategoryTransition,
  })

  const { isSticky, editionsSelectorRef, editionsSelectorHeight, categoryTabsRef, categoryTabsHeight } =
    useStickyHeader()

  const categories = getCurrentEditionCategories()

  // Atualiza o jogo selecionado quando a categoria muda
  useEffect(() => {
    setSelectedGame(votes[selectedEditionId]?.[localActiveCategory] || null)
  }, [localActiveCategory, votes, selectedEditionId])

  // Estado para controlar a posição de rolagem do usuário
  const [scrollPosition, setScrollPosition] = useState<'top' | 'middle' | 'bottom'>('top')
  
  // Função para verificar a posição de scroll
  const checkScrollPosition = useCallback(() => {
    if (contentContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentContainerRef.current
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100
      
      // Determinar a posição de rolagem
      let position: 'top' | 'middle' | 'bottom' = 'top'
      
      if (scrollPercentage < 20) {
        position = 'top'
      } else if (scrollPercentage > 80) {
        position = 'bottom'
      } else {
        position = 'middle'
      }
      
      setScrollPosition(position)
      
      // Manter a verificação de scroll até o fim para compatibilidade
      const isBottom = scrollTop + clientHeight >= scrollHeight - 20 // 20px de tolerância
      setIsScrolledToBottom(isBottom)
    }
  }, [])

  // Configurar o listener de scroll
  useEffect(() => {
    const container = contentContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      checkScrollPosition() // Verificar posição inicial
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition)
      }
    }
  }, [checkScrollPosition, localActiveCategory])

  // Função para calcular a posição vertical ideal do botão com base no jogo selecionado
  const calculateButtonPosition = useCallback(() => {
    if (selectedGameElementId && scrollPosition !== 'bottom') {
      const selectedElement = document.getElementById(selectedGameElementId);
      if (selectedElement) {
        // Calcular a posição do elemento selecionado em relação à viewport
        const rect = selectedElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Se o elemento estiver visível na tela
        if (rect.top >= 0 && rect.bottom <= viewportHeight) {
          // Posicionar o botão abaixo do jogo selecionado, mas não muito perto do fim da tela
          const bottomSpace = viewportHeight - rect.bottom;
          if (bottomSpace < 150) {
            // Se não houver espaço suficiente abaixo, posicione no fim da tela
            return { bottom: '10vh' };
          } else {
            // Posicione o botão 20px abaixo do jogo selecionado
            return { top: `${rect.bottom + 20}px`, bottom: 'auto' };
          }
        } else if (rect.top < 0 && rect.bottom > 0) {
          // O elemento está parcialmente visível no topo
          return { bottom: '40vh' };
        } else if (rect.top < viewportHeight && rect.bottom > viewportHeight) {
          // O elemento está parcialmente visível na parte inferior
          return { bottom: '10vh' };
        }
      }
    }
    
    // Posição padrão com base na posição de rolagem
    return { bottom: scrollPosition === 'top' ? '30vh' : '40vh' };
  }, [selectedGameElementId, scrollPosition]);

  // Atualizar a referência ao jogo selecionado
  const updateSelectedGameRef = useCallback((categoryId: string, gameId: string) => {
    // Apenas armazenar o ID do elemento para ser processado pelo effect
    setSelectedGameElementId(`game-${gameId}`)
  }, [])

  // Efeito para atualizar a referência quando o ID do elemento mudar
  useEffect(() => {
    if (selectedGameElementId) {
      // Dar tempo para a DOM atualizar
      setTimeout(() => {
        const selectedGameElement = document.getElementById(selectedGameElementId)
        if (selectedGameElement) {
          // Não atribuímos diretamente à propriedade current
          // Em vez disso, usamos o elemento para realizar as ações necessárias
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

  // Usar o callback no handleGameSelection
  const handleGameSelection = (categoryId: string, gameId: string) => {
    console.log("VotingInterface: handleGameSelection", categoryId, gameId)
    
    // Primeiro registramos o voto no sistema
    handleVoteInUI(categoryId, gameId)
    
    // Atualizar o estado local e a referência
    setSelectedGame(gameId)
    updateSelectedGameRef(categoryId, gameId)
  }

  // Debug: observar mudanças em votes
  useEffect(() => {
    console.log("VotingInterface: votes updated", votes)
  }, [votes])

  const navigateToCategory = (direction: "prev" | "next") => {
    const currentCategoryIndex = categories.findIndex((cat) => cat.id === localActiveCategory)

    if (direction === "prev" && currentCategoryIndex > 0) {
      const prevCategory = categories[currentCategoryIndex - 1]
      handleCategoryTransition(localActiveCategory, prevCategory.id)
      setTimeout(() => {
        setLocalActiveCategory(prevCategory.id)
        setActiveCategory(prevCategory.id)
      }, 50)
    } else if (direction === "next" && currentCategoryIndex < categories.length - 1) {
      const nextCategory = categories[currentCategoryIndex + 1]
      handleCategoryTransition(localActiveCategory, nextCategory.id)
      setTimeout(() => {
        setLocalActiveCategory(nextCategory.id)
        setActiveCategory(nextCategory.id)
      }, 50)
    }
  }

  const navigateToNextCategory = () => {
    const currentCategoryIndex = categories.findIndex((cat) => cat.id === localActiveCategory)
    if (currentCategoryIndex < categories.length - 1) {
      navigateToCategory("next")
    }
  }

  const isAllCategoriesVoted = () => {
    return categories.every(category => !!votes[selectedEditionId]?.[category.id])
  }

  const currentCategoryIndex = categories.findIndex((cat) => cat.id === localActiveCategory)
  const currentCategory = categories[currentCategoryIndex]
  const isLastCategory = currentCategoryIndex === categories.length - 1

  const isNextButtonVisible = (categoryId: string) => {
    return votes[selectedEditionId]?.[categoryId] && categoryId === localActiveCategory
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex flex-col items-center justify-start pt-4 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <UserInfo user={user} handleLogin={handleLogin} handleLogout={handleLogout} />

          <div
            ref={editionsSelectorRef}
            className={`w-full ${isSticky ? "fixed top-0 left-0 right-0 z-10 bg-background px-4 py-2 shadow-md" : ""}`}
          >
            <div className={`${isSticky ? "max-w-4xl mx-auto" : ""}`}>
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
              {/* Progress bar showing voting completion */}
              <VotingProgress
                categories={categories}
                votes={votes[selectedEditionId] || {}}
                editionId={selectedEditionId}
              />

              {isMobile ? (
                <div className="mb-6 relative">
                  {/* Category selector tabs */}
                  <div
                    ref={categoryTabsRef}
                    className={`overflow-x-auto mb-4 ${
                      isSticky ? "fixed top-0 left-0 right-0 z-10 bg-background px-4 py-2 shadow-md mt-12" : ""
                    }`}
                  >
                    <div className={`flex space-x-2 p-1 ${isSticky ? "max-w-4xl mx-auto" : ""}`}>
                      {getCurrentEditionCategories().map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            if (category.id !== localActiveCategory) {
                              handleCategoryTransition(localActiveCategory, category.id)
                              setTimeout(() => {
                                setLocalActiveCategory(category.id)
                                setActiveCategory(category.id)
                              }, 50)
                            }
                          }}
                          className={`px-3 py-2 text-sm whitespace-nowrap rounded-md flex items-center ${
                            localActiveCategory === category.id ? "bg-primary text-primary-foreground" : "bg-muted/30"
                          } ${votes[selectedEditionId]?.[category.id] ? "text-success" : ""}`}
                          aria-pressed={localActiveCategory === category.id}
                          aria-label={`Categoria ${category.name} ${votes[selectedEditionId]?.[category.id] ? "(votada)" : ""}`}
                        >
                          {category.name.split(" ").pop()}
                          {votes[selectedEditionId]?.[category.id] && (
                            <CheckCircle2 className="ml-1 h-3 w-3 inline-block" aria-hidden="true" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isSticky && categoryTabsRef.current && (
                    <div style={{ height: categoryTabsHeight.current, marginBottom: "1rem" }}></div>
                  )}

                  {/* Category heading and description */}
                  <div className="mb-3 text-center">
                    <h2 className="text-xl font-bold text-primary mb-1">{currentCategory?.name}</h2>
                    <p className="text-sm text-muted-foreground">{currentCategory?.description}</p>
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
                          <div className="p-4">
                            <CategorySection
                              category={category}
                              selectedGameId={votes[selectedEditionId]?.[category.id]}
                              onVote={(gameId) => handleGameSelection(category.id, gameId)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation buttons */}
                    <CategoryNavigation
                      categories={categories}
                      currentCategoryId={localActiveCategory}
                      navigateToCategory={navigateToCategory}
                    />
                  </div>

                  {/* Botão de próxima categoria - versão móvel */}
                  {isNextButtonVisible(localActiveCategory) && !isLastCategory && (
                    <div 
                      className={`
                        ${scrollPosition === 'bottom'
                          ? "mt-4 mb-2 flex justify-center" 
                          : "fixed left-0 right-0 px-4 flex justify-center z-10"
                        } transition-all duration-300
                      `}
                      style={calculateButtonPosition()}
                    >
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 px-6 py-5 w-full max-w-sm shadow-lg"
                        onClick={() => navigateToCategory("next")}
                      >
                        Ir para Próxima Categoria
                        <ArrowRight className="h-5 w-5 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                // Desktop view with improved accessibility
                <div className="hidden md:block mb-6">
                  <Tabs value={localActiveCategory} onValueChange={(newValue) => {
                    if (newValue !== localActiveCategory) {
                      handleCategoryTransition(localActiveCategory, newValue)
                      setTimeout(() => {
                        setLocalActiveCategory(newValue)
                        setActiveCategory(newValue)
                      }, 50)
                    }
                  }} className="w-full">
                    <TabsList
                      ref={tabsListRef}
                      className={`w-full overflow-x-auto flex-nowrap scroll-smooth p-1 bg-muted/20 ${
                        isSticky
                          ? "fixed top-0 left-0 right-0 z-10 bg-background px-4 py-2 shadow-md mt-12 max-w-4xl mx-auto"
                          : ""
                      }`}
                    >
                      {getCurrentEditionCategories()
                        .slice()
                        .sort((a, b) => {
                          const hasVoteA = Boolean(votes[selectedEditionId]?.[a.id])
                          const hasVoteB = Boolean(votes[selectedEditionId]?.[b.id])
                          if (hasVoteA === hasVoteB) {
                            return 0
                          }
                          return hasVoteA ? 1 : -1
                        })
                        .map((category) => (
                          <TabsTrigger
                            key={category.id}
                            id={`tab-${category.id}`}
                            value={category.id}
                            className={`flex-shrink-0 ${
                              votes[selectedEditionId]?.[category.id] ? "text-success" : ""
                            } px-2 py-1 rounded-md text-sm whitespace-nowrap`}
                            aria-label={`Categoria ${category.name} ${votes[selectedEditionId]?.[category.id] ? "(votada)" : ""}`}
                          >
                            {category.name.split(" ").pop()}
                            {votes[selectedEditionId]?.[category.id] && (
                              <CheckCircle2 className="ml-1 h-3 w-3 inline-block" aria-hidden="true" />
                            )}
                          </TabsTrigger>
                        ))}
                    </TabsList>

                    {isSticky && <div style={{ height: "3rem", marginBottom: "1rem" }}></div>}

                    {getCurrentEditionCategories().map((category) => (
                      <TabsContent
                        key={category.id}
                        value={category.id}
                        className="mt-4"
                        role="tabpanel"
                        aria-labelledby={`tab-${category.id}`}
                      >
                        <div className="mb-3 text-center">
                          <h2 className="text-xl font-bold text-primary mb-1">{category.name}</h2>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        
                        <CategorySection
                          category={category}
                          selectedGameId={votes[selectedEditionId]?.[category.id]}
                          onVote={(gameId) => handleGameSelection(category.id, gameId)}
                        />

                        {/* Botão de próxima categoria - versão desktop */}
                        {isNextButtonVisible(category.id) && !isLastCategory && (
                          <div className="mt-4 flex justify-center transition-all duration-300">
                            <Button 
                              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 px-6 py-5 shadow-lg"
                              onClick={() => navigateToCategory("next")}
                            >
                              Ir para Próxima Categoria
                              <ArrowRight className="h-5 w-5 ml-1" />
                            </Button>
                          </div>
                        )}

                        {/* Add navigation to desktop view as well */}
                        <div className="mt-6">
                          <CategoryNavigation
                            categories={categories}
                            currentCategoryId={localActiveCategory}
                            navigateToCategory={navigateToCategory}
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}

              {/* Submit all votes button */}
              <div className={`sticky bottom-4 mt-8 mb-4 flex justify-center ${showConfirmation ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                <Button
                  onClick={handleSubmitVotesInUI}
                  disabled={
                    isSubmitting || !isAllCategoriesVoted()
                  }
                  className="w-full max-w-md h-12 text-primary-foreground bg-gradient-to-r from-chart-1 to-success hover:from-chart-1 hover:to-success-foreground shadow-lg hover:shadow-success/25 hover:text-secondary-foreground transition-all duration-300"
                  size="lg"
                  aria-live="polite"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div
                        className="w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin mr-2"
                        aria-hidden="true"
                      ></div>
                      Processando...
                    </div>
                  ) : (
                    <>Enviar Todos os Votos</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}