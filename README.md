# Jogo do Ano - Sistema de Votação

## Visão Geral

O "Jogo do Ano" é um aplicativo web moderno que permite aos usuários votar em jogos por categorias dentro de edições específicas. O sistema foi projetado com foco em uma experiência de usuário fluida e intuitiva, oferecendo recursos avançados de navegação e interação tanto em dispositivos desktop quanto móveis.

### Funcionalidades Principais

- **Autenticação e Perfil**
  - Login/Logout integrado
  - Perfil de usuário com histórico de votos
  - Interface adaptativa para diferentes estados de autenticação

- **Sistema de Votação**
  - Seleção intuitiva de edições
  - Navegação fluida entre categorias
  - Interface de votação otimizada para touch e mouse
  - Progresso visual da votação
  - Validação em tempo real

- **Navegação Avançada**
  - Suporte a gestos touch (swipe)
  - Navegação por teclado
  - Transições suaves entre categorias
  - Header e Footer inteligentes com comportamento adaptativo

- **Interface Responsiva**
  - Layout otimizado para mobile e desktop
  - Componentes adaptativos
  - Animações e transições suaves
  - Feedback visual em tempo real

## Estrutura do Projeto

```
├── src/
│   ├── app/                    # Rotas e páginas (Next.js 14)
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   ├── voting/           # Componentes específicos de votação
│   │   └── admin/            # Componentes do painel administrativo
│   ├── hooks/                # Hooks personalizados
│   ├── stores/               # Gerenciamento de estado (Zustand)
│   ├── types/                # Definições de tipos TypeScript
│   ├── repositories/         # Camada de acesso a dados
│   ├── application/          # Lógica de negócios
│   ├── lib/                  # Bibliotecas e configurações
│   ├── services/             # Serviços da aplicação
│   └── utils/                # Funções utilitárias
├── types/                    # Tipos globais
├── public/                   # Arquivos estáticos
└── [configurações]          # Arquivos de configuração
```

## Tecnologias Utilizadas

### Frontend
- **Next.js 14**: Framework React com App Router
- **React 18**: Biblioteca para construção de interfaces
- **TypeScript**: Tipagem estática e melhor DX
- **TailwindCSS**: Estilização utilitária
- **Shadcn/ui**: Componentes acessíveis e customizáveis
- **Zustand**: Gerenciamento de estado
- **Lucide Icons**: Ícones consistentes

### Desenvolvimento
- **ESLint**: Linting e padronização de código
- **Prettier**: Formatação de código
- **TypeScript**: Tipagem estática
- **Husky**: Git hooks
- **Docker**: Containerização

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- Yarn ou NPM
- Docker (opcional)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/jogodoano.git
cd jogodoano
```

2. Instale as dependências:
```bash
yarn install
# ou
npm install
```

3. Execute o ambiente de desenvolvimento:
```bash
yarn dev
# ou
npm run dev
```

4. Acesse [http://localhost:3000](http://localhost:3000)

### Docker

1. Construa e inicie os containers:
```bash
docker-compose up --build
```

2. Acesse [http://localhost:3030](http://localhost:3030)

## Arquitetura

### Padrões de Projeto

- **Clean Architecture**: Separação clara de responsabilidades
- **Repository Pattern**: Abstração do acesso a dados
- **Service Pattern**: Encapsulamento de lógica de negócios
- **Hooks Pattern**: Reutilização de lógica de estado
- **Component Pattern**: Componentes reutilizáveis e isolados

### Estrutura de Código

- **Componentes**: Isolados e reutilizáveis
- **Hooks**: Lógica de negócios reutilizável
- **Stores**: Estado global gerenciado
- **Types**: Tipos e interfaces TypeScript
- **Services**: Lógica de negócios centralizada

## Contribuição

### Padrões de Código

1. **Commits**:
   - Mensagens claras e descritivas
   - Commits atômicos e focados
   - Referência a issues quando aplicável

2. **Pull Requests**:
   - Descrição clara das mudanças
   - Screenshots para mudanças visuais
   - Testes quando aplicável
   - Revisão de código necessária

### Desenvolvimento

1. **Setup**:
   - Instale as dependências
   - Configure as variáveis de ambiente
   - Execute os testes

2. **Fluxo de Trabalho**:
   - Crie uma branch para sua feature
   - Desenvolva e teste
   - Submeta um PR
   - Aguarde revisão e aprovação

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

interface LocalVote {
  editionId: string;
  votes: Record<string, string>; // categoryId -> gameId
  lastUpdated: number;
  userId?: string; // opcional, para usuários logados
}