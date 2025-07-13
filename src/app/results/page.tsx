"use client"

import { ResultsPage } from "@/components/results/ResultsPage"
import { useNavigation } from "@/hooks/useNavigation"

export default function Results() {
  const navigationService = useNavigation()

  const handleBackToHome = () => {
    navigationService.navigateTo("/")
  }

  return <ResultsPage onBackToHome={handleBackToHome} />
} 