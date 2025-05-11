"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"
import { CheckCircle2 } from "lucide-react"
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

  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleCategoryTransition } = useSwipeNavigation({
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
              {/* Add voting progress component */}
              <VotingProgress
                categories={categories}
                votes={votes[selectedEditionId] || {}}
                editionId={selectedEditionId}
              />

              {isMobile ? (
                <div className="mb-6">
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

                  {/* Swipeable content area */}
                  <div
                    className="border border-muted rounded-md shadow-sm"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    role="region"
                    aria-label="Área de votação"
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
                          role="tabpanel"
                          aria-labelledby={`tab-${category.id}`}
                          tabIndex={localActiveCategory === category.id ? 0 : -1}
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

                    {/* Navigation buttons */}
                    <CategoryNavigation
                      categories={categories}
                      currentCategoryId={localActiveCategory}
                      navigateToCategory={navigateToCategory}
                    />
                  </div>
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
                        <CategorySection
                          category={category}
                          selectedGameId={votes[selectedEditionId]?.[category.id]}
                          onVote={handleVoteInUI}
                        />

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

              <div className="sticky bottom-4 mt-8 mb-4 flex justify-center">
                <Button
                  onClick={handleSubmitVotesInUI}
                  disabled={
                    isSubmitting || getCurrentEditionCategories().some((cat) => !votes[selectedEditionId]?.[cat.id])
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
