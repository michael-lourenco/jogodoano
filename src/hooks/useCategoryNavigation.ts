"use client"
import { useRef } from "react"

export function useCategoryNavigation() {
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  return {
    categoryRefs,
  }
}
