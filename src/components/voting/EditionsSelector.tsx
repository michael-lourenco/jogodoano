"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronDown } from "lucide-react"
import type { VotingEdition } from "@/types/types"
import type { CategoryVotes } from "@/types/voting/interfaces"

interface EditionsSelectorProps {
  editions: VotingEdition[]
  selectedEditionId: string
  votes: Record<string, CategoryVotes>
  getCurrentEditionCategories: () => any[]
  onEditionChange: (editionId: string) => void
}

export function EditionsSelector({
  editions,
  selectedEditionId,
  votes,
  getCurrentEditionCategories,
  onEditionChange,
}: EditionsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar o dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedEdition = editions.find(edition => edition.id === selectedEditionId)

  // Função para verificar se uma edição está completa
  const isEditionComplete = (editionId: string) => {
    const edition = editions.find(e => e.id === editionId)
    if (!edition) return false
    
    const editionVotes = votes[editionId] || {}
    const editionCategories = edition.categories || []
    
    return editionCategories.every(category => editionVotes[category.id] !== undefined)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className={`w-full h-9 flex items-center justify-between px-3 bg-background/95 backdrop-blur-sm border-muted ${
          isEditionComplete(selectedEditionId) ? "text-success" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`flex items-center gap-2 ${!isOpen ? 'w-full justify-center' : ''}`}>
          <span className="font-medium">{selectedEdition?.name}</span>
          {isEditionComplete(selectedEditionId) && (
            <CheckCircle2 className="h-4 w-4 text-success" />
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-sm border border-muted rounded-md shadow-lg z-50">
          <div className="py-1 max-h-[300px] overflow-y-auto">
            {editions.map((edition) => {
              const isComplete = isEditionComplete(edition.id)
              return (
                <button
                  key={edition.id}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center justify-between ${
                    edition.id === selectedEditionId ? "bg-muted/30" : ""
                  } ${isComplete ? "text-success" : ""}`}
                  onClick={() => {
                    onEditionChange(edition.id)
                    setIsOpen(false)
                  }}
                >
                  <span>{edition.name}</span>
                  {isComplete && (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}