import { Game, VotingEdition } from "@/types/types";
import { games } from "@/repositories/games";

export function rehydrateVotingEditions(
  editions: VotingEdition[]
): VotingEdition[] {
  return editions.map((edition) => ({
    ...edition,
    categories: edition.categories.map((category) => ({
      ...category,
      games: category.gameIds.map(
        (id) => games.find((game) => game.id === id)!
      ),
    })),
  }));
}
