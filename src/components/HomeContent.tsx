"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Youtube, Instagram, Mail } from "lucide-react"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/hooks/useAuth"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { votingEditions } from "@/repositories/votingEditions"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CountdownTimer } from "@/components/CountdownTimer"
import { DonationBanner } from "@/components/DonationBanner"
import { DonationModal } from "@/components/DonationModal"
import { useState } from "react"
import { useDonation } from "@/hooks/useDonation"
import Image from "next/image"

export function HomeContent() {
  const navigationService = useNavigation()
  const { user, loading, status, handleLogin, handleLogout } = useAuth()
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const { donationMeta, isLoading: isLoadingDonation } = useDonation()

  const handleNavigation = (path: string) => () => {
    navigationService.navigateTo(path)
  }

  const edition2025 = votingEditions.find(edition => edition.id === "2025")
  const allTimeEdition = votingEditions.find(edition => edition.id === "all_time")
  const now = new Date()
  const isVotingOpen = edition2025?.startAt && edition2025?.endAt && now >= edition2025.startAt && now <= edition2025.endAt

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start pt-2 px-4">
        <div className="max-w-4xl w-full mx-auto space-y-6">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl relative aspect-[1707/282]">
              <Image
                src="/channels4_banner.jpg"
                alt="JOGO DO ANO"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </div>


          {/* {!isLoadingDonation && donationMeta && (
            <DonationBanner
              donationMeta={donationMeta}
              onDonate={() => setIsDonationModalOpen(true)}
            />
          )} */}

          <Card className="border border-muted/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-8 pb-6 px-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Vote no seu jogo favorito em cada categoria. Você só pode escolher um jogo por categoria. Após
                selecionar seus favoritos em todas as categorias, clique em "Enviar Votos" para registrar sua
                participação.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Card className="bg-card/50 backdrop-blur-sm border border-muted/50 shadow-lg hover:shadow-xl transition-all duration-300 max-w-md w-full">
              <CardContent className="p-8 flex flex-col items-center gap-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">Edição 2025</h3>
                  </div>
                  <Image
                    src="/logo.png"
                    alt="Jogo do Ano"
                    width={220}
                    height={220}
                    className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-lg"
                    priority
                  />
                  <p className="text-muted-foreground max-w-sm">
                    Acompanhe a principal votação do ano e escolha os jogos que marcaram 2025.
                  </p>
                </div>
                {isVotingOpen ? (
                  <Button
                    onClick={handleNavigation("/voting?votingEdition=2025")}
                    className="w-full bg-gradient-to-r from-chart-2 to-chart-5 hover:from-chart-2 hover:to-chart-4"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Votar Agora
                  </Button>
                ) : (
                  <div className="space-y-4 w-full">
                    <p className="text-muted-foreground">
                      A votação começará em {format(edition2025?.startAt || new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.
                    </p>
                    <CountdownTimer targetDate={edition2025?.startAt || new Date()} />
                    <Button
                      variant="outline"
                      className="w-full border-muted-foreground/50 text-muted-foreground"
                      disabled
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Em Breve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Seção de Patrocinadores */}
          {/* <Card className="bg-card/50 backdrop-blur-sm border border-muted/50 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Patrocinadores</h3>
              <div className="flex justify-center items-center gap-8">
               
                <div className="text-muted-foreground text-sm">Em breve</div>
              </div>
            </CardContent>
          </Card> */}

          {/* Modal de Doação */}
          {/* <DonationModal
            isOpen={isDonationModalOpen}
            onClose={() => setIsDonationModalOpen(false)}
          /> */}

          {/* Links Úteis */}
          {/* <Card className="bg-card/50 backdrop-blur-sm border border-muted/50 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Links Úteis</h3>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button
                  onClick={() => navigationService.navigateTo("/results?edition=2025")}
                  variant="outline"
                  className="bg-gradient-to-r from-chart-2 to-chart-5 text-white hover:from-chart-2 hover:to-chart-4"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Ver Resultados
                </Button>
                <Button
                  onClick={() => window.open('/about', '_blank')}
                  variant="outline"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Sobre o projeto
                </Button>
              </div>
            </CardContent>
          </Card> */}

          {/* Redes Sociais */}
          <Card className="bg-card/50 backdrop-blur-sm border border-muted/50 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Redes Sociais</h3>
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted"
                  onClick={() => window.open("https://youtube.com/@appjogodoano", "_blank")}
                >
                  <Youtube className="w-6 h-6 text-destructive" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted"
                  onClick={() => window.open("https://instagram.com/appjogodoano", "_blank")}
                >
                  <Instagram className="w-6 h-6 text-pink-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted"
                  onClick={() => window.open("mailto:appjogodoano@gmail.com", "_blank")}
                >
                  <Mail className="w-6 h-6 text-info" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
} 