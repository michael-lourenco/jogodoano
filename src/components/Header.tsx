"use client"

import { usePathname } from "next/navigation"
import { Icon } from "./icons"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { UserInfo } from "./UserInfo"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { user, handleLogin, handleLogout } = useAuth()

  // Efeito para controlar o colapso automático ao mudar de página
  useEffect(() => {
    if (!pathname) return

    // Expande o menu quando muda de página
    setIsExpanded(true)

    // Colapsa após 3 segundos
    const timer = setTimeout(() => {
      setIsExpanded(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [pathname])

  // Efeito para controlar o colapso ao rolar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Colapsa ao rolar para baixo após 100px
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsExpanded(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleToggle = () => {
    setIsExpanded(true)
    // Força o scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoginWithExpand = async () => {
    setIsExpanded(true)
    await handleLogin()
  }

  const handleLogoutWithExpand = async () => {
    setIsExpanded(true)
    await handleLogout()
  }

  return (
    <TooltipProvider>
      <header 
        className={`sticky top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/40 transition-all duration-300 z-[100] shadow-sm ${
          isExpanded ? 'h-16' : 'h-4'
        }`}
      >
        <nav className="max-w-4xl mx-auto px-4 py-0 relative h-full">
          {!isExpanded && (
            <button
              onClick={handleToggle}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-md border border-border/40 rounded-lg px-3 py-1 flex items-center justify-center hover:bg-muted/50 transition-colors shadow-sm z-50"
              aria-label="Expandir menu"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          )}
          
          <div className={`grid grid-cols-[auto,1fr,auto] items-center h-full transition-all duration-300 ${
            !isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            {/* Logo com link para Home */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="Jogo do Ano BR" width={32} height={32} className="rounded-md" />
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