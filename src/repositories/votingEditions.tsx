import { VotingEdition } from "@/types/types";
export const votingEditions: VotingEdition[] = [
  {
    id: "2025",
    name: "2025",
    categories: [
      {
        id: "goty",
        name: "Jogo do Ano",
        description: "O melhor jogo de 2025",
        gameIds: [
          "the-talos-principle-reawakened",
          "despelote",
          "gosthofyotei",
          "doomthedarkages",
          "likeadragonpirateyakuza",
          "splitfiction",
          "borderlands4",
          "thefirstberserkerkhazan",
          "clairobscurexpedition33",
          "kingdomcomedeliverance2",
          "monsterhunterwilds",
          "the-roottrees-are-dead",
          "lonely-mountains-snow-riders",
          "citizensleeper2",
          "bionic-bay",
          "starvaders",
          "the-hundred-line-last-defense-academy",
          "two-point-museum",
          "keep-driving",
          "endermagnolia",
        ],
      },
      {
        id: "sportsracing",
        name: "Melhores Esportes/Corridas",
        description:
          "Para os melhores jogos de corrida e esportes tradicionais e não tradicionais.",
        gameIds: ["wwe2k25", "mlb-the-show-25", "nba-2k25","pga-tour-2k25"],
      },
      {
        id: "simstrategy",
        name: "Melhor Simulador/Estratégia",
        description:
          "Melhor jogo focado em simulação em tempo real ou por turnos ou jogabilidade de estratégia, independentemente da plataforma.",
        gameIds: ["sidmeierscivilization7"],
      },
      {
        id: "fighting",
        name: "Melhor jogo de Luta",
        description:
          "Para o melhor jogo projetado principalmente em torno do combate corpo a corpo.",
        gameIds: ["fatalfurycityofwolves"],
      },
      {
        id: "gotybr",
        name: "Jogo do Ano BR",
        description: "O melhor jogo brasileiro de 2025",
        gameIds: ["markofthedeep"],
      },
      {
        id: "rpg",
        name: "Melhor RPG",
        description: "Jogos com elementos de progressão, narrativa profunda e customização",
        gameIds: [
          "gosthofyotei",
          "likeadragonpirateyakuza",
          "borderlands4",
          "avowed",
          "assasinscreedshadows",
          "monsterhunterwilds",
          "kingdomcomedeliverance2",
          "clairobscurexpedition33",
          "thefirstberserkerkhazan",
          "dragonageveilguard",
        ],
      },
      {
        id: "indie",
        name: "Melhor Jogo Indie",
        description:
          "Jogos desenvolvidos por estúdios independentes com ideias inovadoras",
        gameIds: [
          "markofthedeep",
          "hades2"
        ],
      },
      {
        id: "multiplayer",
        name: "Melhor Multiplayer",
        description:
          "Jogos com experiências multijogador excepcionais, cooperativas ou competitivas",
        gameIds: ["marvelrivals"],
      },
      {
        id: "action",
        name: "Melhor Jogo de Ação",
        description: "Jogos com foco em combate, reflexos rápidos e adrenalina",
        gameIds: [
          "gosthofyotei",
          "doomthedarkages",
          "likeadragonpirateyakuza",
          "splitfiction",
          "borderlands4",
          "riseoftheronin",
          "avowed",
          "assasinscreedshadows",
          "hades2",
          "monsterhunterwilds",
          "indianajonesgreatcircle",
          "kingdomcomedeliverance2",
          "endermagnolia",
          "littlenightmares3",
          "metroidprime4",
          "mafiaoldcountry",
        ],
      },
      {
        id: "family",
        name: "Melhor jogo para Família",
        description:
          "Para o melhor jogo apropriado para jogar em família, independentemente do gênero ou plataforma.",
        gameIds: ["gosthofyotei"],
      },
    ],
  },
  // {
  //   id: "2024",
  //   name: "2024",
  //   categories: [
  //     {
  //       id: "goty_2024",
  //       name: "Jogo do Ano",
  //       description: "O melhor jogo de 2024",
  //       gameIds: ["finalfantasyviirebirth"],
  //     },
  //     {
  //       id: "action_2024",
  //       name: "Melhor Jogo de Ação",
  //       description:
  //         "Para o melhor jogo focado em combate, superação de desafios e reflexos.",
  //       gameIds: ["finalfantasyviirebirth"],
  //     },
  //   ],
  // },
  {
    id: "all_time",
    name: "Melhor de Todos",
    categories: [
      {
        id: "all_time_goty",
        name: "O Melhor",
        description: "O melhor jogo de todos os tempos",
        gameIds: [
          "gosthofyotei",
          "doomthedarkages",
          "likeadragonpirateyakuza",
          "splitfiction",
          "borderlands4",
          "thefirstberserkerkhazan",
          "clairobscurexpedition33",
        ],
      },
      {
        id: "all_time_sportsracing",
        name: "Melhores Esportes/Corridas",
        description:
          "Para os melhores jogos de corrida e esportes tradicionais e não tradicionais.",
        gameIds: ["wwe2k25"],
      },
      {
        id: "all_time_simstrategy",
        name: "Melhor Simulador/Estratégia",
        description:
          "Melhor jogo focado em simulação em tempo real ou por turnos ou jogabilidade de estratégia, independentemente da plataforma.",
        gameIds: ["sidmeierscivilization7"],
      },
      {
        id: "all_time_fighting",
        name: "Melhor jogo de Luta",
        description:
          "Para o melhor jogo projetado principalmente em torno do combate corpo a corpo.",
        gameIds: ["fatalfurycityofwolves"],
      },
      {
        id: "all_time_gotybr",
        name: "Jogo do Ano BR",
        description: "O melhor jogo brasileiro de 2025",
        gameIds: ["markofthedeep"],
      },
      {
        id: "all_time_rpg",
        name: "Melhor RPG",
        description: "Jogos com elementos de progressão, narrativa profunda e customização",
        gameIds: [
          "gosthofyotei",
          "likeadragonpirateyakuza",
          "borderlands4",
          "avowed",
          "assasinscreedshadows",
          "monsterhunterwilds",
          "kingdomcomedeliverance2",
          "clairobscurexpedition33",
          "thefirstberserkerkhazan",
          "dragonageveilguard",
        ],
      },
      {
        id: "all_time_indie",
        name: "Melhor Jogo Indie",
        description:
          "Jogos desenvolvidos por estúdios independentes com ideias inovadoras",
        gameIds: [
          "markofthedeep",
          "hades2"
        ],
      },
      {
        id: "all_time_multiplayer",
        name: "Melhor Multiplayer",
        description:
          "Jogos com experiências multijogador excepcionais, cooperativas ou competitivas",
        gameIds: ["marvelrivals"],
      },
      {
        id: "all_time_action",
        name: "Melhor Jogo de Ação",
        description: "Jogos com foco em combate, reflexos rápidos e adrenalina",
        gameIds: [
          "gosthofyotei",
          "doomthedarkages",
          "likeadragonpirateyakuza",
          "splitfiction",
          "borderlands4",
          "riseoftheronin",
          "avowed",
          "assasinscreedshadows",
          "hades2",
          "monsterhunterwilds",
          "indianajonesgreatcircle",
          "kingdomcomedeliverance2",
          "clairobscurexpedition33",
          "citizensleeper2",
          "endermagnolia",
          "littlenightmares3",
          "metroidprime4",
          "mafiaoldcountry",
        ],
      },
      {
        id: "all_time_family",
        name: "Melhor jogo para Família",
        description:
          "Para o melhor jogo apropriado para jogar em família, independentemente do gênero ou plataforma.",
        gameIds: ["gosthofyotei",]
      },
    ],
  },
];
