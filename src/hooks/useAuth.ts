import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
    await signInWithGoogle();
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

  // Efeito para verificar a sessão do NextAuth
  useEffect(() => {
    const initializeAuth = async () => {
      if (status === "authenticated" && session) {
        const userData = await handleAuthResponse(session, dbFirestore);
        if (userData) {
          setUser(userData);
        }
      } else if (status === "unauthenticated") {
        // Manter o usuário do localStorage mesmo se a sessão NextAuth não existir
        // O Firebase pode estar gerenciando a autenticação
        if (!user) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, [session, status, user]);

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
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          const userData = await fetchUserData(db, authUser.email!);
          if (userData) {
            setUser(userData);
          }
        } else if (!user) {
          // Apenas definir como null se ainda não tivermos um usuário do localStorage
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [auth, db, user]);

  return { user, loading, status, handleLogin, handleLogout };
}
