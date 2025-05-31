# Jogo do Ano - Sistema de Votação

## 🎮 Sobre o Projeto

Sistema de votação para eleger os melhores jogos do ano, desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

- **Sistema de Votação**
  - Votação em múltiplas categorias
  - Seleção visual de jogos com animações
  - Feedback sonoro e visual ao selecionar
  - Controle de período de votação por edição
  - Status visual de disponibilidade da votação
  - Validação de usuário autenticado

- **Edições de Votação**
  - Edição anual (2025)
  - Edição "Todos os Tempos"
  - Períodos de votação configuráveis
  - Status de disponibilidade (upcoming, active, ended)

- **Interface**
  - Design moderno e responsivo
  - Animações suaves
  - Feedback visual de seleção
  - Indicadores de status de votação
  - Cards de jogos com imagens e informações

## 📊 Status das Edições

O sistema suporta três estados diferentes para as edições:

### 1. Upcoming (Próxima)
- **Visual**: Ícone de relógio em azul
- **Estado**: Edição ainda não iniciada
- **Características**:
  - Fundo azul claro (10% opacidade)
  - Borda azul (20% opacidade)
  - Texto em azul
- **Exemplo**: Edição 2025 antes de 01/01/2025

### 2. Active (Ativa)
- **Visual**: Ícone de check em verde
- **Estado**: Edição em andamento
- **Características**:
  - Fundo verde claro (10% opacidade)
  - Borda verde (20% opacidade)
  - Texto em verde
- **Exemplo**: Edição atual aberta para votação

### 3. Ended (Encerrada)
- **Visual**: Ícone de alerta em vermelho
- **Estado**: Edição finalizada
- **Características**:
  - Fundo vermelho claro (10% opacidade)
  - Borda vermelha (20% opacidade)
  - Texto em vermelho
- **Exemplo**: Edições passadas que já encerraram

## 🚀 Tecnologias

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn/ui
- React Hook Form
- Zod

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/jogodoano.git

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

## 🔧 Configuração

1. Configure as variáveis de ambiente:
```env
NEXT_PUBLIC_API_URL=sua_url_api
```

2. Configure as edições de votação em `src/repositories/votingEditions.tsx`:
```typescript
{
  id: "2025",
  title: "Jogos de 2025",
  isLimitedTime: true,
  startAt: new Date("2025-01-01T00:00:00Z"),
  endAt: new Date("2025-12-31T23:59:59Z"),
  status: "upcoming"
}
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

interface LocalVote {
  editionId: string;
  votes: Record<string, string>; // categoryId -> gameId
  lastUpdated: number;
  userId?: string; // opcional, para usuários logados
}