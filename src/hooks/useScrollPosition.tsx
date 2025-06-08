"use client"
import { useState, useEffect, useCallback, RefObject } from "react"

type ScrollPosition = 'top' | 'middle' | 'bottom'

interface UseScrollPositionProps {
  containerRef: RefObject<HTMLDivElement | null>
  onScrollPositionChange?: (position: ScrollPosition) => void
}

export function useScrollPosition({ containerRef, onScrollPositionChange }: UseScrollPositionProps) {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>('top')
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  const resetScroll = useCallback((categoryId: string) => {
    if (containerRef.current) {
      const headerElement = document.getElementById(`category-header-${categoryId}`)
      
      if (headerElement) {
        headerElement.scrollIntoView({ 
          block: 'start', 
          inline: 'nearest',
          behavior: 'auto'
        })
        
        containerRef.current.scrollTop = 0
        
        setTimeout(() => {
          const headerRect = headerElement.getBoundingClientRect()
          
          if (headerRect.top > 100) {
            headerElement.scrollIntoView({ 
              block: 'start', 
              inline: 'nearest',
              behavior: 'auto'
            })
          }
        }, 50)
      }
    }
  }, [containerRef])

  const checkScrollPosition = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100
      
      // Determinar a posição de rolagem
      let position: ScrollPosition = 'top'
      
      if (scrollPercentage < 20) {
        position = 'top'
      } else if (scrollPercentage > 80) {
        position = 'bottom'
      } else {
        position = 'middle'
      }
      
      setScrollPosition(position)
      
      // Manter a verificação de scroll até o fim para compatibilidade
      const isBottom = scrollTop + clientHeight >= scrollHeight - 20 // 20px de tolerância
      setIsScrolledToBottom(isBottom)

      // Chamar o callback se fornecido
      onScrollPositionChange?.(position)
    }
  }, [containerRef, onScrollPositionChange])

  // Configurar o listener de scroll
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      checkScrollPosition() // Verificar posição inicial
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition)
      }
    }
  }, [checkScrollPosition])

  return {
    scrollPosition,
    isScrolledToBottom,
    checkScrollPosition,
    resetScroll
  }
} 