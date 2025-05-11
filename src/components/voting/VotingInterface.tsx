"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"
import { CheckCircle2 } from "lucide-react"
import { UserInfo } from "@/components/UserInfo"
import { CategorySection } from "@/components/voting/CategorySection"
import { EditionsSelector } from "@/components/voting/EditionsSelector"
import { useVotingInterface } from "@/hooks/useVotingInterface"
import { useCategoryNavigation } from "@/hooks/useCategoryNavigation"
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation"
import { useStickyHeader } from "@/hooks/useStickyHeader"
import { useIsMobile } from "@/hooks/use-mobile"
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

  const { tabsListRef, localActiveCategory, setLocalActiveCategory } = useVotingInterface({
    activeCategory,
    setActiveCategory,
    getCurrentEditionCategories,
    votes,
    selectedEditionId,
  })

  const { categoryRefs } = useCategoryNavigation()

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeNavigation({
    getCurrentEditionCategories,
    localActiveCategory,
    setLocalActiveCategory,
    setActiveCategory,
    categoryRefs,
  })

  const { isSticky, editionsSelectorRef, editionsSelectorHeight, categoryTabsRef, categoryTabsHeight } =
    useStickyHeader()

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

                  {isSticky && categoryTabsRef.current && (
                    <div style={{ height: categoryTabsHeight.current, marginBottom: "1rem" }}></div>
                  )}

                  {/* Swipeable content area */}
                  <div
                    className="border border-muted rounded-md shadow-sm"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="relative overflow-hidden">
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
                          className={`transition-all duration-300 ease-in-out ${
                            localActiveCategory === category.id ? "block opacity-100" : "hidden opacity-0"
                          }`}
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
                    </div>

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

                    {isSticky && <div style={{ height: "3rem", marginBottom: "1rem" }}></div>}

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
