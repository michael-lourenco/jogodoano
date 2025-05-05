"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { fetchUserData, dbFirestore } from "@/services/firebase/FirebaseService"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAdminAccess() {
      if (status === "loading") return

      if (!session?.user?.email) {
        router.push("/")
        return
      }

      try {
        // Buscar dados do usuário no Firestore usando a instância dbFirestore já exportada
        const userData = await fetchUserData(dbFirestore, session.user.email)

        // Verificar se o usuário tem a role de admin
        if (userData && userData.role === "admin") {
          setIsAuthorized(true)
        } else {
          console.log("Acesso negado: usuário não é admin", userData)
          router.push("/access-denied")
        }
      } catch (error) {
        console.error("Erro ao verificar permissões de admin:", error)
        router.push("/")
      }
    }

    checkAdminAccess()
  }, [session, status, router])

  // Mostrar estado de carregamento enquanto verifica autorização
  if (status === "loading" || isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autorizado, o useEffect já redirecionou
  // Este return só será executado se o usuário for admin
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-8 overflow-auto w-0">{children}</div>
    </div>
  )
}
