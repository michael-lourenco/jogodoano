import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import {
  signInWithGoogle,
  signOutFromGoogle,
  handleAuthResponse,
} from "@/services/auth/NextAuthenticationService";
import {
  fetchUserData,
  UserData,
  initUserFirebase,
  dbFirestore,
  authFirestore,
} from "@/services/firebase/FirebaseService";
import { onAuthStateChanged, Auth } from "firebase/auth";
import { useRouter } from "next/navigation";

function userFromSession(session: Session): UserData {
  const now = new Date();
  return {
    displayName: session.user?.name || "Jogador",
    email: session.user?.email || "",
    photoURL: session.user?.image || "",
    best_score: { value: 0, updatedAt: now },
    credits: { value: 0, updatedAt: now },
    currency: { value: 0, updatedAt: now },
    total_games: { value: 0, updatedAt: now },
  };
}

export function useAuth() {
  // Tentar obter o usuário do localStorage imediatamente
  const getUserFromStorage = (): UserData | null => {
    if (typeof window === "undefined") return null;
    
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) return JSON.parse(storedUser);
    } catch (error) {
      console.error("Erro ao ler usuário do localStorage:", error);
    }
    
    return null;
  };

  const router = useRouter();
  const [auth, setAuth] = useState<Auth | null>(null);
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserData | null>(getUserFromStorage());
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState<any>(null);

  const handleLogin = async () => {
    if (status === "authenticated" || user?.email) {
      return;
    }

    try {
      // Garantir que estamos no lado do cliente
      if (typeof window !== "undefined") {
        // Salvar a URL atual antes do login
        sessionStorage.setItem("loginRedirectUrl", window.location.pathname);
      }
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro durante o login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Primeiro limpar o estado e localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      
      // Atualizar o estado antes de redirecionar
      setUser(null);
      
      // Navegar para a página inicial 
      router.push("/");
      
      // Chamar signOut sem callbackUrl, pois já estamos redirecionando manualmente
      // Isso evita o problema de contexto
      setTimeout(() => {
        signOutFromGoogle();
      }, 0);
    } catch (error) {
      console.error("Erro durante o logout:", error);
    }
  };

  // A sessão do Google define quem está logado. O perfil do Firebase só complementa os dados.
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      setUser((current) => {
        if (current?.email && current.email === session.user?.email) {
          return current;
        }
        return userFromSession(session);
      });
      setLoading(false);

      handleAuthResponse(session, dbFirestore).then((userData) => {
        if (userData) {
          setUser(userData);
        }
      });
      return;
    }

    if (status === "unauthenticated") {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  // Efeito para inicializar o Firebase
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const firebaseInstance = await initUserFirebase(authFirestore, dbFirestore);
        if (firebaseInstance) {
          setAuth(firebaseInstance.authFirestore);
          setDb(firebaseInstance.dbFirestore);
        }
      } catch (error) {
        console.error("Falha na inicialização do Firebase:", error);
        setLoading(false);
      }
    };

    initializeFirebase();
  }, []);

  // Efeito para observar mudanças no estado de autenticação do Firebase
  useEffect(() => {
    if (!auth || !db) return;

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Só busca dados se tiver um usuário autenticado
        const userData = await fetchUserData(db, authUser.email!);
        if (userData) {
          setUser(userData);
        }
      } else {
        // Se não há usuário autenticado no Firebase e não há sessão NextAuth,
        // então realmente não existe usuário logado
        if (status === "unauthenticated") {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, status]); // Removido user da lista de dependências

  return { user, loading, status, handleLogin, handleLogout };
}
