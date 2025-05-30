'use client';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, HelpCircle, Heart } from "lucide-react";
import { Icon } from "@/components/icons";
import { useNavigation } from "@/hooks/useNavigation";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";
import { UserInfo } from "@/components/UserInfo";
import { Header } from "@/components/Header"

export default function Home() {
  const navigationService = useNavigation();
  const { user, loading, status, handleLogin, handleLogout } = useAuth();

  const handleNavigation = (path: string) => () => {
    navigationService.navigateTo(path);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-start pt-8 px-4">
          <div className="max-w-4xl w-full mx-auto space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-none shadow-none relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-2/10 to-chart-5/10 animate-gradient" />
              <CardHeader className="space-y-2 relative">
                <CardTitle className="text-5xl font-bold text-center bg-gradient-to-r from-chart-2 to-chart-5 text-transparent bg-clip-text animate-gradient">
                  JOGO DO ANO
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border border-muted/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-8 pb-6 px-6">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Vote no seu jogo favorito em cada categoria. Você só pode escolher um jogo por categoria. Após
                  selecionar seus favoritos em todas as categorias, clique em "Enviar Votos" para registrar sua
                  participação.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-none shadow-none">
              <CardContent className="space-y-10 py-8">
                <div className="flex justify-center">
                  <Button
                    onClick={handleNavigation("/voting/2025")}
                    className="w-40 h-40 rounded-full bg-gradient-to-r from-chart-2 to-chart-5 hover:from-chart-2 hover:to-chart-4 shadow-lg hover:shadow-chart-5/25 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden flex flex-col items-center justify-center gap-2"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-chart-2/20 to-chart-5/20 animate-pulse" />
                    <Icon 
                      name="LuPlay" 
                      style={{ width: "32px", height: "32px" }}  
                      className="text-background relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="text-background font-medium text-sm relative z-10">Votar 2025</span>
                  </Button>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <Button
                    onClick={() => window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank")}
                    variant="outline"
                    className="w-full border-chart-4/50 text-chart-4 hover:bg-chart-4/10 hover:border-chart-4 group transition-all duration-300 hover:shadow-lg hover:shadow-chart-4/20"
                  >
                    <Heart className="w-5 h-5 mr-2 text-chart-4 group-hover:text-chart-4" />
                    <span className="font-medium">Apoiar o Projeto</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}