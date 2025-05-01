export interface Game {
  id: string;
  title: string;
  imageUrl: string;
  developer: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  gameIds: string[];
  /** opcionalmente preenchido após reidratação */
  games?: Game[];
}

export interface VotingEdition {
  id: string;
  name: string;
  categories: Category[];
}
  