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
  const mobileMainContainerRef = useRef<HTMLDivElement>(null)

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

  // Função aprimorada para rolar para o topo da categoria
  const scrollToCategoryTop = useCallback(() => {
    setTimeout(() => {
      // Encontrar o cabeçalho da categoria atual com base no ID
      const headerElement = document.getElementById(`category-header-${localActiveCategory}`);
      
      if (isMobile && contentContainerRef.current) {
        // Na versão mobile, além de rolar para o topo, também destacamos visualmente o cabeçalho
        
        // Verificar se o headerElement está dentro do contentContainerRef
        // Se estiver, usamos o scrollTop para manipular diretamente
        if (headerElement) {
          // Destacar visualmente o cabeçalho
          headerElement.classList.add('bg-primary/10');
          headerElement.style.transition = 'all 0.4s ease';
          headerElement.style.transform = 'scale(1.05)';
          headerElement.style.boxShadow = '0 0 15px rgba(var(--primary), 0.3)';
          
          // Garantir que o cabeçalho esteja no topo visível
          contentContainerRef.current.scrollTop = 0;
          
          // Encontrar o título dentro do cabeçalho para destacá-lo
          const titleElement = headerElement.querySelector('h2');
          if (titleElement) {
            titleElement.style.transition = 'all 0.4s ease';
            titleElement.style.textShadow = '0 0 5px rgba(var(--primary), 0.5)';
            titleElement.style.fontSize = '1.3em';  // Aumentar temporariamente o tamanho da fonte
          }
          
          setTimeout(() => {
            headerElement.classList.remove('bg-primary/10');
            headerElement.style.transform = '';
            headerElement.style.boxShadow = '';
            
            if (titleElement) {
              titleElement.style.textShadow = '';
              titleElement.style.fontSize = '';
            }
          }, 1000);
        }
      } else {
        // Na versão desktop, usar o scrollIntoView para uma rolagem mais precisa
        if (headerElement) {
          // Calcular o offset para considerar elementos fixos no topo
          let offsetTop = 0;
          
          if (isSticky && editionsSelectorHeight.current) {
            offsetTop += editionsSelectorHeight.current;
          }
          
          if (tabsListRef.current) {
            offsetTop += tabsListRef.current.offsetHeight;
          }
          
          // Adicionar um efeito visual de destaque ao cabeçalho
          headerElement.classList.add('bg-primary/10');
          headerElement.style.transition = 'all 0.4s ease';
          headerElement.style.transform = 'scale(1.05)';
          headerElement.style.boxShadow = '0 0 15px rgba(var(--primary), 0.3)';
          
          // Encontrar o título dentro do cabeçalho para destacá-lo
          const titleElement = headerElement.querySelector('h2');
          if (titleElement) {
            titleElement.style.transition = 'all 0.4s ease';
            titleElement.style.textShadow = '0 0 5px rgba(var(--primary), 0.5)';
            titleElement.style.fontSize = '1.3em';  // Aumentar temporariamente o tamanho da fonte
          }
          
          setTimeout(() => {
            headerElement.classList.remove('bg-primary/10');
            headerElement.style.transform = '';
            headerElement.style.boxShadow = '';
            
            if (titleElement) {
              titleElement.style.textShadow = '';
              titleElement.style.fontSize = '';
            }
          }, 1000);
          
          // Rolar para a posição do elemento menos o offset
          const headerRect = headerElement.getBoundingClientRect();
          const targetPosition = window.scrollY + headerRect.top - offsetTop - 20; // 20px extra de margem
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        } else {
          // Fallback: rolar para o topo se não encontrar o elemento
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    }, 150); // Delay para garantir que os elementos estejam renderizados
  }, [isMobile, isSticky, localActiveCategory, editionsSelectorHeight, tabsListRef]);

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

  // Atualizar a forma como navegamos entre categorias para garantir consistência
  const navigateToCategory = (direction: "prev" | "next") => {
    const currentCategoryIndex = categories.findIndex((cat) => cat.id === localActiveCategory)

    if (direction === "prev" && currentCategoryIndex > 0) {
      const prevCategory = categories[currentCategoryIndex - 1]
      
      // Começar a transição visual
      handleCategoryTransition(localActiveCategory, prevCategory.id)
      
      // Atualizar estados logo em seguida
      setLocalActiveCategory(prevCategory.id)
      setActiveCategory(prevCategory.id)
      
      // Dar tempo para os estados serem atualizados antes de tentar rolar
      console.log(`Navegando para categoria anterior: ${prevCategory.id}`);
      setTimeout(() => {
        if (isMobile) {
          // Para mobile, tentar várias abordagens para garantir que o cabeçalho seja visível
          ensureHeaderVisible(prevCategory.id);
        } else {
          // Para desktop, a abordagem atual já funciona bem
          scrollToCategoryTop();
        }
      }, 100);
      
    } else if (direction === "next" && currentCategoryIndex < categories.length - 1) {
      const nextCategory = categories[currentCategoryIndex + 1]
      
      // Começar a transição visual
      handleCategoryTransition(localActiveCategory, nextCategory.id)
      
      // Atualizar estados logo em seguida
      setLocalActiveCategory(nextCategory.id)
      setActiveCategory(nextCategory.id)
      
      // Dar tempo para os estados serem atualizados antes de tentar rolar
      console.log(`Navegando para próxima categoria: ${nextCategory.id}`);
      setTimeout(() => {
        if (isMobile) {
          // Para mobile, tentar várias abordagens para garantir que o cabeçalho seja visível
          ensureHeaderVisible(nextCategory.id);
        } else {
          // Para desktop, a abordagem atual já funciona bem
          scrollToCategoryTop();
        }
      }, 100);
    }
  }

  // Ajuste no comportamento do clique nos seletores de categoria na versão mobile
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === localActiveCategory) return;
    
    // Começar a transição visual
    handleCategoryTransition(localActiveCategory, categoryId);
    
    // Atualizar estados logo em seguida
    setLocalActiveCategory(categoryId);
    setActiveCategory(categoryId);
    
    // Dar tempo para os estados serem atualizados
    console.log(`Clicou na categoria: ${categoryId}`);
    setTimeout(() => {
      if (isMobile) {
        ensureHeaderVisible(categoryId);
      } else {
        scrollToCategoryTop();
      }
    }, 100);
  };

  // Nova função para garantir que o cabeçalho da categoria esteja visível na versão mobile
  const ensureHeaderVisible = useCallback((categoryId: string) => {
    // Esta função foca especificamente em garantir que o cabeçalho esteja visível na versão mobile
    if (!isMobile) return; // Só precisamos disso no mobile
    
    console.log(`Tentando garantir que o cabeçalho da categoria ${categoryId} seja visível`);
    
    // Método alternativo: usar location.hash para forçar o scroll diretamente para o elemento
    // Este é um método mais agressivo, mas pode funcionar quando outros falham
    if (categoryId) {
      const currentHash = window.location.hash;
      
      // Usar um setTimeout para permitir que a renderização ocorra primeiro
      setTimeout(() => {
        // Definir o hash para o ID do cabeçalho
        window.location.hash = `category-header-${categoryId}`;
        
        // Usar um timeout adicional para garantir que o scroll aconteça
        setTimeout(() => {
          // Restaurar o hash original, se necessário
          if (currentHash) {
            history.replaceState(null, '', currentHash);
          } else {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
          
          // Agora proceder com os métodos normais
          proceedWithNormalScrollMethods(categoryId);
        }, 50);
      }, 50);
    } else {
      proceedWithNormalScrollMethods(categoryId);
    }
  }, [isMobile, isSticky]);
  
  // Função para aplicar o destaque visual ao cabeçalho
  const applyHeaderHighlight = useCallback((headerElement: HTMLElement) => {
    headerElement.classList.add('bg-primary/20');
    headerElement.style.transition = 'all 0.4s ease';
    headerElement.style.transform = 'scale(1.05)';
    
    // Destacar o título dentro do cabeçalho
    const titleElement = headerElement.querySelector('h2');
    if (titleElement) {
      titleElement.style.fontSize = '1.3em';
      titleElement.style.color = 'var(--primary)';
      titleElement.style.fontWeight = 'bold';
    }
    
    // Remover os efeitos visuais após um tempo
    setTimeout(() => {
      headerElement.classList.remove('bg-primary/20');
      headerElement.style.transform = '';
      
      if (titleElement) {
        titleElement.style.fontSize = '';
        titleElement.style.color = '';
        titleElement.style.fontWeight = '';
      }
    }, 1200);
  }, []);
  
  // Função auxiliar para separar os métodos "normais" de scroll
  const proceedWithNormalScrollMethods = useCallback((categoryId: string) => {
    // Esperar um momento para garantir que a DOM está atualizada
    setTimeout(() => {
      // Primeiro, vamos garantir que o cabeçalho existe
      const headerElement = document.getElementById(`category-header-${categoryId}`);
      console.log("Elemento do cabeçalho encontrado:", !!headerElement);
      
      if (!headerElement) {
        console.warn(`Cabeçalho da categoria ${categoryId} não encontrado!`);
        return;
      }
      
      if (headerElement && mobileMainContainerRef.current) {
        // Obter a posição do cabeçalho em relação ao viewport
        const headerRect = headerElement.getBoundingClientRect();
        const containerRect = mobileMainContainerRef.current.getBoundingClientRect();
        
        console.log("Posições e dimensões:", {
          header: {
            top: headerRect.top,
            bottom: headerRect.bottom,
            height: headerRect.height,
          },
          container: {
            top: containerRect.top,
            scrollTop: mobileMainContainerRef.current.scrollTop,
          },
          window: {
            scrollY: window.scrollY,
            innerHeight: window.innerHeight,
          }
        });
        
        // Métodos diferentes para garantir que o cabeçalho seja visível
        
        // Método 1: ScrollIntoView direto
        console.log("Aplicando scrollIntoView no cabeçalho");
        headerElement.scrollIntoView({
          behavior: 'auto',
          block: 'start'
        });
        
        // Método 2: Scroll para a posição calculada
        const targetPosition = window.scrollY + headerRect.top - 100; // 100px de offset
        console.log(`Aplicando window.scrollTo para posição ${targetPosition}`);
        window.scrollTo({
          top: targetPosition,
          behavior: 'auto'
        });
        
        // Método 3: Se os métodos anteriores não funcionarem, tentar usando o scroll do container
        if (contentContainerRef.current) {
          console.log("Resetando scrollTop do contentContainer para 0");
          contentContainerRef.current.scrollTop = 0;
        }
        
        // Destacar visualmente o cabeçalho com uma borda mais evidente para debug
        headerElement.style.border = '2px solid var(--primary)';
        
        // Aplicar destaque visual normal
        applyHeaderHighlight(headerElement);
        
        // Remover a borda de debug após um tempo
        setTimeout(() => {
          headerElement.style.border = '';
        }, 1500);
      }
    }, 100);
  }, [applyHeaderHighlight]);

  // Atualizar a função focusCategoryHeader para usar ensureHeaderVisible
  const focusCategoryHeader = useCallback((categoryId: string) => {
    setTimeout(() => {
      if (isMobile) {
        // Para mobile, usamos nossa nova função que garante visibilidade do cabeçalho
        ensureHeaderVisible(categoryId);
      } else {
        // Na versão desktop, continuamos usando scrollToCategoryTop
        scrollToCategoryTop();
      }
    }, 20);
  }, [isMobile, scrollToCategoryTop, ensureHeaderVisible]);

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
                <div className="mb-6 relative" ref={mobileMainContainerRef}>
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
                          onClick={() => handleCategoryClick(category.id)}
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
                  <div 
                    className="mb-3 text-center" 
                    id={`category-header-${currentCategory?.id}`}
                    data-category-header="true"
                    style={{ scrollMarginTop: '120px' }}
                  >
                    <h2 className="text-xl font-bold text-primary mb-1 scroll-mt-20">{currentCategory?.name}</h2>
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
                  <Tabs 
                    value={localActiveCategory} 
                    onValueChange={(newValue) => handleCategoryClick(newValue)} 
                    className="w-full"
                  >
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
                        <div 
                          className="mb-3 text-center" 
                          id={`category-header-${category.id}`}
                          data-category-header="true"
                          style={{ scrollMarginTop: '120px' }}
                        >
                          <h2 className="text-xl font-bold text-primary mb-1 scroll-mt-20">{category.name}</h2>
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