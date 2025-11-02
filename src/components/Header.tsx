"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { UserInfo } from "./UserInfo"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const { user, handleLogin, handleLogout } = useAuth()

  const handleLoginWithExpand = async () => {
    await handleLogin()
  }

  const handleLogoutWithExpand = async () => {
    await handleLogout()
  }

  return (
    <TooltipProvider>
      <header 
        className="sticky top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/40 z-[100] shadow-sm h-16"
      >
        <nav className="max-w-4xl mx-auto px-4 py-0 relative h-full">
          <div className="grid grid-cols-[auto,1fr,auto] items-center h-full">
            {/* Logo com link para Home */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="Jogo do Ano BR" width={48} height={48} className="rounded-md transition-transform duration-300 hover:scale-110" />
              {/* <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Jogo do Ano BR
              </span> */}
            </Link>

            {/* Título centralizado */}
            <Link
              href="/"
              className="justify-self-center inline-flex items-center"
              aria-label="Ir para a página inicial"
            >
              <span className="whitespace-nowrap text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.35em] sm:tracking-[0.45em] md:tracking-[0.55em] text-transparent bg-gradient-to-r from-chart-2 via-primary to-chart-5 bg-clip-text px-4 py-2 rounded-full border border-primary/40 shadow-[0_6px_30px_rgba(59,130,246,0.25)] backdrop-blur-md">
                JOGO DO ANO
              </span>
            </Link>

            {/* UserInfo */}
            <div className="justify-self-end">
              <UserInfo 
                user={user} 
                handleLogin={handleLoginWithExpand} 
                handleLogout={handleLogoutWithExpand}
              />
            </div>
          </div>
        </nav>
      </header>
    </TooltipProvider>
  )
} 