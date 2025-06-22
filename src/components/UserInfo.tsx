import React from "react";
import { Button } from "@/components/ui/button";
import { UserData } from "@/services/firebase/FirebaseService";
import { Icon } from "./icons";
import { Heart, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface UserInfoProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  user,
  handleLogin,
  handleLogout,
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDonation = () => {
    window.open("https://apoia.se/appjogodoano", "_blank");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          {/* Informações do usuário - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon name="PiTarget" className="w-4 h-4 text-success" />
              <span className="font-medium">{user.best_score?.value ?? 0}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="PiCoin" className="w-4 h-4 text-warning" />
              <span className="font-medium">{user.currency?.value ?? 0}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="PiStar" className="w-4 h-4 text-info" />
              <span className="font-medium">{user.credits?.value ?? 0}</span>
            </div>
          </div>

          {/* Informações do usuário - Mobile */}
          <div className="md:hidden flex items-center gap-1">
            <div className="flex items-center gap-1 text-xs">
              <Icon name="PiTarget" className="w-3 h-3 text-success" />
              <span className="font-medium">{user.best_score?.value ?? 0}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Icon name="PiCoin" className="w-3 h-3 text-warning" />
              <span className="font-medium">{user.currency?.value ?? 0}</span>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDonation}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-1 border-primary/20 text-primary hover:bg-primary/10"
                >
                  <Heart className="w-3 h-3" />
                  <span className="text-xs">Apoiar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Apoiar via Apoia.se</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDonation}
                  variant="outline"
                  size="icon"
                  className="sm:hidden border-primary/20 text-primary hover:bg-primary/10"
                >
                  <Heart className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Apoiar via Apoia.se</p>
              </TooltipContent>
            </Tooltip>

            {mounted && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleTheme}
                    variant="outline"
                    size="icon"
                    className="border-border/40 hover:bg-muted/50"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-3 h-3" />
                    ) : (
                      <Moon className="w-3 h-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Alternar tema</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="icon"
                  className="border-border/40 hover:bg-muted/50"
                >
                  <LogOut className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sair</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </>
      ) : (
        <>
          {/* Botão de login */}
          <Button 
            onClick={handleLogin} 
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <span className="hidden sm:inline">Entrar</span>
            <span className="sm:hidden">Login</span>
          </Button>

          {/* Botão de tema */}
          {mounted && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="icon"
                  className="border-border/40 hover:bg-muted/50"
                >
                  {theme === "dark" ? (
                    <Sun className="w-3 h-3" />
                  ) : (
                    <Moon className="w-3 h-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Alternar tema</p>
              </TooltipContent>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};
