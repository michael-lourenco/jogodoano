"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"
import { CheckCircle2, ArrowRight, Trophy, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
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
import { CategorySelector } from "@/components/voting/CategorySelector"
import { useLocalVotes } from "@/stores/useLocalVotes"
import { CategoryStepper } from "@/components/voting/CategoryStepper"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
  const [footerState, setFooterState] = useState({ height: 64, isExpanded: true })
  
  // Adicionar hook para gerenciar votos locais
  const { setVote, getVotes, clearVotes } = useLocalVotes()

  const { tabsListRef, localActiveCategory, setLocalActiveCategory } = useVotingInterface({
    activeCategory,
    setActiveCategory,
    getCurrentEditionCategories,
    votes,
    selectedEditionId,
  })

  const { categoryRefs } = useCategoryNavigation()
  
  // 1. Primeiro, declaramos a função applyHeaderHighlight que não depende de nada
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
  
  // 2. Em seguida, declaramos proceedWithNormalScrollMethods que depende de applyHeaderHighlight
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
  
  // 3. Por fim, declaramos ensureHeaderVisible que depende de proceedWithNormalScrollMethods
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
  }, [isMobile, proceedWithNormalScrollMethods]);
  
  // 4. Agora podemos usar a função no hook
  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleCategoryTransition, transitionDuration } = useSwipeNavigation({
    getCurrentEditionCategories,
    localActiveCategory,
    setLocalActiveCategory,
    setActiveCategory,
    categoryRefs,
    onCategoryChange: ensureHeaderVisible, // Agora a função já está declarada antes de ser usada
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
  const containerRef = useRef<HTMLDivElement>(null)
  const currentIndex = getCurrentEditionCategories().findIndex(cat => cat.id === localActiveCategory)

  // Função para calcular o índice real considerando o array circular
  const getCircularIndex = (index: number) => {
    const categories = getCurrentEditionCategories()
    return (index + categories.length) % categories.length
  }

  // Array com os 5 índices que queremos mostrar (2 antes, atual, 2 depois)
  const visibleIndices = [
    getCircularIndex(currentIndex - 2),
    getCircularIndex(currentIndex - 1),
    currentIndex,
    getCircularIndex(currentIndex + 1),
    getCircularIndex(currentIndex + 2)
  ]

  // Função para lidar com o evento de wheel
  const handleWheel = (e: WheelEvent) => {
    if (!isMobile) return

    e.preventDefault()
    const delta = Math.sign(e.deltaY)
    
    if (delta > 0) {
      handleCategoryClick(getCurrentEditionCategories()[getCircularIndex(currentIndex + 1)].id)
    } else {
      handleCategoryClick(getCurrentEditionCategories()[getCircularIndex(currentIndex - 1)].id)
    }
  }

  // Adiciona e remove o evento de wheel
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [currentIndex, isMobile])

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

  // Carregar votos locais ao entrar na edição
  useEffect(() => {
    if (selectedEditionId) {
      const localVotes = getVotes(selectedEditionId)
      if (localVotes) {
        // Atualizar o estado local com os votos salvos
        Object.entries(localVotes).forEach(([categoryId, gameId]) => {
          handleVoteInUI(categoryId, gameId as string)
        })
      }
    }
  }, [selectedEditionId, getVotes, handleVoteInUI])

  // Modificar handleGameSelection para salvar votos localmente
  const handleGameSelection = useCallback((categoryId: string, gameId: string) => {
    // Verificar se o voto já está definido para este jogo
    const currentVote = votes[selectedEditionId]?.[categoryId];
    
    // Só atualizar se o voto for diferente
    if (currentVote !== gameId) {
      // Registra o voto no sistema
      handleVoteInUI(categoryId, gameId);
      
      // Salvar voto localmente
      setVote(selectedEditionId, categoryId, gameId, user?.email);
      
      // Atualizar o estado local e a referência
      setSelectedGame(gameId);
      updateSelectedGameRef(categoryId, gameId);
    }
  }, [votes, selectedEditionId, handleVoteInUI, setSelectedGame, updateSelectedGameRef, setVote, user?.email]);

  // Modificar handleSubmitVotesInUI para limpar votos locais após envio bem-sucedido
  const handleSubmitVotesInUIWithCleanup = useCallback(async () => {
    try {
      await handleSubmitVotesInUI();
      // Limpar votos locais após envio bem-sucedido
      clearVotes(selectedEditionId);
    } catch (error) {
      console.error('Erro ao enviar votos:', error);
    }
  }, [handleSubmitVotesInUI, clearVotes, selectedEditionId]);

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

  // Adicionar estado para controlar a animação de saída do botão
  const [isButtonExiting, setIsButtonExiting] = useState(false);

  // Modificar a função navigateToCategory para incluir a animação de saída
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
      
      // Animar a saída do botão antes da transição
      if (isMobile && isNextButtonVisible(localActiveCategory)) {
        setIsButtonExiting(true);
        
        // Esperar a animação terminar antes de mudar de categoria
        setTimeout(() => {
          // Começar a transição visual
          handleCategoryTransition(localActiveCategory, nextCategory.id);
          
          // Atualizar estados logo em seguida
          setLocalActiveCategory(nextCategory.id);
          setActiveCategory(nextCategory.id);
          
          // Resetar o estado do botão
          setIsButtonExiting(false);
          
          // Dar tempo para os estados serem atualizados antes de tentar rolar
          setTimeout(() => {
            if (isMobile) {
              ensureHeaderVisible(nextCategory.id);
            } else {
              scrollToCategoryTop();
            }
          }, 100);
        }, 300); // Tempo igual à duração da animação slide-down
      } else {
        // Comportamento padrão (sem animação)
        handleCategoryTransition(localActiveCategory, nextCategory.id);
        setLocalActiveCategory(nextCategory.id);
        setActiveCategory(nextCategory.id);
        
        setTimeout(() => {
          if (isMobile) {
            ensureHeaderVisible(nextCategory.id);
          } else {
            scrollToCategoryTop();
          }
        }, 100);
      }
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

  // Adicionar um efeito para calcular e atualizar a altura do seletor de edições
  useEffect(() => {
    if (editionsSelectorRef.current && isSticky) {
      const height = editionsSelectorRef.current.offsetHeight;
      document.documentElement.style.setProperty('--editions-height', `${height}px`);
    }
  }, [isSticky]);

  // Efeito para observar o estado do footer
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return

    const observer = new MutationObserver(() => {
      const isExpanded = footer.classList.contains('h-16')
      setFooterState({
        height: footer.offsetHeight,
        isExpanded
      })
    })

    observer.observe(footer, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Configurar estado inicial
    setFooterState({
      height: footer.offsetHeight,
      isExpanded: footer.classList.contains('h-16')
    })

    return () => observer.disconnect()
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
        <main className="flex-grow flex flex-col items-center justify-start pt-4 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <UserInfo user={user} handleLogin={handleLogin} handleLogout={handleLogout} />

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
                {/* Progress bar showing voting completion - apenas para desktop */}
                {!isMobile && (
                  <VotingProgress
                    categories={categories}
                    votes={votes[selectedEditionId] || {}}
                    editionId={selectedEditionId}
                  />
                )}

                {isMobile ? (
                  <div className="mb-6 relative" ref={mobileMainContainerRef}>
                    {/* Category selector tabs */}
                    <div
                      ref={categoryTabsRef}
                      className={cn(
                        "relative",
                        isSticky 
                          ? "fixed top-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-b border-muted shadow-sm mt-[var(--editions-height,0px)]" 
                          : "mb-4"
                      )}
                    >
                      <div className={cn(
                        "relative flex items-center justify-center py-2",
                        isSticky ? "max-w-4xl mx-auto" : ""
                      )}>
                        {/* Botão Anterior */}
                        <button
                          onClick={() => handleCategoryClick(getCurrentEditionCategories()[getCircularIndex(currentIndex - 1)].id)}
                          className={cn(
                            "absolute left-0 z-20 rounded-full hover:bg-muted/50 transition-colors",
                            isMobile ? "p-1" : "p-1.5"
                          )}
                          aria-label="Categoria anterior"
                        >
                          <ChevronLeft className={cn(isMobile ? "w-4 h-4" : "w-5 h-5")} />
                        </button>

                        {/* Container do Carrossel */}
                        <div 
                          ref={containerRef}
                          className={cn(
                            "relative w-full overflow-hidden",
                            isMobile ? "max-w-[240px]" : "max-w-[280px]"
                          )}
                        >
                          <div className="flex items-center justify-center gap-0.5">
                            {visibleIndices.map((index, position) => {
                              const category = getCurrentEditionCategories()[index]
                              const isActive = category.id === localActiveCategory
                              const isVoted = votes[selectedEditionId]?.[category.id]

                              return (
                                <motion.button
                                  key={category.id}
                                  onClick={() => handleCategoryClick(category.id)}
                                  className={cn(
                                    "relative flex items-center justify-center transition-all duration-200 group",
                                    isMobile ? "w-5 h-5" : "w-8 h-8"
                                  )}
                                  initial={false}
                                  animate={{
                                    scale: isActive ? 1.1 : 1,
                                    opacity: isActive ? 1 : 0.7,
                                    x: `${(position - 2) * (isMobile ? 20 : 32)}px`
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant={isActive ? "default" : "outline"}
                                    className={cn(
                                      "transition-all duration-200",
                                      isMobile 
                                        ? "w-[90px] h-7 text-xs px-2" 
                                        : "w-[120px] h-8 text-sm",
                                      isActive
                                        ? "bg-gradient-to-r from-chart-2 to-chart-5 text-primary-foreground shadow-lg"
                                        : isVoted
                                          ? "text-success border-success/30 hover:border-success/50"
                                          : "hover:bg-muted/50"
                                    )}
                                  >
                                    <span className="truncate">{category.name.split(" ").pop()}</span>
                                    {isVoted && (
                                      <CheckCircle2 className={cn(
                                        "ml-1 flex-shrink-0",
                                        isMobile ? "h-2.5 w-2.5" : "h-3 w-3"
                                      )} />
                                    )}
                                  </Button>
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Botão Próximo */}
                        <button
                          onClick={() => handleCategoryClick(getCurrentEditionCategories()[getCircularIndex(currentIndex + 1)].id)}
                          className={cn(
                            "absolute right-0 z-20 rounded-full hover:bg-muted/50 transition-colors",
                            isMobile ? "p-1" : "p-1.5"
                          )}
                          aria-label="Próxima categoria"
                        >
                          <ChevronRight className={cn(isMobile ? "w-4 h-4" : "w-5 h-5")} />
                        </button>
                      </div>
                    </div>

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
                      className="border border-muted rounded-md shadow-sm mb-32"
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

                      {/* Container para progresso e botão */}
                      <div 
                        className="sticky left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-muted transition-all duration-300"
                        style={{
                          bottom: footerState.isExpanded ? '4rem' : '1rem',
                          marginBottom: '0',
                          zIndex: footerState.isExpanded ? 20 : 50
                        }}
                      >
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
                            <Button
                              onClick={handleSubmitVotesInUIWithCleanup}
                              disabled={isSubmitting || !isAllCategoriesVoted()}
                              className="flex-1 h-10 text-primary-foreground bg-gradient-to-r from-chart-1 to-success hover:from-chart-1 hover:to-success-foreground shadow-lg hover:shadow-success/25 hover:text-secondary-foreground transition-all duration-300"
                              aria-live="polite"
                            >
                              {isSubmitting ? (
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
                        />
                        
                        {/* Adicionar o CategoryStepper */}
                        <CategoryStepper
                          categories={categories}
                          currentCategoryId={localActiveCategory}
                          onStepClick={handleCategoryClick}
                          votes={votes[selectedEditionId] || {}}
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
                          />
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
      </div>
    </>
  )
}