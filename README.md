# 🏆 Game of the Year Voting App

Aplicação web para votação dos melhores jogos do ano em diferentes categorias.  
Usuários podem votar após fazer login, e seus votos são registrados em um banco de dados Firestore.

---

## 🚀 Funcionalidades

- Listagem de categorias de votação (ex: Jogo do Ano, Melhor Jogo de Luta).
- Exibição de jogos indicados em cada categoria.
- Usuário pode selecionar **um jogo por categoria**.
- Sistema de autenticação/login para permitir envio de votos.
- Feedback visual com animações após a conclusão da votação.
- Registro de votos no banco de dados Firestore.
- Acesso responsivo: funciona bem em dispositivos mobile e desktop.

---

## 📂 Estrutura de Componentes Principais

| Componente         | Descrição |
|--------------------|-----------|
| `VotingPage`        | Página principal da votação. Gerencia autenticação, categorias, votos e envio. |
| `CategorySection`   | Renderiza uma categoria com seus jogos indicados. |
| `GameCard`          | Cartão de cada jogo individual, permitindo seleção para voto. |
| `UserInfo`          | Exibe informações do usuário logado, além de opções para login/logout. |
| `Footer`            | Rodapé da página. |

---

## 🛠️ Tecnologias Utilizadas

- **Next.js** (Frontend framework)
- **React Hooks** (`useState`, `useEffect`)
- **Firebase Firestore** (Banco de dados para armazenar votos)
- **Framer Motion** (Animações)
- **Sonner** (Toast notifications)
- **Lucide React Icons** (/cones SVG)
- **TailwindCSS** (Estilização)
- **Shadcn/ui** (Componentes UI prontos)

---

## 📋 Fluxo de Funcionamento

1. **Login do Usuário**  
   Se o usuário não estiver logado, ele será incentivado a fazer login.

2. **Seleção dos Jogos**  
   - Para cada categoria disponível, o usuário escolhe **um jogo**.
   - É possível navegar entre as categorias em mobile usando **abas** (`Tabs`).

3. **Envio dos Votos**  
   - O botão "Enviar Votos" somente é habilitado se todas as categorias tiverem sido votadas.
   - Ao enviar:
     - Se o usuário não estiver logado, é exibido um erro.
     - Se estiver logado, os votos são enviados para o Firestore.

4. **Confirmação**  
   Após o envio bem-sucedido, o usuário vê uma tela de confirmação com animação.

---

## ⚙️ Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/game-voting-app.git

# Acesse a pasta do projeto
cd game-voting-app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 📦 Configurações Necessárias

- Configurar o Firebase Firestore:
  - Criar o projeto no [Firebase Console](https://console.firebase.google.com/).
  - Definir regras de leitura/gravação no Firestore.
  - Configurar a autenticação via Email/Senha ou outro provedor.
- Adicionar as variáveis de ambiente `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🎨 Imagens e Estilos

- As imagens dos jogos são carregadas a partir dos arquivos `public/`.
- Caso não haja imagem, um `placeholder` padrão é exibido.

---

## 📜 Observações

- Um mesmo usuário **não pode** votar múltiplas vezes (controlado via e-mail no Firestore).
- Cada categoria precisa obrigatoriamente ser votada para liberar o envio.
- Animações deixam a experiência mais fluida e agradável.

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

