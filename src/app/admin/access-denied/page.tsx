import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="mt-6 text-3xl font-bold">Acesso Negado</h1>
        <p className="mt-4 text-muted-foreground">Você não tem permissões de administrador para acessar esta página.</p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
