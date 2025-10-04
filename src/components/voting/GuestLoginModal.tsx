"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Lock, Users, CheckCircle } from "lucide-react"

interface GuestLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  votesCount: number
  editionName: string
}

export function GuestLoginModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  votesCount, 
  editionName 
}: GuestLoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">Finalizar Votação</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Você já votou em <strong>{votesCount} categoria{votesCount !== 1 ? 's' : ''}</strong> da edição <strong>{editionName}</strong>!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-info/20 bg-info/5">
            <Lock className="h-4 w-4 text-info" />
            <AlertDescription className="text-sm">
              Para enviar seus votos e participar oficialmente da votação, você precisa fazer login.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
              <span>Seus votos serão preservados</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
              <span>Participação oficial na votação</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
              <span>Acesso aos resultados quando divulgados</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
              <span>Histórico de suas participações</span>
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Faça login rapidamente com sua conta Google</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Continuar Votando
          </Button>
          <Button 
            onClick={onLogin}
            className="w-full sm:w-auto bg-gradient-to-r from-chart-2 to-chart-5 hover:from-chart-2 hover:to-chart-4"
          >
            Fazer Login & Enviar Votos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
