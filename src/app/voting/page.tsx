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
      id: "goty",
      name: "Jogo do Ano",
      description: "O melhor jogo de 2025",
      games: [
        {
          id: "goty1",
          title: "GTA VI",
          imageUrl: "/gta-vi.jpg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "goty2",
          title: "Ghost of Yotei",
          imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "goty3",
          title: "Doom: The Dark Ages",
          imageUrl: "/doom-dark-ages.jpg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "goty4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "goty5",
          title: "Split Fiction",
          imageUrl: "/split-fiction.jpg?height=200&width=350",
          developer: "Hazelight Studios",
        },
        {
          id: "goty6",
          title: "Borderlands 4",
          imageUrl: "/borderlands-4.png?height=200&width=350",
          developer: "Gearbox Software",
        },
        {
          id: "goty7",
          title: "The First Berserker Khazan",
          imageUrl: "/berserker-khazan.jpg?height=200&width=350",
          developer: "Neople",
        },
      ],
    },
    {
      id: "sportsracing",
      name: "Melhores Esportes/Corridas",
      description: "Para os melhores jogos de corrida e esportes tradicionais e não tradicionais.",
      games: [
        {
          id: "sportsracing1",
          title: "WWE 2K25",
          imageUrl: "/wwe2k25.png?height=200&width=350",
          developer: "Visual Concepts",
        },
      ],
    },
    {
      id: "simstrategy",
      name: "Melhor Simulador/Estratégia",
      description: "Melhor jogo focado em simulação em tempo real ou por turnos ou jogabilidade de estratégia, independentemente da plataforma.",
      games: [
        {
          id: "simstrategy1",
          title: "Sid Meier’s Civilization 7",
          imageUrl: "/sid-meiers-civilization-7.jpg?height=200&width=350",
          developer: "Firaxis Games",
        },
      ],
    },
    {
      id: "fighting",
      name: "Melhor jogo de Luta",
      description: "Para o melhor jogo projetado principalmente em torno do combate corpo a corpo.",
      games: [
        {
          id: "fighting1",
          title: "Fatal Fury: City of Wolves",
          imageUrl: "/fatal-fury-city-of-wolves.jpg?height=200&width=350",
          developer: "SNK",
        },
      ],
    },
    {
      id: "audiodesign",
      name: "Melhor Design de Áudio",
      description: "Reconhecendo o melhor áudio e design de som do jogo.",
      games: [
        {
          id: "audiodesign1",
          title: "GTA VI",
          imageUrl: "/gta-vi.jpg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "audiodesign2",
          title: "Ghost of Yotei",
          imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "audiodesign3",
          title: "Doom: The Dark Ages",
          imageUrl: "/doom-dark-ages.jpg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "audiodesign4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "audiodesign5",
          title: "Split Fiction",
          imageUrl: "/split-fiction.jpg?height=200&width=350",
          developer: "Hazelight Studios",
        },
        {
          id: "audiodesign6",
          title: "Borderlands 4",
          imageUrl: "/borderlands-4.png?height=200&width=350",
          developer: "Gearbox Software",
        },
      ],
    },
    {
      id: "scoreandmusic",
      name: "Melhor Trilha Sonora e Música",
      description: "Para música excepcional, incluindo trilha sonora, música original e/ou trilha sonora licenciada",
      games: [
        {
          id: "scoreandmusic1",
          title: "GTA VI",
          imageUrl: "/gta-vi.jpg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "scoreandmusic2",
          title: "Ghost of Yotei",
          imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "scoreandmusic3",
          title: "Doom: The Dark Ages",
          imageUrl: "/doom-dark-ages.jpg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "scoreandmusic4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "scoreandmusic5",
          title: "Split Fiction",
          imageUrl: "/split-fiction.jpg?height=200&width=350",
          developer: "Hazelight Studios",
        },
        {
          id: "scoreandmusic6",
          title: "Borderlands 4",
          imageUrl: "/borderlands-4.png?height=200&width=350",
          developer: "Gearbox Software",
        },
      ],
    },
    {
      id: "artdirection",
      name: "Melhor Direção de Arte",
      description: "Por realizações criativas e/ou técnicas excepcionais em design artístico e animação",
      games: [
        {
          id: "artdirection1",
          title: "GTA VI",
          imageUrl: "/gta-vi.jpg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "artdirection2",
          title: "Ghost of Yotei",
          imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "artdirection3",
          title: "Doom: The Dark Ages",
          imageUrl: "/doom-dark-ages.jpg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "artdirection4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "artdirection5",
          title: "Split Fiction",
          imageUrl: "/split-fiction.jpg?height=200&width=350",
          developer: "Hazelight Studios",
        },
        {
          id: "artdirection6",
          title: "Borderlands 4",
          imageUrl: "/borderlands-4.png?height=200&width=350",
          developer: "Gearbox Software",
        },
      ],
    },
    {
      id: "direction",
      name: "Melhor Direção",
      description: "Premiado por excelente visão criativa e inovação em direção e design de jogos",
      games: [
        {
          id: "direction1",
          title: "GTA VI",
          imageUrl: "/gta-vi.jpg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "direction2",
          title: "Ghost of Yotei",
          imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "direction3",
          title: "Doom: The Dark Ages",
          imageUrl: "/doom-dark-ages.jpg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "direction4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "direction5",
          title: "Split Fiction",
          imageUrl: "/split-fiction.jpg?height=200&width=350",
          developer: "Hazelight Studios",
        },
        {
          id: "direction6",
          title: "Borderlands 4",
          imageUrl: "/borderlands-4.png?height=200&width=350",
          developer: "Gearbox Software",
        },
      ],
    },
    {
      id: "gotybr",
      name: "Jogo do Ano BR",
      description: "O melhor jogo brasileiro de 2025",
      games: [
        {
          id: "gotybr1",
          title: "Mark of the Deep",
          imageUrl: "/mark-of-the-deep.jpg?height=200&width=350",
          developer: "Mad Mimic",
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
          title: "Ghost of Yotei",
          imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "rpg2",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "rpg3",
          title: "Borderlands 4",
          imageUrl: "/borderlands-4.png?height=200&width=350",
          developer: "Gearbox Software",
        },
        {
          id: "rpg4",
          title: "Avowed",
          imageUrl: "/avowed.png?height=200&width=350",
          developer: "Obsidian",
        },
        {
          id: "rpg5",
          title: "Assasin’s Creed Shadows",
          imageUrl: "/assassins-creed-shadows.png?height=200&width=350",
          developer: "Ubisoft",
        },
        {
          id: "rpg6",
          title: "Monster Hunter Wilds",
          imageUrl: "/monster-hunter-wilds.png?height=200&width=350",
          developer: "Capcom",
        },
        {
          id: "rpg7",
          title: "Kingdom Come: Deliverance 2",
          imageUrl: "/kingdom-come-deliverance-2.jpg?height=200&width=350",
          developer: "Warhorse Studios",
        },
        {
          id: "rpg8",
          title: "Expedition 33",
          imageUrl: "/expedition-33.jpg?height=200&width=350",
          developer: "Sandfall Interactive",
        },
        {
          id: "rpg8",
          title: "Dragon Age The Veil Guard",
          imageUrl: "/dragon-age-the-veilguard.png?height=200&width=350",
          developer: "Bioware",
        },
        {
          id: "rpg9",
          title: "The First Berserker Khazan",
          imageUrl: "/berserker-khazan.jpg?height=200&width=350",
          developer: "Neople",
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
          title: "Mark of the Deep",
          imageUrl: "/mark-of-the-deep.jpg?height=200&width=350",
          developer: "Mad Mimic",
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
          title: "Marvel Rivals",
          imageUrl: "/marvel-rivals.png?height=200&width=350",
          developer: "NetEase",
        },
      ],
    },
    {
      id: "action",
      name: "Melhor Jogo de Ação",
      description: "Jogos com foco em combate, reflexos rápidos e adrenalina",
      games: [
        {
          id: "action1",
          title: "GTA VI",
          imageUrl: "/gta-vi.jpg?height=200&width=350",
          developer: "RockStar",
        },
        {
          id: "action2",
          title: "Ghost of Yotei",
          imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
          developer: "Sucker Punch Productions",
        },
        {
          id: "action3",
          title: "Doom: The Dark Ages",
          imageUrl: "/doom-dark-ages.jpg?height=200&width=350",
          developer: "Id Software / Bethesda Softworks",
        },
        {
          id: "action4",
          title: "Like a Dragon: Pirate Yakuza in Hawaii",
          imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
          developer: "Ryu Ga Gotoku Studio, Sega",
        },
        {
          id: "action5",
          title: "Split Fiction",
          imageUrl: "/split-fiction.jpg?height=200&width=350",
          developer: "Hazelight Studios",
        },
        {
          id: "action6",
          title: "Borderlands 4",
          imageUrl: "/borderlands-4.png?height=200&width=350",
          developer: "Gearbox Software",
        },
        {
          id: "action9",
          title: "Rise Of The Ronin",
          imageUrl: "/rise-of-the-ronin.jpg?height=200&width=350",
          developer: "Team Ninja, Koei Tecmo Games",
        },
        {
          id: "action10",
          title: "Avowed",
          imageUrl: "/avowed.png?height=200&width=350",
          developer: "Obsidian",
        },
        {
          id: "action11",
          title: "Assasin’s Creed Shadows",
          imageUrl: "/assassins-creed-shadows.png?height=200&width=350",
          developer: "Ubisoft",
        },
        {
          id: "action12",
          title: "Hades II",
          imageUrl: "/hades-2.png?height=200&width=350",
          developer: "Supergiant Games",
        },
        {
          id: "action13",
          title: "Monster Hunter Wilds",
          imageUrl: "/monster-hunter-wilds.png?height=200&width=350",
          developer: "Capcom",
        },
        {
          id: "action14",
          title: "Indiana Jones and the Great Circle",
          imageUrl: "/indiana-jones.jpg?height=200&width=350",
          developer: "MachineGames",
        },
        {
          id: "action16",
          title: "Kingdom Come: Deliverance 2",
          imageUrl: "/kingdom-come-deliverance-2.jpg?height=200&width=350",
          developer: "Warhorse Studios",
        },
        {
          id: "action17",
          title: "Expedition 33",
          imageUrl: "/expedition-33.jpg?height=200&width=350",
          developer: "Sandfall Interactive",
        },
        {
          id: "action18",
          title: "Citizen Sleeper 2: Starward Vector",
          imageUrl: "/citizen-sleeper-2.jpg?height=200&width=350",
          developer: "Jump Over The Age",
        },
        {
          id: "action19",
          title: "Ender Magnolia: Bloom in the Mist",
          imageUrl: "/ender-magnolia.jpg?height=200&width=350",
          developer: "Adglobe, Live Wire Inc.",
        },
        {
          id: "action20",
          title: "Little Nightmares 3",
          imageUrl: "/little-nightmares-3.jpg?height=200&width=350",
          developer: "Supermassive Games",
        },
        {
          id: "action21",
          title: "Metroid Prime 4: Beyond",
          imageUrl: "/metroid-prime-4.png?height=200&width=350",
          developer: "Retro Studios, Nintendo",
        },
        {
          id: "action22",
          title: "Mafia: The Old Country",
          imageUrl: "/mafia-the-old-country.png?height=200&width=350",
          developer: "Hangar 13",
        },
      ],
    },
    {
      id: "contentcreator",
      name: "Criador de Conteúdo",
      description: "Para um streamer ou criador de conteúdo que causou um impacto importante e positivo na comunidade em 2025.",
      games: [
        // {
        //   id: "contentcreator1",
        //   title: "GTA VI",
        //   imageUrl: "/gta-vi.jpg?height=200&width=350",
        //   developer: "RockStar",
        // },
      ],
    },
    {
      id: "mostantecipated",
      name: "Jogo Mais Aguardado",
      description: "Reconhecendo um jogo anunciado que demonstrou potencial para impulsionar o meio de jogo.",
      games: [
        // {
        //   id: "mostantecipated1",
        //   title: "GTA VI",
        //   imageUrl: "/gta-vi.jpg?height=200&width=350",
        //   developer: "RockStar",
        // },
      ],
    },
    {
      id: "adaptation",
      name: "Melhor Adaptação",
      description: "Reconhecendo o trabalho criativo excepcional que adapta fiel e autenticamente um videogame a outro meio de entretenimento.",
      games: [
        // {
        //   id: "adaptation1",
        //   title: "GTA VI",
        //   imageUrl: "/gta-vi.jpg?height=200&width=350",
        //   developer: "RockStar",
        // },
      ],
    },
    {
      id: "mobilegame",
      name: "Melhor jogo para celular",
      description: "Para o melhor jogo jogável em um dispositivo móvel.",
      games: [
        // {
        //   id: "mobilegame1",
        //   title: "GTA VI",
        //   imageUrl: "/gta-vi.jpg?height=200&width=350",
        //   developer: "RockStar",
        // },
      ],
    },
    {
      id: "communitysupport",
      name: "Best Community Support",
      description: "Reconhecer um jogo pelo excelente suporte da comunidade, transparência e capacidade de resposta, incluindo atividades nas redes sociais e atualizações/patches do jogo.",
      games: [
        // {
        //   id: "communitysupport1",
        //   title: "GTA VI",
        //   imageUrl: "/gta-vi.jpg?height=200&width=350",
        //   developer: "RockStar",
        // },
      ],
    },
    {
      id: "ongoing",
      name: "Best Ongoing",
      description: "Concedido a um jogo pelo desenvolvimento excepcional de conteúdo contínuo que evolui a experiência do jogador ao longo do tempo.",
      games: [
        // {
        //   id: "ongoing1",
        //   title: "GTA VI",
        //   imageUrl: "/gta-vi.jpg?height=200&width=350",
        //   developer: "RockStar",
        // },
      ],
    },
    {
      id: "gamesforimpact",
      name: "Jogos Transformadores",
      description: "Para um jogo instigante com um significado ou mensagem pró-social.",
      games: [
        // {
        //   id: "gamesforimpact1",
        //   title: "GTA VI",
        //   imageUrl: "/gta-vi.jpg?height=200&width=350",
        //   developer: "RockStar",
        // },
      ],
    },
    {
      id: "innovationinaccessibility",
      name: "Inovação em Acessibilidade",
      description: "Reconhecer software e/ou hardware que está impulsionando o meio ao adicionar recursos, tecnologia e conteúdo para ajudar os jogos a serem jogados e apreciados por um público ainda maior.",
      games: [
        // {
        //   id: "innovationinaccessibility1",
        //   title: "GTA VI",
        //   imageUrl: "/gta-vi.jpg?height=200&width=350",
        //   developer: "RockStar",
        // },
      ],
    },
    {
      id: "family",
      name: "Melhor jogo para Família",
      description: "Para o melhor jogo apropriado para jogar em família, independentemente do gênero ou plataforma.",
      games: [
        // {
        //   id: "family1",
        //   title: "GTA VI",
        //   imageUrl: "/gta-vi.jpg?height=200&width=350",
        //   developer: "RockStar",
        // },
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
  const imageUrl = game.imageUrl ? game.imageUrl.split("?")[0] : "/placeholder.svg"

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer overflow-hidden transition-all duration-200 h-full ${
          isSelected ? "ring-2 ring-green-500 shadow-lg shadow-green-500/10" : "hover:border-muted/50"
        }`}
        onClick={onSelect}
      >
        <div className="relative aspect-video">
          {game.imageUrl ? (
            <Image src={game.imageUrl || "/placeholder.svg"} alt={game.title} fill className="object-cover" unoptimized  />
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

