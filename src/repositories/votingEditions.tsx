// export interface Game {
//   id: string
//   title: string
//   imageUrl: string
//   developer: string
// }

// export interface Category {
//   id: string
//   name: string
//   description: string
//   games: Game[]
// }

// export interface VotingEdition {
//   id: string
//   name: string
//   categories: Category[]
// }

// export const votingEditions: VotingEdition[] = [
//     {
//       id: "2025",
//       name: "2025",
//       categories:[
//         {
//           id: "goty",
//           name: "Jogo do Ano",
//           description: "O melhor jogo de 2025",
//           games: [
//             {
//               id: "gtavi",
//               title: "GTA VI",
//               imageUrl: "/gta-vi.jpg?height=200&width=350",
//               developer: "RockStar",
//             },
//             {
//               id: "gosthofyotei",
//               title: "Ghost of Yotei",
//               imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
//               developer: "Sucker Punch Productions",
//             },
//             {
//               id: "doomthedarkages",
//               title: "Doom: The Dark Ages",
//               imageUrl: "/doom-dark-ages.jpg?height=200&width=350",
//               developer: "Id Software / Bethesda Softworks",
//             },
//             {
//               id: "likeadragonpirateyakuza",
//               title: "Like a Dragon: Pirate Yakuza in Hawaii",
//               imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
//               developer: "Ryu Ga Gotoku Studio, Sega",
//             },
//             {
//               id: "splitfiction",
//               title: "Split Fiction",
//               imageUrl: "/split-fiction.jpg?height=200&width=350",
//               developer: "Hazelight Studios",
//             },
//             {
//               id: "borderlands4",
//               title: "Borderlands 4",
//               imageUrl: "/borderlands-4.png?height=200&width=350",
//               developer: "Gearbox Software",
//             },
//             {
//               id: "thefirstberserkerkhazan",
//               title: "The First Berserker Khazan",
//               imageUrl: "/berserker-khazan.jpg?height=200&width=350",
//               developer: "Neople",
//             },
//             {
//               id: "clairobscurexpedition33",
//               title: "Clair Obscur: Expedition 33",
//               imageUrl: "/expedition-33.jpg?height=200&width=350",
//               developer: "Sandfall Interactive",
//             },
//           ],
//         },
//         {
//           id: "sportsracing",
//           name: "Melhores Esportes/Corridas",
//           description: "Para os melhores jogos de corrida e esportes tradicionais e não tradicionais.",
//           games: [
//             {
//               id: "wwe2k25",
//               title: "WWE 2K25",
//               imageUrl: "/wwe2k25.png?height=200&width=350",
//               developer: "Visual Concepts",
//             },
//           ],
//         },
//         {
//           id: "simstrategy",
//           name: "Melhor Simulador/Estratégia",
//           description: "Melhor jogo focado em simulação em tempo real ou por turnos ou jogabilidade de estratégia, independentemente da plataforma.",
//           games: [
//             {
//               id: "sidmeierscivilization7",
//               title: "Sid Meier’s Civilization 7",
//               imageUrl: "/sid-meiers-civilization-7.jpg?height=200&width=350",
//               developer: "Firaxis Games",
//             },
//           ],
//         },
//         {
//           id: "fighting",
//           name: "Melhor jogo de Luta",
//           description: "Para o melhor jogo projetado principalmente em torno do combate corpo a corpo.",
//           games: [
//             {
//               id: "fatalfurycityofwolves",
//               title: "Fatal Fury: City of Wolves",
//               imageUrl: "/fatal-fury-city-of-wolves.jpg?height=200&width=350",
//               developer: "SNK",
//             },
//           ],
//         },
//         {
//           id: "gotybr",
//           name: "Jogo do Ano BR",
//           description: "O melhor jogo brasileiro de 2025",
//           games: [
//             {
//               id: "markofthedeep",
//               title: "Mark of the Deep",
//               imageUrl: "/mark-of-the-deep.jpg?height=200&width=350",
//               developer: "Mad Mimic",
//             },
//           ],
//         },
//         {
//           id: "rpg",
//           name: "Melhor RPG",
//           description: "Jogos com elementos de progressão, narrativa profunda e customização",
//           games: [
//             {
//               id: "gosthofyotei",
//               title: "Ghost of Yotei",
//               imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
//               developer: "Sucker Punch Productions",
//             },
//             {
//               id: "likeadragonpirateyakuza",
//               title: "Like a Dragon: Pirate Yakuza in Hawaii",
//               imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
//               developer: "Ryu Ga Gotoku Studio, Sega",
//             },
//             {
//               id: "borderlands4",
//               title: "Borderlands 4",
//               imageUrl: "/borderlands-4.png?height=200&width=350",
//               developer: "Gearbox Software",
//             },
//             {
//               id: "avowed",
//               title: "Avowed",
//               imageUrl: "/avowed.png?height=200&width=350",
//               developer: "Obsidian",
//             },
//             {
//               id: "assasinscreedshadows",
//               title: "Assasin’s Creed Shadows",
//               imageUrl: "/assassins-creed-shadows.png?height=200&width=350",
//               developer: "Ubisoft",
//             },
//             {
//               id: "monsterhunterwilds",
//               title: "Monster Hunter Wilds",
//               imageUrl: "/monster-hunter-wilds.png?height=200&width=350",
//               developer: "Capcom",
//             },
//             {
//               id: "kingdomcomedeliverance2",
//               title: "Kingdom Come: Deliverance 2",
//               imageUrl: "/kingdom-come-deliverance-2.jpg?height=200&width=350",
//               developer: "Warhorse Studios",
//             },
//             {
//               id: "clairobscurexpedition33",
//               title: "Clair Obscur: Expedition 33",
//               imageUrl: "/expedition-33.jpg?height=200&width=350",
//               developer: "Sandfall Interactive",
//             },
//             {
//               id: "thefirstberserkerkhazan",
//               title: "The First Berserker Khazan",
//               imageUrl: "/berserker-khazan.jpg?height=200&width=350",
//               developer: "Neople",
//             },
//             {
//               id: "dragonageveilguard",
//               title: "Dragon Age The Veil Guard",
//               imageUrl: "/dragon-age-the-veilguard.png?height=200&width=350",
//               developer: "Bioware",
//             },
//           ],
//         },
//         {
//           id: "indie",
//           name: "Melhor Jogo Indie",
//           description: "Jogos desenvolvidos por estúdios independentes com ideias inovadoras",
//           games: [
//             {
//               id: "markofthedeep",
//               title: "Mark of the Deep",
//               imageUrl: "/mark-of-the-deep.jpg?height=200&width=350",
//               developer: "Mad Mimic",
//             },
//           ],
//         },
//         {
//           id: "multiplayer",
//           name: "Melhor Multiplayer",
//           description: "Jogos com experiências multijogador excepcionais, cooperativas ou competitivas",
//           games: [
//             {
//               id: "marvelrivals",
//               title: "Marvel Rivals",
//               imageUrl: "/marvel-rivals.png?height=200&width=350",
//               developer: "NetEase",
//             },
//           ],
//         },
//         {
//           id: "action",
//           name: "Melhor Jogo de Ação",
//           description: "Jogos com foco em combate, reflexos rápidos e adrenalina",
//           games: [
//             {
//               id: "gtavi",
//               title: "GTA VI",
//               imageUrl: "/gta-vi.jpg?height=200&width=350",
//               developer: "RockStar",
//             },
//             {
//               id: "gosthofyotei",
//               title: "Ghost of Yotei",
//               imageUrl: "/ghost-of-yotei.jpg?height=200&width=350",
//               developer: "Sucker Punch Productions",
//             },
//             {
//               id: "doomthedarkages",
//               title: "Doom: The Dark Ages",
//               imageUrl: "/doom-dark-ages.jpg?height=200&width=350",
//               developer: "Id Software / Bethesda Softworks",
//             },
//             {
//               id: "likeadragonpirateyakuza",
//               title: "Like a Dragon: Pirate Yakuza in Hawaii",
//               imageUrl: "/like-a-dragon-pirate-yakusa.jpg?height=200&width=350",
//               developer: "Ryu Ga Gotoku Studio, Sega",
//             },
//             {
//               id: "splitfiction",
//               title: "Split Fiction",
//               imageUrl: "/split-fiction.jpg?height=200&width=350",
//               developer: "Hazelight Studios",
//             },
//             {
//               id: "borderlands4",
//               title: "Borderlands 4",
//               imageUrl: "/borderlands-4.png?height=200&width=350",
//               developer: "Gearbox Software",
//             },
//             {
//               id: "riseoftheronin",
//               title: "Rise Of The Ronin",
//               imageUrl: "/rise-of-the-ronin.jpg?height=200&width=350",
//               developer: "Team Ninja, Koei Tecmo Games",
//             },
//             {
//               id: "avowed",
//               title: "Avowed",
//               imageUrl: "/avowed.png?height=200&width=350",
//               developer: "Obsidian",
//             },
//             {
//               id: "assasinscreedshadows",
//               title: "Assasin’s Creed Shadows",
//               imageUrl: "/assassins-creed-shadows.png?height=200&width=350",
//               developer: "Ubisoft",
//             },
//             {
//               id: "hades2",
//               title: "Hades II",
//               imageUrl: "/hades-2.png?height=200&width=350",
//               developer: "Supergiant Games",
//             },
//             {
//               id: "monsterhunterwilds",
//               title: "Monster Hunter Wilds",
//               imageUrl: "/monster-hunter-wilds.png?height=200&width=350",
//               developer: "Capcom",
//             },
//             {
//               id: "indianajonesgreatcircle",
//               title: "Indiana Jones and the Great Circle",
//               imageUrl: "/indiana-jones.jpg?height=200&width=350",
//               developer: "MachineGames",
//             },
//             {
//               id: "kingdomcomedeliverance2",
//               title: "Kingdom Come: Deliverance 2",
//               imageUrl: "/kingdom-come-deliverance-2.jpg?height=200&width=350",
//               developer: "Warhorse Studios",
//             },
//             {
//               id: "clairobscurexpedition33",
//               title: "Clair Obscur: Expedition 33",
//               imageUrl: "/expedition-33.jpg?height=200&width=350",
//               developer: "Sandfall Interactive",
//             },
//             {
//               id: "citizensleeper2",
//               title: "Citizen Sleeper 2: Starward Vector",
//               imageUrl: "/citizen-sleeper-2.jpg?height=200&width=350",
//               developer: "Jump Over The Age",
//             },
//             {
//               id: "endermagnolia",
//               title: "Ender Magnolia: Bloom in the Mist",
//               imageUrl: "/ender-magnolia.jpg?height=200&width=350",
//               developer: "Adglobe, Live Wire Inc.",
//             },
//             {
//               id: "littlenightmares3",
//               title: "Little Nightmares 3",
//               imageUrl: "/little-nightmares-3.jpg?height=200&width=350",
//               developer: "Supermassive Games",
//             },
//             {
//               id: "metroidprime4",
//               title: "Metroid Prime 4: Beyond",
//               imageUrl: "/metroid-prime-4.png?height=200&width=350",
//               developer: "Retro Studios, Nintendo",
//             },
//             {
//               id: "mafiaoldcountry",
//               title: "Mafia: The Old Country",
//               imageUrl: "/mafia-the-old-country.png?height=200&width=350",
//               developer: "Hangar 13",
//             },
//           ],
//         },
//         {
//           id: "family",
//           name: "Melhor jogo para Família",
//           description: "Para o melhor jogo apropriado para jogar em família, independentemente do gênero ou plataforma.",
//           games: [
//             {
//               id: "gtavi",
//               title: "GTA VI",
//               imageUrl: "/gta-vi.jpg?height=200&width=350",
//               developer: "RockStar",
//             },
//           ],
//         },
//       ]
//     },
//     {
//       id: "2024",
//       name: "2024",
//       categories: [
//         {
//           id: "goty_2024",
//           name: "Jogo do Ano",
//           description: "O melhor jogo de 2024",
//           games: [
//             {
//               id: "finalfantasyviirebirth",
//               title: "Final Fantasy VII Rebirth",
//               imageUrl: "/ffvii-rebirth.png?height=200&width=350",
//               developer: "Square Enix",
//             },
//           ],
//         },
//         {
//           id: "action_2024",
//           name: "Melhor Jogo de Ação",
//           description: "Para o melhor jogo focado em combate, superação de desafios e reflexos.",
//           games: [
//             {
//               id: "finalfantasyviirebirth",
//               title: "Final Fantasy VII Rebirth",
//               imageUrl: "/ffvii-rebirth.png?height=200&width=350",
//               developer: "Square Enix",
//             },
//           ],
//         },
//       ],
//     },

//   ]


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
          "gtavi",
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
        id: "sportsracing",
        name: "Melhores Esportes/Corridas",
        description:
          "Para os melhores jogos de corrida e esportes tradicionais e não tradicionais.",
        gameIds: ["wwe2k25"],
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
          "gtavi",
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
        id: "family",
        name: "Melhor jogo para Família",
        description:
          "Para o melhor jogo apropriado para jogar em família, independentemente do gênero ou plataforma.",
        gameIds: ["gtavi"],
      },
    ],
  },
  {
    id: "2024",
    name: "2024",
    categories: [
      {
        id: "goty_2024",
        name: "Jogo do Ano",
        description: "O melhor jogo de 2024",
        gameIds: ["finalfantasyviirebirth"],
      },
      {
        id: "action_2024",
        name: "Melhor Jogo de Ação",
        description:
          "Para o melhor jogo focado em combate, superação de desafios e reflexos.",
        gameIds: ["finalfantasyviirebirth"],
      },
    ],
  },
];
