"use client"

import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/hooks/useAuth"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { UserInfo } from "@/components/UserInfo"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon } from "@/components/icons"
import { Footer } from "@/components/Footer"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

export default function About() {
  const { user, loading, handleLogin, handleLogout } = useAuth()
  const navigationService = useNavigation()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("about")
  const contentRef = useRef<HTMLDivElement>(null)

  // Rolar para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Rolar para o topo quando a tab muda
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
    window.scrollTo(0, 0)
  }, [activeTab])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary animate-pulse">Carregando...</p>
        </div>
      </div>
    )
  }

  // Lista de categorias para explicação (expandida para 8 categorias)
  const categories = [
    { name: "Melhor Jogo do Ano", icon: "LuTrophy" },
    { name: "Melhor Jogo de Ação", icon: "LuSwords" },
    { name: "Melhor RPG", icon: "LuSwords" },
    { name: "Melhor Jogo Indie", icon: "LuSparkles" },
    { name: "Melhor Narrativa", icon: "LuBook" },
    { name: "Melhor Direção de Arte", icon: "LuPaintbrush" },
    { name: "Melhor Trilha Sonora", icon: "LuMusic" },
    { name: "Melhor Multiplayer", icon: "LuUsers" },
  ]

  // FAQ perguntas e respostas
  const faqs = [
    {
      question: "Quando ocorre a votação?",
      answer: "A votação ocorre anualmente, tipicamente no final do ano para eleger os melhores jogos lançados naquele período. As datas exatas são anunciadas na plataforma e em nossas redes sociais."
    },
    {
      question: "Posso alterar meus votos depois de enviá-los?",
      answer: "Sim, você pode editar seus votos a qualquer momento durante o período de votação. Após o encerramento da votação, seus votos são finalizados e não podem mais ser alterados."
    },
    {
      question: "Como são selecionados os jogos para cada categoria?",
      answer: "Nossa equipe editorial, em conjunto com especialistas da indústria, seleciona os jogos com base em diversos critérios como qualidade, inovação, impacto cultural e recepção crítica. Procuramos incluir os jogos mais representativos lançados no período."
    },
    {
      question: "Quem pode participar da votação?",
      answer: "Qualquer pessoa com uma conta na plataforma pode participar. Nosso objetivo é capturar a opinião genuína dos jogadores, independentemente de serem jogadores casuais ou hardcore."
    },
    {
      question: "Como os resultados são compilados?",
      answer: "Todos os votos têm o mesmo peso e são contabilizados automaticamente pelo sistema. O jogo com maior número de votos em cada categoria é declarado vencedor. Em caso de empate, aplicamos critérios adicionais."
    }
  ]

  // Etapas do processo de votação
  const votingSteps = [
    {
      title: "Crie sua conta",
      description: "Faça login ou cadastre-se para acessar a plataforma de votação",
      icon: "LuUserPlus"
    },
    {
      title: "Explore as categorias",
      description: "Navegue pelas diferentes categorias disponíveis para votação",
      icon: "LuLayoutList"
    },
    {
      title: "Escolha seus favoritos",
      description: "Selecione um jogo em cada categoria que você considera o melhor",
      icon: "LuThumbsUp"
    },
    {
      title: "Revise suas escolhas",
      description: "Verifique se você está satisfeito com todas as suas seleções",
      icon: "LuClipboardCheck"
    },
    {
      title: "Envie seus votos",
      description: "Confirme e envie seus votos para participar da premiação",
      icon: "LuSend"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex flex-col items-center justify-start pt-4 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <UserInfo user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
          
          {/* Hero Section - Melhorado para mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mb-6 text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-chart-2 text-transparent bg-clip-text mb-3 md:mb-4">
              Jogo do Ano
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto px-2">
              Sua voz na celebração dos melhores jogos do ano
            </p>
            <div className="relative w-full h-[180px] md:h-[300px] overflow-hidden rounded-lg mb-6 md:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-chart-2/20 z-10 rounded-lg flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-background/80 backdrop-blur-sm px-6 py-3 md:px-8 md:py-4 rounded-lg border border-muted"
                >
                  {/* <Icon name="LuTrophy" className="w-8 h-8 md:w-12 md:h-12 mx-auto text-chart-2 mb-2" /> */}
                  <p className="text-base md:text-lg font-medium text-foreground">Celebrando a excelência nos games</p>
                </motion.div>
              </div>
              <img
                src="/logo.png?height=300&width=800"
                alt="Jogo do Ano - Votação"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </motion.div>

          {/* Tabs Interface - Otimizado para mobile */}
          <Card className="w-full bg-background border-muted shadow-sm mb-6 md:mb-8">
            <CardContent className="p-0">
              <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-4 rounded-none bg-muted/30">
                  <TabsTrigger value="about" className="px-1 md:px-2 h-12 rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    <Icon name="LuInfo" className="w-4 h-4 md:mr-2" />
                    <span className={isMobile ? "hidden" : "inline"}>Sobre</span>
                  </TabsTrigger>
                  <TabsTrigger value="howto" className="px-1 md:px-2 h-12 rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    <Icon name="LuHelpCircle" className="w-4 h-4 md:mr-2" />
                    <span className={isMobile ? "hidden" : "inline"}>Como Votar</span>
                  </TabsTrigger>
                  <TabsTrigger value="categories" className="px-1 md:px-2 h-12 rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    <Icon name="LuList" className="w-4 h-4 md:mr-2" />
                    <span className={isMobile ? "hidden" : "inline"}>Categorias</span>
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="px-1 md:px-2 h-12 rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    <Icon name="LuHelpCircle" className="w-4 h-4 md:mr-2" />
                    <span className={isMobile ? "hidden" : "inline"}>FAQ</span>
                  </TabsTrigger>
                </TabsList>

                <div ref={contentRef} className="p-4 md:p-6">
                  <TabsContent value="about" className="mt-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-3 md:mb-4 text-primary">
                        <Icon name="LuInfo" className="w-5 h-5 md:w-6 md:h-6" /> 
                        Sobre a Iniciativa
                      </h2>
                      
                      <p className="mb-5 md:mb-6 text-foreground text-sm md:text-base">
                        O <strong className="text-primary">Jogo do Ano</strong> é uma iniciativa criada por entusiastas de games para celebrar a excelência e a inovação na indústria de jogos eletrônicos. Nosso objetivo é proporcionar uma plataforma onde os jogadores possam expressar suas opiniões e reconhecer os títulos que trouxeram as melhores experiências ao longo do ano.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                        <Card className="bg-muted/20 border-muted hover:bg-muted/30 transition-colors">
                          <CardContent className="p-4 md:p-6">
                            <Icon name="LuTarget" className="w-6 h-6 md:w-8 md:h-8 text-chart-2 mb-2 md:mb-3" />
                            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Nossa Missão</h3>
                            <p className="text-sm md:text-base text-muted-foreground">
                              Criar uma plataforma democrática onde cada jogador possa destacar os jogos que marcaram sua experiência, dando visibilidade tanto para grandes produções quanto para jogos independentes inovadores.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-muted/20 border-muted hover:bg-muted/30 transition-colors">
                          <CardContent className="p-4 md:p-6">
                            <Icon name="LuShield" className="w-6 h-6 md:w-8 md:h-8 text-chart-1 mb-2 md:mb-3" />
                            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Valores</h3>
                            <p className="text-sm md:text-base text-muted-foreground">
                              Acreditamos na transparência, na imparcialidade e na valorização da diversidade de experiências que os jogos proporcionam. Nossa premiação reflete genuinamente a voz da comunidade.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="p-4 md:p-5 bg-primary/5 rounded-lg border border-primary/10 mb-4 md:mb-6">
                        <h3 className="flex items-center gap-2 font-semibold text-primary mb-2 md:mb-3 text-base md:text-lg">
                          <Icon name="LuCalendarCheck" className="w-4 h-4 md:w-5 md:h-5" />
                          Ciclo Anual
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                          A premiação segue um ciclo anual cuidadosamente planejado para garantir que todos os jogos elegíveis sejam considerados e que a comunidade tenha tempo suficiente para participar:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                          <div className="flex flex-col items-center text-center p-2 md:p-3 bg-background rounded-lg">
                            <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-primary/20 text-primary rounded-full mb-1 md:mb-2">1</span>
                            <h4 className="text-sm md:text-base font-medium mb-1">Curadoria</h4>
                            <p className="text-xs md:text-sm text-muted-foreground">Seleção dos jogos para cada categoria</p>
                          </div>
                          <div className="flex flex-col items-center text-center p-2 md:p-3 bg-background rounded-lg">
                            <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-primary/20 text-primary rounded-full mb-1 md:mb-2">2</span>
                            <h4 className="text-sm md:text-base font-medium mb-1">Votação</h4>
                            <p className="text-xs md:text-sm text-muted-foreground">Período aberto para votos da comunidade</p>
                          </div>
                          <div className="flex flex-col items-center text-center p-2 md:p-3 bg-background rounded-lg">
                            <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-primary/20 text-primary rounded-full mb-1 md:mb-2">3</span>
                            <h4 className="text-sm md:text-base font-medium mb-1">Premiação</h4>
                            <p className="text-xs md:text-sm text-muted-foreground">Anúncio e celebração dos vencedores</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="howto" className="mt-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-4 md:mb-6 text-primary">
                        <Icon name="LuVote" className="w-5 h-5 md:w-6 md:h-6" /> 
                        Como Participar da Votação
                      </h2>
                      
                      <div className="mb-6 md:mb-8">
                        <div className="space-y-4 md:space-y-6">
                          {votingSteps.map((step, index) => (
                            <motion.div 
                              key={index}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="flex gap-3 md:gap-4"
                            >
                              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Icon name={step.icon} className="w-4 h-4 md:w-5 md:h-5" />
                              </div>
                              <div>
                                <h3 className="text-base md:text-lg font-semibold mb-0.5 md:mb-1">{step.title}</h3>
                                <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                                {index < votingSteps.length - 1 && (
                                  <div className="ml-4 md:ml-5 h-5 md:h-6 border-l border-dashed border-muted mt-1 md:mt-2"></div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-muted/20 p-4 md:p-5 rounded-lg border border-muted">
                        <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold mb-2 md:mb-3">
                          <Icon name="LuLightbulb" className="w-4 h-4 md:w-5 md:h-5 text-chart-2" /> 
                          Dicas para uma Melhor Experiência
                        </h3>
                        <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                          <li className="flex gap-2">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success text-xs">✓</span>
                            <span>Pesquise sobre os jogos indicados que você não conhece antes de votar</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success text-xs">✓</span>
                            <span>Considere vários aspectos dos jogos, não apenas gráficos ou popularidade</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success text-xs">✓</span>
                            <span>Na versão mobile, use os gestos de swipe para navegar entre categorias</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success text-xs">✓</span>
                            <span>Verifique se votou em todas as categorias antes de enviar</span>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="categories" className="mt-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-3 md:mb-4 text-primary">
                        <Icon name="LuListChecks" className="w-5 h-5 md:w-6 md:h-6" /> 
                        Categorias da Premiação
                      </h2>
                      
                      <p className="mb-4 md:mb-6 text-sm md:text-base">
                        Nossa premiação contempla uma ampla variedade de categorias para reconhecer as diversas qualidades e experiências que os jogos oferecem. Cada categoria busca destacar aspectos específicos da arte dos videogames.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {categories.map((category, index) => (
                          <motion.div 
                            key={index}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                          >
                            <Card className={`hover:bg-muted/20 transition-colors border-muted ${index === 0 ? 'bg-primary/10 border-primary/30' : 'bg-background'}`}>
                              <CardContent className="p-3 md:p-4 flex items-center gap-3">
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-primary/20 text-primary' : 'bg-muted/30 text-muted-foreground'}`}>
                                  <Icon name={category.icon} className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div>
                                  <h3 className={`text-sm md:text-base font-medium ${index === 0 ? 'text-primary' : ''}`}>{category.name}</h3>
                                  {index === 0 && (
                                    <p className="text-xs text-muted-foreground">Categoria principal</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-6 md:mt-8 p-4 md:p-5 bg-muted/10 rounded-lg border border-muted">
                        <h3 className="flex items-center gap-2 font-semibold mb-2 md:mb-3 text-base md:text-lg">
                          <Icon name="LuInfo" className="w-4 h-4 md:w-5 md:h-5 text-primary" /> 
                          Processo de Seleção
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                          Os jogos indicados em cada categoria passam por um cuidadoso processo de curadoria que considera:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                          <li className="flex items-start gap-2">
                            <Icon name="LuCalendarCheck" className="w-4 h-4 text-primary mt-0.5" />
                            <span>Jogos lançados durante o período de elegibilidade</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="LuThumbsUp" className="w-4 h-4 text-primary mt-0.5" />
                            <span>Recepção crítica e dos jogadores</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="LuTrendingUp" className="w-4 h-4 text-primary mt-0.5" />
                            <span>Impacto cultural e inovação</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="LuBarChart" className="w-4 h-4 text-primary mt-0.5" />
                            <span>Qualidade técnica e artística</span>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="faq" className="mt-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-4 md:mb-6 text-primary">
                        <Icon name="LuHelpCircle" className="w-5 h-5 md:w-6 md:h-6" /> 
                        Perguntas Frequentes
                      </h2>
                      
                      <div className="space-y-3 md:space-y-4">
                        {faqs.map((faq, index) => (
                          <motion.div 
                            key={index}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          >
                            <Card className="border-muted">
                              <CardContent className="p-4 md:p-5">
                                <h3 className="text-base md:text-lg font-medium mb-2 flex items-center gap-2 text-primary">
                                  <Icon name="LuHelpCircle" className="w-4 h-4 md:w-5 md:h-5" />
                                  {faq.question}
                                </h3>
                                <Separator className="my-2 md:my-3" />
                                <p className="text-sm md:text-base text-muted-foreground">{faq.answer}</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-6 md:mt-8 p-4 md:p-5 bg-muted/10 rounded-lg border border-muted flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                        <div className="flex-shrink-0">
                          <Icon name="LuMail" className="w-10 h-10 md:w-12 md:h-12 text-primary opacity-80" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-semibold mb-1 text-center sm:text-left">Tem mais perguntas?</h3>
                          <p className="text-sm md:text-base text-muted-foreground mb-3 text-center sm:text-left">Ficaremos felizes em esclarecer qualquer dúvida que você tenha sobre nossa plataforma de votação.</p>
                          <div className="flex justify-center sm:justify-start">
                            <Button variant="outline" className="bg-background border-primary/50 text-primary hover:bg-primary/10 text-sm md:text-base">
                              <Icon name="LuMail" className="w-4 h-4 mr-2" />
                              Entre em Contato
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Call to Action - Adaptado para mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full text-center mb-6 md:mb-8"
          >
            <Card className="border-primary/20 bg-gradient-to-r from-background to-primary/5">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Pronto para fazer sua voz ser ouvida?</h2>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-lg mx-auto">
                  Participe agora da votação e ajude a escolher os melhores jogos do ano. Cada voto conta para celebrar a excelência nos videogames.
                </p>
                <Button
                  onClick={() => navigationService.navigateTo("/voting")}
                  className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 text-primary-foreground px-6 py-4 md:px-8 md:py-6 h-auto text-base md:text-lg shadow-lg group"
                >
                  <Icon name="LuVote" className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:animate-pulse" />
                  Ir para Votação
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

