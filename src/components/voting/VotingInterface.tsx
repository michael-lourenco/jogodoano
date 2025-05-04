"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/Footer"
import { Trophy, ArrowLeft, CheckCircle2 } from "lucide-react"
import { UserInfo } from "@/components/UserInfo"
import { CategorySection } from "@/components/voting/CategorySection"
import { EditionsSelector } from "@/components/voting/EditionsSelector"
import { UserData } from "@/services/FirebaseService"
import type { VotingEdition, Category } from "@/types/types"

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
  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <UserInfo user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={handleBackToHome} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-2 to-green-500 text-transparent bg-clip-text flex items-center">
              <Trophy className="mr-2 h-6 w-6 text-chart-2" />
              Votação: Jogo do Ano
            </h1>
          </div>

          <Card className="mb-6 border border-muted/30 bg-background/50 shadow-sm">
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
              <div className="block md:hidden mb-6">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                  <TabsList className="w-full overflow-x-auto flex-wrap justify-start h-auto p-1 bg-muted/20">
                    {getCurrentEditionCategories().map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className={`flex-shrink-0 ${votes[selectedEditionId]?.[category.id] ? "text-green-500" : ""}`}
                      >
                        {category.name.split(" ").pop()}
                        {votes[selectedEditionId]?.[category.id] && <CheckCircle2 className="ml-1 h-3 w-3" />}
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

              <div className="hidden md:block">
                <div className="space-y-10">
                  {getCurrentEditionCategories().map((category) => (
                    <CategorySection
                      key={category.id}
                      category={category}
                      selectedGameId={votes[selectedEditionId]?.[category.id]}
                      onVote={handleVoteInUI}
                    />
                  ))}
                </div>
              </div>

              <div className="sticky bottom-4 mt-8 mb-4 flex justify-center">
                <Button
                  onClick={handleSubmitVotesInUI}
                  disabled={
                    isSubmitting || getCurrentEditionCategories().some((cat) => !votes[selectedEditionId]?.[cat.id])
                  }
                  className="w-full max-w-md h-12 text-primary bg-gradient-to-r from-chart-2 to-green-500 hover:from-chart-2 hover:to-green-400 shadow-lg hover:shadow-green-500/25 hover:text-secondary transition-all duration-300"
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
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
