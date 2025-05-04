import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { VotingEdition } from "@/types/types";

interface EditionsSelectorProps {
  editions: VotingEdition[];
  selectedEditionId: string;
  votes: Record<string, Record<string, string>>;
  getCurrentEditionCategories: () => any; // Usando tipo mais flexível para evitar conflitos
  onEditionChange: (editionId: string) => void;
}

export function EditionsSelector({
  editions,
  selectedEditionId,
  votes,
  getCurrentEditionCategories,
  onEditionChange
}: EditionsSelectorProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const scrollAmount = 150;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 z-10 bg-background/80"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="w-full overflow-hidden px-10">
          <div 
            ref={tabsContainerRef}
            className="flex overflow-x-auto scrollbar-hide space-x-2 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {editions.map((edition) => (
              <Button
                key={edition.id}
                variant={selectedEditionId === edition.id ? "default" : "outline"}
                className={`flex-shrink-0 ${
                  selectedEditionId === edition.id 
                    ? "bg-gradient-to-r from-chart-2 to-green-500" 
                    : votes[edition.id] && Object.keys(votes[edition.id]).length > 0 
                      ? "text-green-500 border-green-500/30" 
                      : ""
                }`}
                onClick={() => onEditionChange(edition.id)}
              >
                {edition.name}
                {votes[edition.id] && 
                 getCurrentEditionCategories().length > 0 && 
                 Object.keys(votes[edition.id]).length === getCurrentEditionCategories().length && (
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 z-10 bg-background/80"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}