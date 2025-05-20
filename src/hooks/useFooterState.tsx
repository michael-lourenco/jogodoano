"use client"
import { useState, useEffect } from "react"

interface FooterState {
  height: number
  isExpanded: boolean
}

export function useFooterState() {
  const [footerState, setFooterState] = useState<FooterState>({ height: 64, isExpanded: true })

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return

    const observer = new MutationObserver(() => {
      const isExpanded = footer.classList.contains('h-16')
      setFooterState({
        height: footer.offsetHeight,
        isExpanded
      })
    })

    observer.observe(footer, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Configurar estado inicial
    setFooterState({
      height: footer.offsetHeight,
      isExpanded: footer.classList.contains('h-16')
    })

    return () => observer.disconnect()
  }, [])

  return footerState
} 