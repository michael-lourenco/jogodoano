import { fetchUserData, dbFirestore } from "@/services/firebase/FirebaseService"
import type { Session } from "next-auth"

/**
 * Verifica se o usuário tem permissões de administrador
 * @param session Sessão do NextAuth
 * @returns Promise<boolean> Verdadeiro se o usuário for admin
 */
export async function isUserAdmin(session: Session | null): Promise<boolean> {
  if (!session?.user?.email) return false

  try {
    const userData = await fetchUserData(dbFirestore, session.user.email)

    // Verifica se o usuário tem a role de admin
    return userData?.role === "admin"
  } catch (error) {
    console.error("Erro ao verificar permissões de admin:", error)
    return false
  }
}

/**
 * Middleware para verificar permissões de admin
 * Pode ser usado em Server Actions ou API Routes
 */
export async function requireAdmin(session: Session | null): Promise<void> {
  const isAdmin = await isUserAdmin(session)

  if (!isAdmin) {
    throw new Error("Acesso negado: permissões de administrador necessárias")
  }
}
