"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserInfo } from "@/components/UserInfo";
import { PlayerStatistics } from "@/components/player/PlayerStatistics";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { UserLogout } from "@/components/UserLogout";

export default function PlayerDashboard() {

  const { user, loading, status, handleLogin, handleLogout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          <UserInfo
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
          <Card className="bg-background border-none shadow-none">
            <CardContent className="border-none shadow-none">
              {status === "loading" ? (
                <p>Loading...</p>
              ) : (
                <>
                  <PlayerStatistics
                    user={user}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                  />
                  <UserLogout
                    user={user}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                  />
                </>

              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
