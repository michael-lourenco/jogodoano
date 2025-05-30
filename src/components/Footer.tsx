"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from "./icons"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

const menuItems = [
  { icon: "LuHome", label: "Home", href: "/" },
  { icon: "LuPlay", label: "Votar", href: "/voting" },
  { icon: "LuHelpCircle", label: "Sobre", href: "/about" },
  { icon: "LuUser", label: "Perfil", href: "/player" },
] as const

export function Footer() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Efeito para controlar o colapso automático ao mudar de página
  useEffect(() => {
    if (!isMobile) return

    // Expande o menu quando muda de página
    setIsExpanded(true)

    // Colapsa após 3 segundos
    const timer = setTimeout(() => {
      setIsExpanded(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [pathname, isMobile])

  // Efeito para controlar o colapso ao rolar
  useEffect(() => {
    if (!isMobile) return

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
  }, [lastScrollY, isMobile])

  return (
    <TooltipProvider>
      <footer 
        className={`sticky bottom-0 w-full bg-background/80 backdrop-blur-md border-t border-border/40 transition-all duration-300 z-[100] shadow-[0_-1px_3px_rgba(0,0,0,0.1)] ${
          isMobile ? (isExpanded ? 'h-16' : 'h-4') : 'h-16'
        }`}
      >
        <nav className="max-w-md mx-auto px-0 py-0 relative">
          {isMobile && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-md border border-border/40 rounded-t-lg px-3 py-1 flex items-center justify-center hover:bg-muted/50 transition-all duration-200 shadow-sm z-50 hover:scale-105 active:scale-95"
              aria-label="Expandir menu"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
          )}
          
          <div className={`flex justify-between items-center transition-all duration-300 ${
            isMobile && !isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={isActive ? "ghost" : "secondary"}
                      className={`flex-1 flex flex-col items-center justify-center h-16 space-y-1 rounded-none transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <Link href={item.href} className="w-full h-full flex flex-col items-center justify-center">
                        <Icon name={item.icon} className={`h-5 w-5 transition-transform duration-200 ${
                          isActive ? 'scale-110' : 'group-hover:scale-105'
                        }`} />
                        <span className={`text-xs font-medium transition-colors duration-200 ${
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        }`}>{item.label}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-background/80 backdrop-blur-md border border-border/40">
                    <p className="text-sm font-medium">{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </nav>
      </footer>
    </TooltipProvider>
  )
}

