import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/Footer"
import { ShareResultsDialog } from "@/components/voting/ShareResults"
import { CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { UserData } from "@/services/FirebaseService"
import { Category } from "@/types/types"

interface VotingCompletePageProps {
  user: UserData | null
  votes: Record<string, Record<string, string>>
  votedEditionId: string
  categories: Category[]
  onBackToVoting: () => void
  onBackToHome: () => void
}

export const VotingCompletePage = ({
  user,
  votes,
  votedEditionId,
  categories,
  onBackToVoting,
  onBackToHome,
}: VotingCompletePageProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card border-none shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center"
            >
              <CheckCircle2 className="w-12 h-12 text-success" />
            </motion.div>

            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-chart-2 to-chart-5 text-transparent bg-clip-text">
              Votação Concluída!
            </CardTitle>

            <p className="text-center text-muted-foreground">
              Obrigado por participar da votação da edição {votedEditionId}. Seus votos foram registrados com
              sucesso!
            </p>

            <div className="w-full mt-2">
              <ShareResultsDialog
                votes={votes}
                editionId={votedEditionId}
                categories={categories}
                user={user}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button onClick={onBackToVoting} variant="outline" className="mt-2">
                Votar em outra edição
              </Button>

              <Button
                onClick={onBackToHome}
                className="mt-2 bg-gradient-to-r from-chart-2 to-chart-5 hover:from-chart-2 hover:to-chart-4 text-primary-foreground"
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