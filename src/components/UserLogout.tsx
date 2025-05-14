import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  UserData,
} from "@/services/firebase/FirebaseService";
import { Icon } from "./icons";
import { Heart } from "lucide-react";

interface UserLogoutProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserLogout: React.FC<UserLogoutProps> = ({
  user,
  handleLogin,
  handleLogout,
}) => {
  const [initialized, setInitialized] = useState(false);
  const [localUser, setLocalUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Verificar se existe usuário no localStorage
    if (typeof window !== "undefined") {
      const userFromStorage = localStorage.getItem("user");
      if (userFromStorage) {
        try {
          const parsedUser = JSON.parse(userFromStorage);
          setLocalUser(parsedUser);
        } catch (error) {
          console.error("Erro ao parsear usuário do localStorage:", error);
        }
      }
      setInitialized(true);
    }
  }, []);

  // Atualizar localUser quando user prop mudar
  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  const handleDonation = () => {
    window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank");
  };

  // Não renderizar nada até que o componente esteja inicializado
  if (!initialized) {
    return null;
  }

  const isLoggedIn = user || localUser;

  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-col text-primary mb-4 p-4 bg-background rounded-lg">
          <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="whitespace-nowrap"
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
