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

          <div className="flex justify-center">
            <Card className="bg-card/50 backdrop-blur-sm border border-muted/50 shadow-lg hover:shadow-xl transition-all duration-300 max-w-2xl w-full">
              <CardContent className="p-8 flex flex-col items-center gap-6 text-center">
                <div className="flex flex-col items-center gap-4 w-full">
                  <h3 className="text-2xl font-semibold">Vencedor da Edição 2025</h3>
                  <div className="w-full relative aspect-[1024/576] rounded-lg overflow-hidden border border-muted/50">
                    <Image
                      src="/expedition-33.jpg"
                      alt="Clair Obscur: Expedition 33"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-primary">Clair Obscur: Expedition 33</h4>
                </div>
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