import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { dbFirestore, updateUserVotes, UserData } from "@/services/firebase/FirebaseService";
import { VotingEdition } from "@/types/types";

type VotesState = Record<string, Record<string, string>>;

interface UseVotesProps {
  user: UserData | null;
  editions: VotingEdition[];
}

interface UseVotesReturn {
  votes: VotesState;
  hasVoted: boolean;
  votedEditionId: string;
  isSubmitting: boolean;
  handleVote: (editionId: string, categoryId: string, gameId: string) => void;
  handleSubmitVotes: (editionId: string) => Promise<boolean>;
  setHasVoted: (value: boolean) => void;
  setVotedEditionId: (value: string) => void;
  areAllCategoriesVoted: (editionId: string, categories: { id: string }[]) => boolean;
}

export function useVotes({ user, editions }: UseVotesProps): UseVotesReturn {
  const [votes, setVotes] = useState<VotesState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedEditionId, setVotedEditionId] = useState<string>("");
  const [userVotesLoaded, setUserVotesLoaded] = useState(false);

  // Carregar votos do usuário quando disponíveis
  useEffect(() => {
    if (user && user.votes) {
      const votesData = user.votes;

      if (votesData && typeof votesData === "object") {
        const isYearFormat = Object.keys(votesData).some(
          (key) => votesData[key] && typeof votesData[key] === "object"
        );

        if (isYearFormat) {
          setVotes(votesData as VotesState);
        } else {
          setVotes({
            "2025": votesData as unknown as Record<string, string>,
          });
        }
      } else {
        setVotes({});
      }
      setUserVotesLoaded(true);
    } else {
      setVotes({});
      setUserVotesLoaded(false);
    }
  }, [user]);

  // Função para registrar um voto
  const handleVote = useCallback((editionId: string, categoryId: string, gameId: string) => {
    setVotes((prev) => {
      // Verificar se o voto está mudando
      const currentVote = prev[editionId]?.[categoryId];
      if (currentVote === gameId) {
        // Se o voto é o mesmo, não faz nada para evitar atualizações desnecessárias
        return prev;
      }
      
      // Se o voto é diferente, atualiza o estado
      return {
        ...prev,
        [editionId]: {
          ...(prev[editionId] || {}),
          [categoryId]: gameId,
        },
      };
    });
  }, []);

  // Verificar se todas as categorias foram votadas
  const areAllCategoriesVoted = useCallback((editionId: string, categories: { id: string }[]) => {
    const editionVotes = votes[editionId] || {};
    return categories.every((category) => editionVotes[category.id]);
  }, [votes]);

  // Função para enviar os votos
  const handleSubmitVotes = useCallback(async (editionId: string): Promise<boolean> => {
    const currentEdition = editions.find((edition) => edition.id === editionId);
    
    if (!currentEdition) {
      toast.error("Edição não encontrada", {
        description: "Não foi possível encontrar a edição selecionada.",
      });
      return false;
    }
    
    const currentEditionVotes = votes[editionId] || {};
    const allCategoriesVoted = areAllCategoriesVoted(editionId, currentEdition.categories);

    if (!allCategoriesVoted) {
      toast.error("Votação incompleta", {
        description: "Por favor, vote em todas as categorias antes de enviar.",
      });
      return false;
    }

    if (!user || !user.email) {
      toast.error("Login necessário", {
        description: "Você precisa estar logado para votar.",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      // Usar os votos existentes do usuário como base e adicionar/atualizar os novos
      const userVotes = user.votes || {};
      
      // Combinar os votos existentes com os novos
      const updatedVotes = {
        ...userVotes,
        [editionId]: votes[editionId] || {}
      };

      await updateUserVotes(user.email, updatedVotes, dbFirestore);

      setHasVoted(true);
      setVotedEditionId(editionId);
      toast.success("Votação enviada com sucesso!", {
        description: `Obrigado por participar da votação do Jogo do Ano de ${editionId}!`,
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar votos:", error);
      toast.error("Erro ao enviar votos", {
        description: "Ocorreu um erro ao processar sua votação. Tente novamente.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [votes, editions, user, areAllCategoriesVoted]);

  return {
    votes,
    hasVoted,
    votedEditionId,
    isSubmitting,
    handleVote,
    handleSubmitVotes,
    setHasVoted,
    setVotedEditionId,
    areAllCategoriesVoted
  };
}