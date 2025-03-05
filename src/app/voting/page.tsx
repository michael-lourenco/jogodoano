"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowLeft, CheckCircle2 } from "lucide-react"
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
import { UserInfo } from "@/components/UserInfo";

interface Game {
  id: string
  title: string
  imageUrl: string
  developer: string
}

interface Category {
  id: string
  name: string
  description: string
  games: Game[]
}

export default function VotingPage() {
  const navigationService = useNavigation()
  const { user, loading, status, handleLogin, handleLogout } = useAuth();

  const [votes, setVotes] = useState<Record<string, string>>({})
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const categories: Category[] = [
    {
      id: "action",
      name: "Melhor Jogo de Ação",
      description: "Jogos com foco em combate, reflexos rápidos e adrenalina",
      games: [
        {
          id: "action1",
          title: "GTA VI",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "action2",
          title: "Ghost of Yotei",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "action3",
          title: "Doom: The Dark Ages",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "action4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "action5",
          title: "Split Fiction",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Hazelight Studios",
        },
      ],
    },
    {
      id: "goty",
      name: "Jogo do Ano",
      description: "O melhor jogo de 2025",
      games: [
        {
          id: "goty1",
          title: "GTA VI",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "goty2",
          title: "Ghost of Yotei",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "goty3",
          title: "Doom: The Dark Ages",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "goty4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "goty5",
          title: "Split Fiction",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Hazelight Studios",
        },
      ],
    },
    {
      id: "rpg",
      name: "Melhor RPG",
      description: "Jogos com elementos de progressão, narrativa profunda e customização",
      games: [
        {
          id: "rpg1",
          title: "GTA VI",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "rpg2",
          title: "Ghost of Yotei",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "rpg3",
          title: "Doom: The Dark Ages",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "rpg4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "rpg5",
          title: "Split Fiction",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Hazelight Studios",
        },
      ],
    },
    {
      id: "indie",
      name: "Melhor Jogo Indie",
      description: "Jogos desenvolvidos por estúdios independentes com ideias inovadoras",
      games: [
        {
          id: "indie1",
          title: "GTA VI",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "indie2",
          title: "Ghost of Yotei",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "indie3",
          title: "Doom: The Dark Ages",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "indie4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "indie5",
          title: "Split Fiction",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Hazelight Studios",
        },
      ],
    },
    {
      id: "narrative",
      name: "Melhor Narrativa",
      description: "Jogos com histórias envolventes, personagens memoráveis e roteiro excepcional",
      games: [
        {
          id: "narrative1",
          title: "GTA VI",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "narrative2",
          title: "Ghost of Yotei",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "narrative3",
          title: "Doom: The Dark Ages",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "narrative4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "narrative5",
          title: "Split Fiction",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Hazelight Studios",
        },
      ],
    },
    {
      id: "multiplayer",
      name: "Melhor Multiplayer",
      description: "Jogos com experiências multijogador excepcionais, cooperativas ou competitivas",
      games: [
        {
          id: "multiplayer1",
          title: "GTA VI",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "multiplayer2",
          title: "Ghost of Yotei",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "multiplayer3",
          title: "Doom: The Dark Ages",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "multiplayer4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "multiplayer5",
          title: "Split Fiction",
          imageUrl: "/placeholder.svg?height=200&width=350",
          developer: "Hazelight Studios",
        },
      ],
    },
  ]

  useEffect(() => {
    if (user && user.votes) {
      setVotes(user.votes);
    } else {
      setVotes({});
    }
  }, [user]);
  
  useEffect(() => {
  
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id)
    }

  }, [activeCategory])

  const handleVote = (categoryId: string, gameId: string) => {
    setVotes((prev) => ({
      ...prev,
      [categoryId]: gameId,
    }))
  }

  const handleSubmitVotes = async () => {
    const allCategoriesVoted = categories.every((category) => votes[category.id])

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
      await updateUserVotes(user.email, votes, dbFirestore);

      setHasVoted(true)
      toast.success("Votação enviada com sucesso!", {
        description: "Obrigado por participar da votação do Jogo do Ano!",
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
                Obrigado por participar da votação do Jogo do Ano. Seus votos foram registrados com sucesso!
              </p>

              <Button
                onClick={handleBackToHome}
                className="mt-6 bg-gradient-to-r from-chart-2 to-green-500 hover:from-chart-2 hover:to-green-400"
              >
                Voltar para a Página Inicial
              </Button>
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
          <UserInfo
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
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
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Vote no seu jogo favorito em cada categoria. Você só pode escolher um jogo por categoria. Após
                selecionar seus favoritos em todas as categorias, clique em "Enviar Votos" para registrar sua
                participação.
              </p>
            </CardContent>
          </Card>

          <div className="block md:hidden mb-6">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="w-full overflow-x-auto flex-wrap justify-start h-auto p-1 bg-muted/20">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className={`flex-shrink-0 ${votes[category.id] ? "text-green-500" : ""}`}
                  >
                    {category.name.split(" ").pop()}
                    {votes[category.id] && <CheckCircle2 className="ml-1 h-3 w-3" />}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-4">
                  <CategorySection category={category} selectedGameId={votes[category.id]} onVote={handleVote} />
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="hidden md:block">
            <div className="space-y-10">
              {categories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  selectedGameId={votes[category.id]}
                  onVote={handleVote}
                />
              ))}
            </div>
          </div>

          <div className="sticky bottom-4 mt-8 mb-4 flex justify-center">
            <Button
              onClick={handleSubmitVotes}
              disabled={isSubmitting || categories.some((cat) => !votes[cat.id])}
              className="w-full max-w-md h-12 text-primary bg-gradient-to-r from-chart-2 to-green-500 hover:from-chart-2 hover:to-green-400 shadow-lg hover:shadow-green-500/25 hover:text-secondary transition-all duration-300"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Processando...
                </div>
              ) : (
                <>Enviar Votos</>
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function CategorySection({
  category,
  selectedGameId,
  onVote,
}: {
  category: Category
  selectedGameId?: string
  onVote: (categoryId: string, gameId: string) => void
}) {
  return (
    <Card className="border border-muted/30 bg-background/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-muted/20">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-xl font-bold text-primary">{category.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
            {category.games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isSelected={selectedGameId === game.id}
                onSelect={() => onVote(category.id, game.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function GameCard({
  game,
  isSelected,
  onSelect,
}: {
  game: Game
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer overflow-hidden transition-all duration-200 h-full ${
          isSelected ? "ring-2 ring-green-500 shadow-lg shadow-green-500/10" : "hover:border-muted/50"
        }`}
        onClick={onSelect}
      >
        <div className="relative aspect-video">
          {game.imageUrl && game.imageUrl.startsWith("http") ? (
            <Image src={game.imageUrl || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <span className="text-white/70 text-sm font-medium">{game.title}</span>
            </div>
          )}
          {isSelected && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold line-clamp-1">{game.title}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">{game.developer}</p>
            {isSelected && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                Selecionado
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

