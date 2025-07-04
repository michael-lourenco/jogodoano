import { VotingEdition } from "@/types/types";
export const votingEditions: VotingEdition[] = [
  {
    id: "2025",
    name: "2025",
    isLimitedTime: true,
    startAt: new Date("2025-11-01T00:00:00Z"),
    endAt: new Date("2025-11-30T23:59:59Z"),
    status: "upcoming",
    categories: [
      {
        id: "goty",
        name: "Jogo do Ano",
        description: "O melhor jogo de 2025",
        gameIds: [
          "thefirstberserkerkhazan",
          "clairobscurexpedition33",
          "kingdomcomedeliverance2",
          "death-stranding-2-on-the-beach",
          "likeadragonpirateyakuza",
          "splitfiction",
          "monsterhunterwilds",
        ],
      },
      {
        id: "gotybr",
        name: "Jogo do Ano BR",
        description: "O melhor jogo brasileiro de 2025",
        gameIds: ["markofthedeep","enigma-do-medo","aila","e-lich-corporate-souls","no-heroes-here-2","pipistrello-and-the-cursed-yoyo"],
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
        gameIds: ["sidmeierscivilization7", "stellar-settlers-space-base-builder","citizensleeper2","tempest-rising","warside","age-of-mythology-retold-immortal-pillars"],
      },
      {
        id: "fighting",
        name: "Melhor jogo de Luta",
        description:
          "Para o melhor jogo projetado principalmente em torno do combate corpo a corpo.",
        gameIds: ["fatalfurycityofwolves", "iron-saga-vs","cyber-city-clash","knock-off","hunter-x-hunter-nen-x-impact"],
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
          "hades2",
          "splitfiction"
        ],
      },
      {
        id: "multiplayer",
        name: "Melhor Multiplayer",
        description:
          "Jogos com experiências multijogador excepcionais, cooperativas ou competitivas",
        gameIds: ["marvelrivals","monsterhunterwilds", "splitfiction","killing-floor-3"],
      },
      {
        id: "action",
        name: "Melhor Jogo de Ação/Aventura",
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
    ],
  },
  {
    id: "all_time",
    name: "Todos os Tempos",
    isLimitedTime: false,
    status: "active",
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
    ],
  },
];
