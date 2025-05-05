declare module "next-auth" {
    interface Session {
      user: {
        name?: string | null
        email?: string | null
        image?: string | null
        // Adicionamos role aqui para tipagem, mas ela será verificada no Firestore
        role?: string
      }
    }
  }
  