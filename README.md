
# 🏆 Votação: Jogo do Ano

Aplicação web para votação dos melhores jogos do ano, permitindo que usuários escolham seus favoritos em diversas categorias.

## 📸 Demonstração

![Demonstração da aplicação](./public/demo.gif)

## 🚀 Funcionalidades

- Autenticação de usuários (login/logout)
- Seleção de ano para votação
- Votação por categoria
- Envio e persistência dos votos no Firebase
- Interface responsiva e interativa

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/) com Next.js
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/) (Firestore)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/votacao-jogo-do-ano.git
   cd votacao-jogo-do-ano
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 📁 Estrutura do Projeto

```
├── components/
│   ├── ui/
│   ├── Footer.tsx
│   └── UserInfo.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useNavigation.ts
├── pages/
│   └── voting.tsx
├── repositories/
│   └── games.ts
├── services/
│   └── firebase/
│       └── FirebaseService.ts
├── public/
│   └── demo.gif
├── .env.local
├── package.json
└── README.md
```

## 🧑‍💻 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue para discutir o que você gostaria de mudar.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para obter mais informações.
