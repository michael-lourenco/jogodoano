"use client"
import { useRef, useEffect, useState } from "react"
import type { VotingInterfaceHookProps } from "@/types/voting/interfaces"

export function useVotingInterface({
  activeCategory,
  setActiveCategory,
  getCurrentEditionCategories,
  votes,
  selectedEditionId,
}: VotingInterfaceHookProps) {
  const tabsListRef = useRef<HTMLDivElement>(null)
  const [localActiveCategory, setLocalActiveCategory] = useState<string>(activeCategory)

  // Sync local state with props
  useEffect(() => {
    setLocalActiveCategory(activeCategory)
  }, [activeCategory])

  // Reset scroll position when categories or votes change
  useEffect(() => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollLeft = 0
    }
  }, [getCurrentEditionCategories, votes, selectedEditionId])

  return {
    tabsListRef,
    localActiveCategory,
    setLocalActiveCategory,
  }
}
