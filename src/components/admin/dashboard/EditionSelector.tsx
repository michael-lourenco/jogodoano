"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEditions } from "@/hooks/useEditions"

export function EditionSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { editions, isLoading } = useEditions()
  const [selectedEdition, setSelectedEdition] = useState<string>(searchParams.get("edition") || "")

  useEffect(() => {
    if (editions.length > 0 && !selectedEdition) {
      setSelectedEdition(editions[0].id)
    }
  }, [editions, selectedEdition])

  const handleEditionChange = (value: string) => {
    setSelectedEdition(value)
    router.push(`/admin?edition=${value}`)
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-xs animate-pulse">
        <div className="h-10 bg-muted rounded-md"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <Select value={selectedEdition} onValueChange={handleEditionChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma edição" />
        </SelectTrigger>
        <SelectContent>
          {editions.map((edition) => (
            <SelectItem key={edition.id} value={edition.id}>
              {edition.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
