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

  // Efeito para controlar o colapso automático ao rolar
  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Colapsa ao rolar para baixo, expande ao rolar para cima
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsExpanded(false)
      } else if (currentScrollY < lastScrollY) {
        setIsExpanded(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isMobile])

  return (
    <TooltipProvider>
      <footer 
        className={`sticky bottom-0 w-full bg-background border-dashed border-t transition-all duration-300 ${
          isMobile ? (isExpanded ? 'h-16' : 'h-4') : 'h-16'
        }`}
      >
        <nav className="max-w-md mx-auto px-0 py-0 relative">
          {isMobile && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background border border-dashed rounded-t-lg px-3 py-1 flex items-center justify-center hover:bg-muted/50 transition-colors shadow-sm z-50"
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
                      className="flex-1 flex flex-col items-center justify-center h-16 space-y-1 rounded-none"
                    >
                      <Link href={item.href}>
                        <Icon name={item.icon} className="h-5 w-5" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{item.label}</p>
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

