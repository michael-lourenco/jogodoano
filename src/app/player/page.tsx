"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserInfo } from "@/components/UserInfo";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Icon, IconName } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header"

// Interfaces para tipagem
interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: IconName;
}

interface ActivityItem {
  id: number;
  type: string;
  game?: string;
  category?: string;
  date: string;
  icon: IconName;
}

export default function PlayerDashboard() {
  const { user, loading, handleLogin, handleLogout } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarUrl, setAvatarUrl] = useState(null as string | null);

  // Formatar URL da imagem de perfil para melhor qualidade
  useEffect(() => {
    if (user?.photoURL) {
      try {
        const cleanPhotoUrl = user.photoURL.split("=")[0];
        setAvatarUrl(`${cleanPhotoUrl}=s150`);
      } catch (error) {
        console.error("Erro ao formatar a URL da imagem:", error);
        setAvatarUrl(null);
      }
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  // Definir dados de jogos e atividades do jogador
  // Estes seriam substituídos por dados reais vindos de uma API ou banco de dados
  const playerStats = {
    // Usar uma data padrão já que user não possui a propriedade metadata
    joinedDate: new Date(Date.now()).toLocaleDateString('pt-BR'),
    votedGames: user?.total_games?.value || 0,
    bestScore: user?.best_score?.value || 0,
    coins: user?.currency?.value || 0,
    credits: user?.credits?.value || 0
  };

  const recentActivities: ActivityItem[] = [
    { 
      id: 1, 
      type: "vote", 
      game: "Elden Ring", 
      category: "Jogo do Ano", 
      date: "2023-11-15", 
      icon: "LuStar" 
    },
    { 
      id: 2, 
      type: "vote", 
      game: "Final Fantasy XVI", 
      category: "Melhor Narrativa", 
      date: "2023-11-15", 
      icon: "LuBook" 
    },
    { 
      id: 3, 
      type: "login", 
      date: "2023-11-15", 
      icon: "LuLogIn" 
    }
  ];

  const preferences = {
    favoriteGenres: ["RPG", "Ação", "Aventura"],
    platforms: ["PC", "PlayStation", "Xbox"],
    notifications: true
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, description, icon }: StatCardProps) => (
    <Card className="bg-background/50 border border-muted hover:border-primary/20 transition-colors">
      <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
          <Icon name={icon} className="w-6 h-6 md:w-7 md:h-7" />
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-1 text-primary">{value}</h3>
        <p className="text-sm md:text-base font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start pt-4 px-4">
        <div className="w-full max-w-4xl mx-auto">
          
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full my-8 text-center"
            >
              <Card className="border-primary/20 bg-gradient-to-r from-background to-primary/5">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Faça login para visualizar seu perfil</h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-lg mx-auto">
                    Acesse sua conta para visualizar estatísticas, histórico de votos e personalizar suas preferências.
                  </p>
                  <Button
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 text-primary-foreground px-6 py-4 md:px-8 md:py-6 h-auto text-base md:text-lg shadow-lg"
                  >
                    <Icon name="LuLogIn" className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                    Fazer Login
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full mt-2 mb-6"
            >
              <Card className="border-muted">
                <CardContent className="p-0">
                  <Tabs defaultValue="profile" value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="w-full grid grid-cols-3 rounded-none bg-muted/30">
                      <TabsTrigger value="profile" className="px-2 h-12 rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary">
                        <Icon name="LuUser" className="w-4 h-4 md:mr-2" />
                        <span className={isMobile ? "hidden" : "inline"}>Perfil</span>
                      </TabsTrigger>
                      <TabsTrigger value="activity" className="px-2 h-12 rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary">
                        <Icon name="LuHistory" className="w-4 h-4 md:mr-2" />
                        <span className={isMobile ? "hidden" : "inline"}>Atividades</span>
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="px-2 h-12 rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary">
                        <Icon name="LuSettings" className="w-4 h-4 md:mr-2" />
                        <span className={isMobile ? "hidden" : "inline"}>Preferências</span>
                      </TabsTrigger>
                    </TabsList>

                    <div className="p-4 md:p-6">
                      <TabsContent value="profile" className="mt-0">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                              <Card className="bg-muted/10 border-muted">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                  <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/20 mb-4">
                                    <AvatarImage
                                      src={avatarUrl || "/api/placeholder/150/150"}
                                      alt="Player avatar" 
                                      className="object-cover"
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                      {user?.displayName?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <h2 className="text-xl md:text-2xl font-bold mb-1 text-primary">{user?.displayName}</h2>
                                  <p className="text-sm text-muted-foreground mb-4">Membro desde {playerStats.joinedDate}</p>
                                  <div className="flex gap-2 mb-4">
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                      <Icon name="LuVote" className="w-3 h-3 mr-1" />
                                      Votante
                                    </Badge>
                                    {playerStats.votedGames > 10 && (
                                      <Badge className="bg-chart-2/10 text-chart-2 hover:bg-chart-2/20">
                                        <Icon name="LuStar" className="w-3 h-3 mr-1" />
                                        Entusiasta
                                      </Badge>
                                    )}
                                  </div>
                                  <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="border-destructive text-destructive hover:bg-destructive/10 mt-2"
                                    size="sm"
                                  >
                                    <Icon name="LuLogOut" className="w-4 h-4 mr-2" />
                                    Sair da conta
                                  </Button>
                                </CardContent>
                              </Card>
                            </div>
                            
                            <div className="md:w-2/3">
                              <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                <Icon name="LuBarChart" className="w-5 h-5" />
                                Estatísticas
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <StatCard 
                                  title="Pontuação" 
                                  value={playerStats.bestScore} 
                                  description="Sua pontuação máxima" 
                                  icon="LuTrophy"
                                />
                                <StatCard 
                                  title="Moedas" 
                                  value={playerStats.coins} 
                                  description="Moedas disponíveis" 
                                  icon="LuCoins"
                                />
                                <StatCard 
                                  title="Jogos Votados" 
                                  value={playerStats.votedGames} 
                                  description="Total de votos realizados" 
                                  icon="LuGamepad"
                                />
                              </div>
                              
                              <div className="bg-muted/10 rounded-lg p-4 md:p-5 border border-muted">
                                <h4 className="text-base md:text-lg font-medium mb-3 flex items-center gap-2 text-primary">
                                  <Icon name="LuTarget" className="w-4 h-4 text-chart-2" />
                                  Conquistas
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  <div className={`p-3 rounded-lg border border-muted flex items-center gap-3 ${playerStats.votedGames > 0 ? 'bg-success/5 border-success/20' : 'bg-muted/5 opacity-50'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${playerStats.votedGames > 0 ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted-foreground'}`}>
                                      <Icon name="LuVote" className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Primeiro Voto</p>
                                      <p className="text-xs text-muted-foreground">{playerStats.votedGames > 0 ? 'Desbloqueado' : 'Bloqueado'}</p>
                                    </div>
                                  </div>
                                  <div className={`p-3 rounded-lg border border-muted flex items-center gap-3 ${playerStats.votedGames >= 5 ? 'bg-success/5 border-success/20' : 'bg-muted/5 opacity-50'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${playerStats.votedGames >= 5 ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted-foreground'}`}>
                                      <Icon name="LuThumbsUp" className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Entusiasta</p>
                                      <p className="text-xs text-muted-foreground">{playerStats.votedGames >= 5 ? 'Desbloqueado' : `${playerStats.votedGames}/5 votos`}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="activity" className="mt-0">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                            <Icon name="LuActivity" className="w-5 h-5" />
                            Atividades Recentes
                          </h3>
                          
                          {recentActivities.length > 0 ? (
                            <div className="space-y-3 md:space-y-4">
                              {recentActivities.map((activity) => (
                                <Card key={activity.id} className="bg-background border-muted hover:border-primary/20 transition-colors">
                                  <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                      <Icon name={activity.icon} className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow">
                                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <h4 className="text-base font-medium text-primary">
                                          {activity.type === "vote" 
                                            ? `Votou em ${activity.game}` 
                                            : "Fez login no sistema"}
                                        </h4>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(activity.date).toLocaleDateString('pt-BR')}
                                        </span>
                                      </div>
                                      {activity.type === "vote" && (
                                        <p className="text-sm text-foreground mt-1">
                                          Categoria: <Badge className="ml-1 font-normal">{activity.category}</Badge>
                                        </p>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <Card className="bg-muted/5 border-dashed border-muted">
                              <CardContent className="p-6 text-center">
                                <Icon name="LuClipboardList" className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <h3 className="text-base font-medium text-foreground mb-2">Nenhuma atividade recente</h3>
                                <p className="text-sm text-muted-foreground">
                                  Suas atividades de votação e interações aparecerão aqui.
                                </p>
                              </CardContent>
                            </Card>
                          )}
                          
                          <div className="mt-8 p-4 md:p-5 bg-muted/10 rounded-lg border border-muted flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                            <div className="flex-shrink-0">
                              <Icon name="LuVote" className="w-10 h-10 md:w-12 md:h-12 text-chart-2 opacity-80" />
                            </div>
                            <div>
                              <h3 className="text-base md:text-lg font-semibold mb-1 text-center sm:text-left">Participe da votação atual</h3>
                              <p className="text-sm md:text-base text-muted-foreground mb-3 text-center sm:text-left">
                                Vote nos melhores jogos do ano e contribua para eleger os grandes vencedores.
                              </p>
                              <div className="flex justify-center sm:justify-start">
                                <Button className="bg-chart-2 hover:bg-chart-2/90 text-white">
                                  <Icon name="LuArrowRight" className="w-4 h-4 mr-2" />
                                  Ir para Votação
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="settings" className="mt-0">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                            <Icon name="LuSettings" className="w-5 h-5" />
                            Preferências
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-background border-muted">
                              <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                  <Icon name="LuGamepad" className="w-4 h-4 text-chart-3" />
                                  Gêneros Favoritos
                                </CardTitle>
                                <CardDescription>
                                  Escolha seus gêneros de jogos preferidos
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {preferences.favoriteGenres.map((genre, index) => (
                                    <Badge key={index} className="bg-chart-3/10 text-chart-3 hover:bg-chart-3/20 px-3 py-1">
                                      {genre}
                                    </Badge>
                                  ))}
                                  <Button variant="outline" size="sm" className="rounded-full h-6 px-3">
                                    <Icon name="LuPlus" className="w-3 h-3 mr-1" />
                                    Adicionar
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-background border-muted">
                              <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                  <Icon name="LuMonitor" className="w-4 h-4 text-chart-1" />
                                  Plataformas
                                </CardTitle>
                                <CardDescription>
                                  Em quais plataformas você joga
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {preferences.platforms.map((platform, index) => (
                                    <Badge key={index} className="bg-chart-1/10 text-chart-1 hover:bg-chart-1/20 px-3 py-1">
                                      {platform}
                                    </Badge>
                                  ))}
                                  <Button variant="outline" size="sm" className="rounded-full h-6 px-3">
                                    <Icon name="LuPlus" className="w-3 h-3 mr-1" />
                                    Adicionar
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <Card className="mt-6 bg-background border-muted">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <Icon name="LuBell" className="w-4 h-4 text-primary" />
                                Notificações
                              </CardTitle>
                              <CardDescription>
                                Gerencie suas preferências de notificação
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">Novos eventos de votação</p>
                                    <p className="text-xs text-muted-foreground">Seja notificado quando houver novos eventos de votação</p>
                                  </div>
                                  <div className="w-12 h-6 bg-success/20 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-4 h-4 bg-success rounded-full absolute right-1"></div>
                                  </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">Resultados de votação</p>
                                    <p className="text-xs text-muted-foreground">Seja notificado quando os resultados forem anunciados</p>
                                  </div>
                                  <div className="w-12 h-6 bg-success/20 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-4 h-4 bg-success rounded-full absolute right-1"></div>
                                  </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">Newsletter</p>
                                    <p className="text-xs text-muted-foreground">Receba atualizações sobre a plataforma</p>
                                  </div>
                                  <div className="w-12 h-6 bg-muted/20 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-4 h-4 bg-muted-foreground rounded-full absolute left-1"></div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <div className="mt-6 flex justify-end">
                            <Button className="bg-primary hover:bg-primary/90">
                              <Icon name="LuSave" className="w-4 h-4 mr-2" />
                              Salvar Preferências
                            </Button>
                          </div>
                        </motion.div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}