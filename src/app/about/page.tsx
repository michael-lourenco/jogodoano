"use client"

import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { UserInfo } from "@/components/UserInfo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/icons"
import { Footer } from "@/components/Footer"

export default function About() {
  const { user, loading, status, handleLogin, handleLogout } = useAuth()
  const navigationService = useNavigation()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    )
  }

  const handleBack = () => {
    navigationService.navigateTo("/")
  }

  // Lista de categorias para explicação
  const categories = [
    "Melhor Jogo de Ação",
    "Melhor RPG",
    "Melhor Jogo Indie",
    "Melhor Narrativa",
    "Melhor Multiplayer",
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          <UserInfo user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
          <Card className="w-full max-w-3xl bg-background border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-foreground">Sobre o Jogo do Ano</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full mb-8">
                <img
                  src="/placeholder.svg?height=300&width=800"
                  alt="Jogo do Ano - Votação"
                  className="w-full max-w-4xl mx-auto border-none shadow-none rounded-lg"
                />
              </div>

              <p className="text-lg mb-8">
                O <strong>Jogo do Ano</strong> é uma plataforma de votação onde você pode escolher seus jogos favoritos
                em diferentes categorias. Participe da comunidade e ajude a eleger os melhores títulos do ano! Seu voto
                é importante para reconhecer os jogos que marcaram a indústria e celebrar as conquistas dos
                desenvolvedores.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                  <Icon name="LuInfo" className="w-6 h-6" /> Sobre a Votação
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Icon name="LuCalendarClock" className="w-5 h-5" />
                    <strong>Período:</strong> Votação anual para os melhores jogos
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="LuUsers" className="w-5 h-5" />
                    <strong>Participantes:</strong> Aberto a todos os usuários cadastrados
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="LuTrophy" className="w-5 h-5" />
                    <strong>Objetivo:</strong> Eleger os melhores jogos em cada categoria
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="LuBarChart" className="w-5 h-5" />
                    <strong>Resultados:</strong> Divulgados após o encerramento da votação
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                  <Icon name="LuListChecks" className="w-6 h-6" /> Categorias
                </h2>
                <p className="mb-4">
                  A votação é dividida em diferentes categorias para abranger diversos gêneros e aspectos dos jogos:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {categories.map((category, index) => (
                    <Card key={index} className="bg-muted/20 border-muted/30">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Icon name="LuGamepad2" className="w-5 h-5 text-chart-2" />
                        <span>{category}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Cada categoria apresenta uma seleção dos jogos mais destacados do ano, cuidadosamente escolhidos com
                  base em seu impacto, qualidade e recepção.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                  <Icon name="LuVote" className="w-6 h-6" /> Como Votar
                </h2>
                <ol className="list-decimal pl-6 space-y-4 mb-6">
                  <li className="pl-2">
                    <strong className="text-chart-2">Faça login</strong> na plataforma usando sua conta. Se ainda não
                    possui uma conta, você precisará se cadastrar.
                  </li>
                  <li className="pl-2">
                    <strong className="text-chart-2">Acesse a página de votação</strong> através do menu principal ou
                    botão destacado na página inicial.
                  </li>
                  <li className="pl-2">
                    <strong className="text-chart-2">Navegue pelas categorias</strong> disponíveis. Em dispositivos
                    móveis, use as abas para alternar entre as categorias.
                  </li>
                  <li className="pl-2">
                    <strong className="text-chart-2">Selecione seu jogo favorito</strong> em cada categoria clicando no
                    card do jogo. O jogo selecionado será destacado com um indicador verde.
                  </li>
                  <li className="pl-2">
                    <strong className="text-chart-2">Vote em todas as categorias</strong> - você precisa escolher um
                    jogo em cada categoria para completar sua votação.
                  </li>
                  <li className="pl-2">
                    <strong className="text-chart-2">Envie seus votos</strong> clicando no botão "Enviar Votos" no final
                    da página. Seus votos serão registrados e você receberá uma confirmação.
                  </li>
                </ol>

                <div className="bg-muted/20 p-4 rounded-lg border border-muted/30 mb-6">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <Icon name="LuAlertCircle" className="w-5 h-5 text-chart-2" /> Importante
                  </h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Você só pode votar uma vez, mas pode editar seus votos até o encerramento da votação.</li>
                    <li>É necessário votar em todas as categorias para que sua votação seja registrada.</li>
                    <li>Após enviar seus votos, você receberá uma confirmação e poderá visualizar suas escolhas.</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                  <Icon name="LuBarChart2" className="w-6 h-6" /> Resultados
                </h2>
                <p className="mb-4">
                  Após o encerramento do período de votação, os resultados serão compilados e anunciados:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Os vencedores de cada categoria serão destacados na plataforma.</li>
                  <li>Estatísticas detalhadas sobre a votação serão disponibilizadas.</li>
                  <li>Um resumo dos jogos mais votados será compartilhado com a comunidade.</li>
                  <li>Os resultados ficarão disponíveis para consulta no histórico da plataforma.</li>
                </ul>
              </section>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => navigationService.navigateTo("/voting")}
                  className="bg-gradient-to-r from-chart-2 to-green-500 hover:from-chart-2 hover:to-green-400 text-white"
                >
                  <Icon name="LuVote" className="mr-2 h-5 w-5" />
                  Ir para Votação
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

