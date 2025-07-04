import { Card, CardContent } from "@/components/ui/card"
import { Category } from "@/types/types"
import { GameCard } from "@/components/voting/GameCard"
import { motion } from "framer-motion"
import { useEffect, useState, useCallback } from "react"

interface CategorySectionProps {
  category: Category
  selectedGameId?: string
  onVote: (gameId: string) => void
  disabled?: boolean
}

export function CategorySection({ category, selectedGameId, onVote, disabled = false }: CategorySectionProps) {
  // Estado local para acompanhar a seleção e garantir re-renderizações adequadas
  const [selected, setSelected] = useState<string | undefined>(selectedGameId);

  // Atualiza o estado local quando o prop selectedGameId muda
  useEffect(() => {
    // Só atualiza se realmente mudou, para evitar ciclos
    if (selected !== selectedGameId) {
      setSelected(selectedGameId);
    }
  }, [selectedGameId]);

  // Função para lidar com a seleção de um jogo
  const handleSelect = useCallback((gameId: string) => {
    if (disabled) return
    setSelected(gameId); // Atualiza o estado local imediatamente
    onVote(gameId); // Propaga o evento de voto para o componente pai
  }, [onVote, disabled]);

  // Animação para o container de cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2, // Pequeno atraso para começar após a animação do cabeçalho
      },
    },
  };

  // Animação para cada card individual
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <Card className="border border-muted/30 bg-background/50 shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {category.games?.map((game, index) => (
            <motion.div key={game.id} variants={itemVariants} custom={index}>
              <GameCard
                game={game}
                isSelected={selected === game.id}
                onSelect={() => handleSelect(game.id)}
                disabled={disabled}
              />
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}