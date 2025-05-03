"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Share2, Twitter, Facebook, Linkedin, Copy, Image as ImageIcon } from "lucide-react"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/hooks/useAuth"
import { Footer } from "@/components/Footer"
import { toast } from "sonner"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { dbFirestore, updateUserVotes, UserData } from "@/services/firebase/FirebaseService"
import { UserInfo } from "@/components/UserInfo"
import { votingEditions } from "@/repositories/votingEditions"
import { Game, Category, VotingEdition } from "@/types/types"
import { rehydrateVotingEditions } from "@/utils/utils"
import html2canvas from 'html2canvas'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function VotingPage() {
  const navigationService = useNavigation()
  const { user, loading, status, handleLogin, handleLogout } = useAuth()

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
            {category.games?.map((game) => (
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
            <Image
              src={game.imageUrl || "/placeholder.svg"}
              alt={game.title}
              fill
              className="object-cover"
              unoptimized
            />
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

interface ShareResultsDialogProps {
  votes: Record<string, Record<string, string>>;
  editionId: string;
  categories: Category[];
  user: UserData | null;
}

// Componente de compartilhamento integrado com abas para diferentes formas de compartilhamento
function ShareResultsDialog({ votes, editionId, categories, user }: ShareResultsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-chart-2 to-green-500 hover:from-chart-2 hover:to-green-400">
          <Share2 className="mr-2 h-5 w-5" />
          Compartilhar Resultados
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar seus votos</DialogTitle>
          <DialogDescription>
            Escolha como deseja compartilhar seus resultados
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="social" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="image">Imagem</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="mt-4">
            <SocialShareTab votes={votes} editionId={editionId} categories={categories} />
          </TabsContent>
          
          <TabsContent value="image" className="mt-4">
            <ImageShareTab votes={votes} editionId={editionId} categories={categories} user={user} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface SocialShareTabProps {
  votes: Record<string, Record<string, string>>;
  editionId: string;
  categories: Category[];
}
// Componente para compartilhamento em redes sociais
function SocialShareTab({ votes, editionId, categories }: SocialShareTabProps) {
  const [copied, setCopied] = useState(false);
  
  // Prepare a URL para compartilhamento (assumindo que você tem uma URL de base)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/results?edition=${editionId}`;
  
  // Prepare o texto de compartilhamento
  const getShareText = () => {
    let text = `Confira meus votos para o Jogo do Ano ${editionId}:\n\n`;
    
    if (categories && votes[editionId]) {
      categories.forEach(category => {
        const gameId = votes[editionId][category.id];
        if (gameId) {
          const game = category.games?.find(g => g.id === gameId);
          if (game) {
            text += `${category.name}: ${game.title}\n`;
          }
        }
      });
    }
    
    text += `\nVeja mais em ${shareUrl}`;
    return encodeURIComponent(text);
  };
  
  const shareText = getShareText();
  
  // URLs para compartilhamento
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${shareText}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  
  // Função para copiar o link
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copiado para a área de transferência!");
    }).catch(err => {
      console.error('Falha ao copiar: ', err);
      toast.error("Erro ao copiar o link");
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Meus votos para o Jogo do Ano ${editionId}`,
        text: decodeURIComponent(shareText),
        url: shareUrl,
      }).catch(err => console.log('Erro ao compartilhar:', err));
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-medium">Compartilhar em:</p>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" onClick={() => window.open(twitterUrl, '_blank')}>
                  <Twitter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Twitter</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" onClick={() => window.open(facebookUrl, '_blank')}>
                  <Facebook className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Facebook</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" onClick={() => window.open(linkedinUrl, '_blank')}>
                  <Linkedin className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>LinkedIn</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {typeof navigator.share === 'function' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Compartilhar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">Link</Label>
          <Input
            id="link"
            defaultValue={shareUrl}
            readOnly
            className="h-9"
          />
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="px-3" 
          onClick={copyToClipboard}
        >
          <span className="sr-only">Copiar</span>
          {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="border rounded-md p-3">
        <p className="text-sm font-medium mb-2">Prévia:</p>
        <ScrollArea className="h-36">
          <div className="text-sm whitespace-pre-wrap text-muted-foreground">
            {decodeURIComponent(shareText)}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

interface ImageShareTabProps {
  votes: Record<string, Record<string, string>>;
  editionId: string;
  categories: Category[];
  user: UserData | null;
}
// Componente para compartilhar como imagem
function ImageShareTab({ votes, editionId, categories, user }:ImageShareTabProps) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const resultsRef = useRef(null);
  
  // Função para gerar e baixar a imagem
  const generateImage = async () => {
    if (!resultsRef.current) return;
    
    setGeneratingImage(true);
    
    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        backgroundColor: '#0F121A', // Ajuste para o fundo da sua aplicação
        logging: false,
      });
      
      // Converter para imagem
      const image = canvas.toDataURL('image/png');
      
      // Tentar compartilhar a imagem em dispositivos móveis
      if (navigator.share && navigator.canShare) {
        try {
          // Converter base64 para blob
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], `votacao-${editionId}.png`, { type: 'image/png' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Meus votos para o Jogo do Ano ${editionId}`,
              text: `Confira meus votos para o Jogo do Ano ${editionId}!`,
              files: [file],
            });
          } else {
            // Fallback para download se o compartilhamento não for suportado
            downloadImage(image);
          }
        } catch (err) {
          console.error('Erro ao compartilhar arquivo:', err);
          // Fallback para download
          downloadImage(image);
        }
      } else {
        // Fallback para download se o Web Share API não estiver disponível
        downloadImage(image);
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast.error('Erro ao gerar imagem dos resultados');
    } finally {
      setGeneratingImage(false);
    }
  };
  
  // Função auxiliar para download
  const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `votacao-${editionId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Imagem dos resultados baixada!');
  };
  
  
  return (
    <div className="space-y-4">
      {/* Botão para gerar imagem */}
      <Button 
        onClick={generateImage} 
        disabled={generatingImage}
        className="w-full bg-gradient-to-r from-chart-2 to-green-500"
      >
        {generatingImage ? (
          <>
            <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2"></div>
            Gerando Imagem...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            Compartilhar como imagem
          </>
        )}
      </Button>
      
      <div className="border rounded-md p-3">
        <p className="text-sm font-medium mb-2">Prévia:</p>
        <ScrollArea className="h-48">
          <div className="scale-[0.6] origin-top-left">
            <div 
              ref={resultsRef}
              className="w-[600px] p-6 bg-background text-foreground border border-muted/20 rounded-lg"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <h1 className="text-xl font-bold text-green-500 mb-1 flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Jogo do Ano {editionId}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    @{user?.displayName || user?.email?.split('@')[0] || 'user'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {categories && votes[editionId] && categories.map(category => {
                    const gameId = votes[editionId][category.id];
                    const game = gameId ? category.games?.find(g => g.id === gameId) : null;
                    
                    if (!game) return null;
                    
                    return (
                      <div key={category.id} className="border border-muted/20 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                            Vencedor
                          </Badge>
                        </div>
                        
                        <div className="flex items-center mt-2 space-x-3">
                          {game.imageUrl ? (
                            <div className="w-12 h-12 relative flex-shrink-0">
                              <img 
                                src={game.imageUrl} 
                                alt={game.title}
                                className="object-cover w-full h-full rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 rounded-md">
                              <span className="text-white/70 text-xs font-medium">{game.title.substring(0, 2)}</span>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-bold text-sm">{game.title}</h4>
                            <p className="text-xs text-muted-foreground">{game.developer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-center items-center pt-2">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">
                      votinggames.app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}