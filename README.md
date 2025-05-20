# Jogo do Ano - Sistema de Votação

Sistema de votação para o Jogo do Ano, desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

- **Votação por Categorias**: Sistema de votação organizado por categorias
- **Interface Responsiva**: Suporte completo para desktop e mobile
- **Navegação Intuitiva**: 
  - Desktop: Navegação por tabs e teclado
  - Mobile: Navegação por swipe, wheel e botões
- **Persistência Local**: Salvamento automático dos votos no localStorage
- **Animações Suaves**: Transições e feedback visual para melhor experiência do usuário
- **Acessibilidade**: Suporte a navegação por teclado e leitores de tela

## 🛠️ Tecnologias

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Shadcn/ui

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/jogodoano-cursor.git
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Execute o projeto:
```bash
npm run dev
# ou
yarn dev
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── voting/
│   │   ├── CategorySection.tsx
│   │   ├── CategorySelector.tsx
│   │   ├── CategoryStepper.tsx
│   │   ├── EditionsSelector.tsx
│   │   ├── VotingInterface.tsx
│   │   └── VotingProgress.tsx
│   └── ui/
├── hooks/
│   ├── useCategoryNavigation.ts
│   ├── useKeyboardNavigation.ts
│   ├── useSwipeNavigation.ts
│   ├── useStickyHeader.ts
│   └── useVotingInterface.ts
├── stores/
│   └── useLocalVotes.ts
└── types/
    └── voting/
```

## 🔑 Principais Componentes

### VotingInterface
Componente principal que gerencia a interface de votação, incluindo:
- Seleção de edição
- Navegação entre categorias
- Exibição de jogos
- Sistema de votação
- Persistência de votos

### CategorySelector
Seletor de categorias com:
- Navegação por wheel
- Centralização automática
- Animações suaves
- Indicador de votos

### CategoryStepper
Navegador de categorias com:
- Visualização de progresso
- Navegação rápida
- Indicador de votos

## 🎯 Funcionalidades Detalhadas

### Navegação
- **Desktop**: 
  - Tabs para navegação
  - Teclas de seta para navegação
  - Scroll suave para categorias
- **Mobile**:
  - Swipe para navegação
  - Wheel para navegação
  - Botões de navegação
  - Scroll automático para categoria selecionada

### Votação
- Seleção de jogos por categoria
- Persistência automática dos votos
- Validação de votos obrigatórios
- Envio em lote

### Interface
- Design responsivo
- Animações suaves
- Feedback visual
- Suporte a temas
- Acessibilidade

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

interface LocalVote {
  editionId: string;
  votes: Record<string, string>; // categoryId -> gameId
  lastUpdated: number;
  userId?: string; // opcional, para usuários logados
}