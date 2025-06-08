"use client"
import { useEffect, useState } from "react"
import { SplashScreen } from "@/components/SplashScreen"
import { HomeContent } from "@/components/HomeContent"

export default function Home() {
  const [showSplash, setShowSplash] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setShowSplash(true)
      localStorage.setItem("hasVisited", "true")
    }
    setIsLoading(false)
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    )
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return <HomeContent />
}