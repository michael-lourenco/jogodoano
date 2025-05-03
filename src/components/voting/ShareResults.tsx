"use client"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Share2, Twitter, Facebook, Linkedin, Copy, CheckCircle2, Trophy, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import html2canvas from 'html2canvas'
import { Category } from "@/types/types"
import { UserData } from "@/services/FirebaseService"

interface ShareResultsDialogProps {
  votes: Record<string, Record<string, string>>;
  editionId: string;
  categories: Category[];
  user: UserData | null;
}

export function ShareResultsDialog({ votes, editionId, categories, user }: ShareResultsDialogProps) {
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

function ImageShareTab({ votes, editionId, categories, user }: ImageShareTabProps) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
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