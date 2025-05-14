"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/icons"
import { motion } from "framer-motion"

interface LoginModalProps {
  handleLogin: () => void;
}

export function LoginModal({ handleLogin }: LoginModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full my-8 text-center"
    >
      <Card className="border-primary/20 bg-gradient-to-r from-background to-primary/5">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Faça login para acessar a votação</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-lg mx-auto">
            Acesse sua conta para poder votar nos seus jogos favoritos e participar da escolha do jogo do ano.
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
  )
} 