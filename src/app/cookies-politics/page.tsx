"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigation } from "@/hooks/useNavigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function CookiesPoliticsPage() {
  const navigationService = useNavigation()

  const handleBack = () => {
    navigationService.navigateTo("/")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start pt-8 px-4">
        <div className="max-w-4xl w-full mx-auto space-y-6">
          {/* Botão Voltar */}
          <Button
            onClick={handleBack}
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Button>

          {/* Título Principal */}
          <Card className="bg-card/50 backdrop-blur-sm border-none shadow-none relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-chart-2/10 to-chart-5/10 animate-gradient" />
            <CardHeader className="space-y-2 relative">
              <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-chart-2 to-chart-5 text-transparent bg-clip-text animate-gradient">
                Política de Cookies
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </CardHeader>
          </Card>

          {/* Conteúdo da Política */}
          <Card className="border border-muted/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardContent className="pt-8 pb-6 px-6 space-y-6">
              
              {/* Introdução */}
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">O que são Cookies?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, tablet ou celular) 
                  quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de forma mais eficiente, 
                  bem como fornecer informações aos proprietários do site.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  No Jogo do Ano BR, utilizamos cookies para melhorar sua experiência de navegação, 
                  personalizar conteúdo e analisar o tráfego do site.
                </p>
              </section>

              {/* Tipos de Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Tipos de Cookies que Utilizamos</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-medium mb-2">Cookies Essenciais</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Estes cookies são necessários para o funcionamento básico do site. Eles incluem cookies que permitem 
                      que você faça login, mantenha suas preferências de voto e navegue pelas páginas do site.
                    </p>
                  </div>

                  <div className="border-l-4 border-success pl-4">
                    <h3 className="text-lg font-medium mb-2">Cookies de Funcionalidade</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Estes cookies permitem que o site lembre das escolhas que você faz (como seu nome de usuário, 
                      idioma ou região) e forneça recursos aprimorados e mais pessoais.
                    </p>
                  </div>

                  <div className="border-l-4 border-warning pl-4">
                    <h3 className="text-lg font-medium mb-2">Cookies de Análise</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Utilizamos cookies de análise para entender como os visitantes interagem com nosso site. 
                      Isso nos ajuda a melhorar a funcionalidade e a experiência do usuário.
                    </p>
                  </div>

                  <div className="border-l-4 border-info pl-4">
                    <h3 className="text-lg font-medium mb-2">Cookies de Preferências</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Estes cookies permitem que o site lembre informações que mudam a forma como o site se comporta 
                      ou se parece, como o tema preferido (claro/escuro) e outras configurações de personalização.
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookies de Terceiros */}
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Cookies de Terceiros</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nosso site pode utilizar serviços de terceiros que também podem definir cookies. 
                  Estes incluem:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> Para análise de tráfego e comportamento dos usuários</li>
                  <li><strong>Firebase:</strong> Para autenticação e armazenamento de dados do usuário</li>
                  <li><strong>Apoia.se:</strong> Para processamento de doações</li>
                </ul>
              </section>

              {/* Controle de Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Como Controlar os Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Você pode controlar e/ou excluir cookies conforme desejar. Você pode excluir todos os cookies 
                  que já estão no seu computador e pode configurar a maioria dos navegadores para impedir que sejam colocados.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Para mais informações sobre como gerenciar cookies, visite{" "}
                  <a 
                    href="https://www.allaboutcookies.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    allaboutcookies.org
                  </a>.
                </p>
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Configurações do Navegador</h3>
                  <p className="text-muted-foreground text-sm">
                    Você pode configurar seu navegador para recusar todos os cookies ou para indicar quando um cookie está sendo enviado. 
                    No entanto, se você fizer isso, pode ser que não consiga acessar ou usar algumas partes do nosso site.
                  </p>
                </div>
              </section>

              {/* Atualizações da Política */}
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Atualizações desta Política</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos atualizar nossa Política de Cookies de tempos em tempos. Recomendamos que você revise 
                  esta página periodicamente para se manter informado sobre como estamos protegendo suas informações.
                </p>
              </section>

              {/* Contato */}
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4">Entre em Contato</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato conosco:
                </p>
                <div className="bg-muted/20 rounded-lg p-4">
                  <p className="text-muted-foreground">
                    <strong>Email:</strong>{" "}
                    <a 
                      href="mailto:contato@jogodoano.com.br" 
                      className="text-primary hover:underline"
                    >
                      appjogodoano@gmail.com
                    </a>
                  </p>
                </div>
              </section>

              {/* Botão de Aceitar */}
              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleBack}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3"
                >
                  Entendi e Aceito
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