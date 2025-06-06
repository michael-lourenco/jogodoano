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
        className={`sticky top-0 w-full bg-background border-dashed border-b transition-all duration-300 z-[100] ${
          isExpanded ? 'h-16' : 'h-4'
        }`}
      >
        <nav className="max-w-md mx-auto px-0 py-0 relative h-full">
          {!isExpanded && (
            <button
              onClick={handleToggle}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-dashed rounded-lg px-3 py-1 flex items-center justify-center hover:bg-muted/50 transition-colors shadow-sm z-50"
              aria-label="Expandir menu"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          )}
          
          <div className={`flex flex-col justify-center items-center h-full transition-all duration-300 ${
            !isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            <div className="h-full flex items-center">
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