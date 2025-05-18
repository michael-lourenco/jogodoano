import React from "react";
import { Button } from "@/components/ui/button";
import { UserData } from "@/services/firebase/FirebaseService";
import { Icon } from "./icons";
import { Heart, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {user ? (
        <div className="flex flex-col text-foreground mb-4 p-4 bg-card rounded-sm">
          <div className="flex items-center gap-4 mb-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <div className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-2 w-full">
              <div className="flex items-center text-lg font-semibold truncate">
                <Icon
                  name="PiTarget"
                  className="w-6 h-6 text-success mx-2 flex-shrink-0"
                />
                <span className="text-foreground">
                  {user.best_score?.value ?? 0}
                </span>
                <Icon
                  name="PiCoin"
                  className="w-6 h-6 text-warning mx-2 flex-shrink-0"
                />
                <span className="text-foreground">{user.currency?.value ?? 0}</span>
                <Icon
                  name="PiStar"
                  className="w-6 h-6 text-info mx-2 flex-shrink-0"
                />
                <span className="text-foreground">
                  {user.credits?.value ?? 0}
                </span>
              </div>
              {mounted && (
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="icon"
                  className="border-accent text-accent-foreground hover:bg-accent"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Button
                onClick={handleDonation}
                variant="outline"
                className="border-chart-4 text-chart-4 hover:bg-chart-4 hover:text-card-foreground flex items-center gap-2 whitespace-nowrap"
                size="sm"
              >
                <Heart className="w-4 h-4" />
                Apoiar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col text-foreground mb-4 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2 w-full">
              <Button onClick={handleLogin} className="text-accent-foreground">
                Sign in with Google
              </Button>
              {mounted && (
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="icon"
                  className="border-accent text-accent-foreground hover:bg-accent"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
