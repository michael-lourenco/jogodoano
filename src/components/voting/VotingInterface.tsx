"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"
import { Trophy, ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react"
import { UserInfo } from "@/components/UserInfo"
import { CategorySection } from "@/components/voting/CategorySection"
import { EditionsSelector } from "@/components/voting/EditionsSelector"
import { UserData } from "@/services/FirebaseService"
import type { VotingEdition, Category } from "@/types/types"
import React, { useRef, useEffect, useState } from "react";
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

const MD_BREAKPOINT = 768; // Corresponde ao breakpoint 'md' do Tailwind

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MD_BREAKPOINT);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < MD_BREAKPOINT);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
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
  const tabsListRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef({});
  const isMobile = useIsMobile();

  useEffect(() => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollLeft = 0;
    }
  }, [getCurrentEditionCategories, votes, selectedEditionId]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex flex-col items-center justify-start pt-4 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <UserInfo user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
          <div className="flex items-center mb-6">
            {/* <Button variant="ghost" size="icon" onClick={handleBackToHome} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button> */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-success text-transparent bg-clip-text flex items-center">
              <Trophy className="mr-2 h-6 w-6 text-chart-1" />
              JOGO DO ANO
            </h1>
          </div>

          <Card className="mb-6 border border-muted bg-card shadow-sm">
            <CardContent className="pt-6 pb-4">
              <p className="text-muted-foreground">
                Vote no seu jogo favorito em cada categoria. Você só pode escolher um jogo por categoria. Após
                selecionar seus favoritos em todas as categorias, clique em "Enviar Votos" para registrar sua
                participação.
              </p>
            </CardContent>
          </Card>

          <EditionsSelector
            editions={editions}
            selectedEditionId={selectedEditionId}
            votes={votes}
            getCurrentEditionCategories={getCurrentEditionCategories}
            onEditionChange={handleEditionChange}
          />

          {selectedEditionId && editions.length > 0 && (
            <>
              {isMobile ? (
                <div className="mb-6">
                  <p className="mb-2 text-sm text-muted-foreground">
                    {Object.keys(votes[selectedEditionId] || {}).length} de {getCurrentEditionCategories().length} categorias votadas
                  </p>
                  <div className="space-y-2">
                    {getCurrentEditionCategories()
                      .map((category) => (
                        <div
                          key={category.id}
                          ref={(el) => (categoryRefs.current[category.id] = el)}
                          className="border border-muted rounded-md shadow-sm"
                        >
                          <button
                            className="flex items-center justify-between w-full p-3 text-sm"
                            onClick={() => {
                              setActiveCategory((prevActiveCategory) =>
                                prevActiveCategory === category.id ? "" : category.id
                              );
                              setTimeout(() => {
                                categoryRefs.current[category.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 100);
                            }}
                          >
                            <span className={`${votes[selectedEditionId]?.[category.id] ? "text-success" : ""}`}>
                              {category.name}
                            </span>
                            {votes[selectedEditionId]?.[category.id] && <CheckCircle2 className="ml-2 h-4 w-4" />}
                            <svg
                              className={`h-4 w-4 transition-transform ${activeCategory === category.id ? "rotate-180" : ""}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {activeCategory === category.id && (
                            <div className="p-4">
                              <CategorySection
                                category={category}
                                selectedGameId={votes[selectedEditionId]?.[category.id]}
                                onVote={handleVoteInUI}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="hidden md:block mb-6">
                  <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                    <TabsList className="w-full overflow-x-auto flex-nowrap scroll-smooth p-1 bg-muted/20">
                      {getCurrentEditionCategories()
                        .slice()
                        .sort((a, b) => {
                          const hasVoteA = Boolean(votes[selectedEditionId]?.[a.id]);
                          const hasVoteB = Boolean(votes[selectedEditionId]?.[b.id]);
                          if (hasVoteA === hasVoteB) {
                            return 0;
                          }
                          return hasVoteA ? 1 : -1;
                        })
                        .map((category) => (
                          <TabsTrigger
                            key={category.id}
                            value={category.id}
                            className={`flex-shrink-0 ${votes[selectedEditionId]?.[category.id] ? "text-success" : ""} px-2 py-1 rounded-md text-sm whitespace-nowrap`}
                          >
                            {category.name.split(" ").pop()}
                            {votes[selectedEditionId]?.[category.id] && <CheckCircle2 className="ml-1 h-3 w-3 inline-block" />}
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