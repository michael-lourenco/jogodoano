"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/hooks/useAuth"
import { Footer } from "@/components/Footer"
import { toast } from "sonner"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { dbFirestore, updateUserVotes } from "@/services/firebase/FirebaseService"
import { UserInfo } from "@/components/UserInfo"
import { votingEditions } from "@/repositories/votingEditions"
import { Game, Category, VotingEdition } from "@/types/types"
import { rehydrateVotingEditions } from "@/utils/utils"
import { ShareResultsDialog } from "@/components/voting/ShareResults";
import { CategorySection } from "@/components/voting/CategorySection"

export default function VotingPage() {
  const navigationService = useNavigation()
  const { user, loading, handleLogin, handleLogout } = useAuth()

  const [editions, setEditions] = useState<VotingEdition[]>([])
  const [selectedEditionId, setSelectedEditionId] = useState<string>("2025")
  const [votes, setVotes] = useState<Record<string, Record<string, string>>>({})
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [votedEditionId, setVotedEditionId] = useState<string>("")
  
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Rehydrate voting editions with game data
    const hydratedEditions = rehydrateVotingEditions(votingEditions)
    setEditions(hydratedEditions)
  }, [])

  useEffect(() => {
    if (!selectedEditionId && editions.length > 0) {
      setSelectedEditionId("2025")
    }
  }, [editions])

  useEffect(() => {
    if (selectedEditionId) {
      const currentEdition = editions.find((edition) => edition.id === selectedEditionId)
      if (currentEdition && currentEdition.categories.length > 0 && !activeCategory) {
        setActiveCategory(currentEdition.categories[0].id)
      }
    }
  }, [selectedEditionId, activeCategory, editions])

  useEffect(() => {
    if (user && user.votes) {
      const votesData = user.votes

      if (votesData && typeof votesData === "object") {
        const isYearFormat = Object.keys(votesData).some((key) => votesData[key] && typeof votesData[key] === "object")

        if (isYearFormat) {
          setVotes(votesData as Record<string, Record<string, string>>)
        } else {
          setVotes({
            "2025": votesData as unknown as Record<string, string>,
          })
        }
      } else {
        setVotes({})
      }
    } else {
      setVotes({})
    }
  }, [user])

  const handleEditionChange = (editionId: string) => {
    setSelectedEditionId(editionId)

    const currentEdition = editions.find((edition) => edition.id === editionId)
    if (currentEdition && currentEdition.categories.length > 0) {
      setActiveCategory(currentEdition.categories[0].id)
    } else {
      setActiveCategory("")
    }
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const scrollAmount = 150;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleVote = (categoryId: string, gameId: string) => {
    setVotes((prev) => ({
      ...prev,
      [selectedEditionId]: {
        ...(prev[selectedEditionId] || {}),
        [categoryId]: gameId,
      },
    }))
  }

  const getCurrentEditionCategories = () => {
    return editions.find((edition) => edition.id === selectedEditionId)?.categories || []
  }

  const handleSubmitVotes = async () => {
    const currentEditionCategories = getCurrentEditionCategories()
    const currentEditionVotes = votes[selectedEditionId] || {}

    const allCategoriesVoted = currentEditionCategories.every((category) => currentEditionVotes[category.id])

    if (!allCategoriesVoted) {
      toast.error("Votação incompleta", {
        description: "Por favor, vote em todas as categorias antes de enviar.",
      })
      return
    }

    if (!user || !user.email) {
      toast.error("Login necessário", {
        description: "Você precisa estar logado para votar.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const updatedVotes = {
        ...votes,
      }

      await updateUserVotes(user.email, updatedVotes, dbFirestore)

      setHasVoted(true)
      setVotedEditionId(selectedEditionId)
      toast.success("Votação enviada com sucesso!", {
        description: `Obrigado por participar da votação do Jogo do Ano de ${selectedEditionId}!`,
      })
    } catch (error) {
      console.error("Erro ao enviar votos:", error)
      toast.error("Erro ao enviar votos", {
        description: "Ocorreu um erro ao processar sua votação. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToHome = () => {
    navigationService.navigateTo("/")
  }

  const handleBackToVoting = () => {
    setHasVoted(false)
    setVotedEditionId("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-primary">
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-background border-none shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </motion.div>

              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-chart-2 to-green-500 text-transparent bg-clip-text">
                Votação Concluída!
              </CardTitle>

              <p className="text-center text-muted-foreground">
                Obrigado por participar da votação do Jogo do Ano de {votedEditionId}. Seus votos foram registrados com
                sucesso!
              </p>

              {/* Componente de compartilhamento integrado */}
              <div className="w-full mt-2">
                <ShareResultsDialog 
                  votes={votes} 
                  editionId={votedEditionId} 
                  categories={editions.find(e => e.id === votedEditionId)?.categories || []}
                  user={user}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button onClick={handleBackToVoting} variant="outline" className="mt-2">
                  Votar em outro ano
                </Button>

                <Button
                  onClick={handleBackToHome}
                  className="mt-2 bg-gradient-to-r from-chart-2 to-green-500 hover:from-chart-2 hover:to-green-400"
                >
                  Voltar para a Página Inicial
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

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

          {/* Year Tabs with Horizontal Scrolling */}
          <div className="relative mb-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-0 z-10 bg-background/80"
                onClick={() => handleScroll('left')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="w-full overflow-hidden px-10">
                <div 
                  ref={tabsContainerRef}
                  className="flex overflow-x-auto scrollbar-hide space-x-2 py-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {editions.map((edition) => (
                    <Button
                      key={edition.id}
                      variant={selectedEditionId === edition.id ? "default" : "outline"}
                      className={`flex-shrink-0 ${
                        selectedEditionId === edition.id 
                          ? "bg-gradient-to-r from-chart-2 to-green-500" 
                          : votes[edition.id] && Object.keys(votes[edition.id]).length > 0 
                            ? "text-green-500 border-green-500/30" 
                            : ""
                      }`}
                      onClick={() => handleEditionChange(edition.id)}
                    >
                      {edition.name}
                      {votes[edition.id] && 
                       getCurrentEditionCategories().length > 0 && 
                       Object.keys(votes[edition.id]).length === getCurrentEditionCategories().length && (
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 z-10 bg-background/80"
                onClick={() => handleScroll('right')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

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
                        onVote={handleVote}
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
                      onVote={handleVote}
                    />
                  ))}
                </div>
              </div>

              <div className="sticky bottom-4 mt-8 mb-4 flex justify-center">
                <Button
                  onClick={handleSubmitVotes}
                  disabled={isSubmitting || getCurrentEditionCategories().some((cat) => !votes[selectedEditionId]?.[cat.id])}
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
