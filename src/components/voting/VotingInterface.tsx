"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"
import { CheckCircle2 } from "lucide-react"
import { UserInfo } from "@/components/UserInfo"
import { CategorySection } from "@/components/voting/CategorySection"
import { EditionsSelector } from "@/components/voting/EditionsSelector"
import type { UserData } from "@/services/FirebaseService"
import type { VotingEdition, Category } from "@/types/types"
import { useRef, useEffect, useState } from "react"
import type { TouchEvent } from "react"
// Definindo o tipo para os votos por categoria
export type CategoryVotes = Record<string, string>

interface VotingInterfaceProps {
  user: UserData | null
  editions: VotingEdition[]
  selectedEditionId: string
  activeCategory: string
  votes: Record<string, CategoryVotes>
  isSubmitting: boolean
  getCurrentEditionCategories: () => Category[]
  handleLogin: () => void
  handleLogout: () => void
  handleBackToHome: () => void
  handleEditionChange: (editionId: string) => void
  setActiveCategory: (categoryId: string) => void
  handleVoteInUI: (categoryId: string, gameId: string) => void
  handleSubmitVotesInUI: () => Promise<void>
}

const MD_BREAKPOINT = 768 // Corresponde ao breakpoint 'md' do Tailwind

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MD_BREAKPOINT)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < MD_BREAKPOINT)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}

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
  const tabsListRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const isMobile = useIsMobile()
  const [isSticky, setIsSticky] = useState(false)
  const editionsSelectorRef = useRef<HTMLDivElement>(null)
  const editionsSelectorHeight = useRef<number>(0)
  const originalTopOffset = useRef<number | null>(null)
  const [localActiveCategory, setLocalActiveCategory] = useState<string>(activeCategory)

  useEffect(() => {
    setLocalActiveCategory(activeCategory)
  }, [activeCategory])

  useEffect(() => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollLeft = 0
    }
  }, [getCurrentEditionCategories, votes, selectedEditionId])

  useEffect(() => {
    const handleScroll = () => {
      if (editionsSelectorRef.current) {
        const scrollPosition = window.scrollY
        const selectorRect = editionsSelectorRef.current.getBoundingClientRect()

        if (!originalTopOffset.current && selectorRect.top >= 0) {
          originalTopOffset.current = selectorRect.top + scrollPosition
          editionsSelectorHeight.current = selectorRect.height
        }

        if (originalTopOffset.current) {
          setIsSticky(scrollPosition > originalTopOffset.current)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Initial calculation after render
    queueMicrotask(() => {
      if (editionsSelectorRef.current) {
        const selectorRect = editionsSelectorRef.current.getBoundingClientRect()
        originalTopOffset.current = selectorRect.top + window.scrollY
        editionsSelectorHeight.current = selectorRect.height
      }
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Swipe handling logic
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const swipeThreshold = 50 // Minimum distance required for a swipe

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > swipeThreshold
    const isRightSwipe = distance < -swipeThreshold

    if (isLeftSwipe || isRightSwipe) {
      const categories = getCurrentEditionCategories()
      const currentIndex = categories.findIndex((cat) => cat.id === localActiveCategory)

      if (currentIndex !== -1) {
        let newIndex

        if (isLeftSwipe && currentIndex < categories.length - 1) {
          // Swipe left to go to next category
          newIndex = currentIndex + 1
        } else if (isRightSwipe && currentIndex > 0) {
          // Swipe right to go to previous category
          newIndex = currentIndex - 1
        }

        if (newIndex !== undefined) {
          const newCategory = categories[newIndex]
          setLocalActiveCategory(newCategory.id)
          setActiveCategory(newCategory.id)

          // Scroll the category into view
          setTimeout(() => {
            categoryRefs.current[newCategory.id]?.scrollIntoView({ behavior: "smooth", block: "start" })
          }, 100)
        }
      }
    }
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
              {isMobile ? (
                <div className="mb-6">
                  <p className="mb-2 text-sm text-muted-foreground">
                    {Object.keys(votes[selectedEditionId] || {}).length} de {getCurrentEditionCategories().length}{" "}
                    categorias votadas
                  </p>

                  {/* Category selector tabs */}
                  <div className="overflow-x-auto mb-4">
                    <div className="flex space-x-2 p-1">
                      {getCurrentEditionCategories().map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setLocalActiveCategory(category.id)
                            setActiveCategory(category.id)
                          }}
                          className={`px-3 py-2 text-sm whitespace-nowrap rounded-md flex items-center ${
                            localActiveCategory === category.id ? "bg-primary text-primary-foreground" : "bg-muted/30"
                          } ${votes[selectedEditionId]?.[category.id] ? "text-success" : ""}`}
                        >
                          {category.name.split(" ").pop()}
                          {votes[selectedEditionId]?.[category.id] && (
                            <CheckCircle2 className="ml-1 h-3 w-3 inline-block" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Swipeable content area */}
                  <div
                    className="border border-muted rounded-md shadow-sm"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {getCurrentEditionCategories().map((category) => (
                      <div
                        key={category.id}
                        ref={(el) => {
                          if (el) {
                            categoryRefs.current[category.id] = el
                          } else {
                            delete categoryRefs.current[category.id]
                          }
                        }}
                        className={`${localActiveCategory === category.id ? "block" : "hidden"}`}
                      >
                        <div className="p-4">
                          <CategorySection
                            category={category}
                            selectedGameId={votes[selectedEditionId]?.[category.id]}
                            onVote={handleVoteInUI}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Swipe indicator */}
                    <div className="flex justify-center items-center p-2 text-xs text-muted-foreground">
                      <span>← Deslize para navegar entre categorias →</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Desktop view remains unchanged
                <div className="hidden md:block mb-6">
                  <Tabs value={localActiveCategory} onValueChange={setLocalActiveCategory} className="w-full">
                    <TabsList
                      ref={tabsListRef}
                      className="w-full overflow-x-auto flex-nowrap scroll-smooth p-1 bg-muted/20"
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
                            value={category.id}
                            className={`flex-shrink-0 ${
                              votes[selectedEditionId]?.[category.id] ? "text-success" : ""
                            } px-2 py-1 rounded-md text-sm whitespace-nowrap`}
                          >
                            {category.name.split(" ").pop()}
                            {votes[selectedEditionId]?.[category.id] && (
                              <CheckCircle2 className="ml-1 h-3 w-3 inline-block" />
                            )}
                          </TabsTrigger>
                        ))}
                    </TabsList>

                    {getCurrentEditionCategories().map((category) => (
                      <TabsContent key={category.id} value={category.id} className="mt-4">
                        <CategorySection
                          category={category}
                          selectedGameId={votes[selectedEditionId]?.[category.id]}
                          onVote={handleVoteInUI}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}

              <div className="sticky bottom-4 mt-8 mb-4 flex justify-center">
                <Button
                  onClick={handleSubmitVotesInUI}
                  disabled={
                    isSubmitting || getCurrentEditionCategories().some((cat) => !votes[selectedEditionId]?.[cat.id])
                  }
                  className="w-full max-w-md h-12 text-primary-foreground bg-gradient-to-r from-chart-1 to-success hover:from-chart-1 hover:to-success-foreground shadow-lg hover:shadow-success/25 hover:text-secondary-foreground transition-all duration-300"
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin mr-2"></div>
                      Processando...
                    </div>
                  ) : (
                    <>Enviar Votos de {selectedEditionId}</>
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
//ux