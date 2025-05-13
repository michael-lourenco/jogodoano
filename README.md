# Jogo do Ano - Sistema de Votação

## Visão Geral

O "Jogo do Ano" é um aplicativo web que permite aos usuários votar em jogos por categorias dentro de edições específicas. O sistema foi projetado para oferecer uma experiência de votação intuitiva tanto em dispositivos desktop quanto móveis, com recursos de navegação por toque, teclado e interface gráfica.

### Funcionalidades Principais

- Autenticação de usuários
- Seleção de edições de premiação
- Navegação entre categorias de jogos
- Votação em jogos por categoria
- Acompanhamento do progresso de votação
- Envio final dos votos

## Estrutura do Projeto

├── src/
│ ├── app/ # Rotas e páginas da aplicação (Next.js)
│ │ ├── about/ # Página sobre o projeto
│ │ ├── admin/ # Área administrativa
│ │ ├── api/ # Endpoints da API
│ │ ├── player/ # Player de conteúdo
│ │ ├── voting/ # Sistema de votação
│ │ │ └── [edition]/ # Páginas de edições específicas
│ │ ├── layout.tsx # Layout principal
│ │ └── page.tsx # Página inicial
│ ├── components/ # Componentes React reutilizáveis
│ │ ├── ui/ # Componentes de UI básicos
│ │ ├── voting/ # Componentes específicos do sistema de votação
│ │ │ ├── CategoryNavigation.tsx # Navegação entre categorias
│ │ │ ├── CategorySection.tsx # Seção de uma categoria
│ │ │ ├── EditionsSelector.tsx # Seletor de edições
│ │ │ ├── VotingInterface.tsx # Interface principal de votação
│ │ │ └── VotingProgress.tsx # Barra de progresso da votação
│ │ ├── Footer.tsx # Rodapé global
│ │ └── UserInfo.tsx # Informações do usuário
│ ├── hooks/ # Hooks personalizados
│ │ ├── useAuth.ts # Autenticação
│ │ ├── useCategoryNavigation.ts # Navegação entre categorias
│ │ ├── useEditionManager.ts # Gerenciamento de edições
│ │ ├── useEditions.ts # Dados de edições
│ │ ├── useKeyboardNavigation.ts # Navegação por teclado
│ │ ├── useMobile.tsx # Detecção de dispositivos móveis
│ │ ├── useNavigation.ts # Navegação geral
│ │ ├── useStickyHeader.ts # Cabeçalho fixo
│ │ ├── useSwipeNavigation.ts # Navegação por gestos (swipe)
│ │ ├── useToast.ts # Sistema de notificações
│ │ ├── useVotes.ts # Gerenciamento de votos
│ │ └── useVotingInterface.ts # Interface de votação
│ ├── lib/ # Bibliotecas e utilidades
│ ├── repositories/ # Acesso a dados
│ ├── services/ # Serviços da aplicação
│ ├── types/ # Definições de tipos TypeScript
│ └── utils/ # Funções utilitárias

## Tecnologias Utilizadas

- **Frontend**:
  - Next.js: Framework React com suporte a SSR e rotas
  - React: Biblioteca para construção de interfaces
  - TypeScript: Superset tipado de JavaScript
  - Framer Motion: Biblioteca de animações
  - Lucide React: Ícones
  - TailwindCSS: Framework CSS utilitário
  - Shadcn/ui: Componentes de UI acessíveis

- **Responsividade**:
  - Design adaptável para desktop e mobile
  - Gestos de swipe em dispositivos móveis
  - Navegação por teclado em desktop

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/jogodoano-cursor.git
cd jogodoano-cursor
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Execute o ambiente de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura Principal de Componentes

### VotingInterface

O componente principal que gerencia a interface de votação, localizado em `src/components/voting/VotingInterface.tsx`. Ele integra:

- Seleção de edições
- Navegação entre categorias
- Votação em jogos
- Transições visuais
- Envio de votos

### Navegação e Acessibilidade

O sistema implementa múltiplas formas de navegação:

1. **Navegação por Swipe** (`useSwipeNavigation.ts`):
   - Detecta gestos de deslize em dispositivos touch
   - Implementa transições visuais suaves entre categorias

2. **Navegação por Teclado** (`useKeyboardNavigation.ts`):
   - Suporte a navegação via setas do teclado
   - Atalhos para alternar entre categorias

3. **Navegação por Interface** (`CategoryNavigation.tsx`):
   - Botões "Anterior" e "Próxima"
   - Indicadores visuais de progresso
   - Botão "Ir para Próxima Categoria" após realizar um voto

## Soluções de UX Implementadas

### Rolagem Automática

- O sistema implementa uma função `ensureHeaderVisible` que utiliza múltiplas técnicas para garantir que o cabeçalho da categoria seja visível após a navegação:
  - Manipulação do hash da URL
  - Uso de `scrollIntoView`
  - Cálculo manual da posição de scroll
  - Reset do `scrollTop` do container

### Feedback Visual

- Destaque temporário do cabeçalho da categoria atual
- Transições suaves entre categorias
- Indicação visual de categorias já votadas
- Barra de progresso global

### Posicionamento do Botão "Próxima Categoria"

- Posicionamento consistente em 40% da altura da tela
- Adaptação baseada na posição de rolagem
- Versões específicas para mobile e desktop

## Padrões de Código

### Estrutura de Funções

O código segue uma ordem lógica de declaração para evitar referências circulares:

1. Funções básicas sem dependências
2. Funções que dependem das funções básicas
3. Hooks e efeitos que usam essas funções

### Padrões de Nomenclatura

- **Prefixos**:
  - `handle*`: Para funções que lidam com eventos
  - `use*`: Para hooks personalizados
  - `is*`: Para estados booleanos
  - `set*`: Para funções que definem estado

- **Componentes**: PascalCase (ex: `VotingInterface`, `CategorySection`)
- **Funções e variáveis**: camelCase (ex: `handleGameSelection`, `localActiveCategory`)
- **Constantes**: SNAKE_CASE (não muito utilizado no código atual)

## Contribuição

### Diretrizes de Contribuição

1. **Estrutura de Commits**:
   - Use mensagens claras e descritivas
   - Prefira commits pequenos e focados

2. **Pull Requests**:
   - Descreva claramente as alterações e problemas resolvidos
   - Inclua capturas de tela para alterações visuais

3. **Padrões de Código**:
   - Siga os padrões de nomenclatura existentes
   - Mantenha a estrutura lógica de declaração de funções
   - Mantenha a compatibilidade mobile e desktop

### Testes Recomendados

Ao implementar novos recursos ou corrigir bugs, teste:

1. **Compatibilidade Mobile/Desktop**:
   - Verificar comportamento responsivo em diferentes tamanhos de tela
   - Testar gestos de swipe em dispositivos touch

2. **Acessibilidade**:
   - Navegação por teclado
   - Contraste e legibilidade
   - Semântica apropriada

3. **Performance**:
   - Fluidez das animações
   - Responsividade da interface

## Considerações Importantes

### Problemas Conhecidos e Soluções

1. **Rolagem para o Topo em Mobile**:
   - Implementação da função `ensureHeaderVisible` para garantir que o cabeçalho da categoria seja visível ao navegar entre categorias.
   - Utiliza múltiplas técnicas complementares para maior robustez.

2. **Posicionamento do Botão "Próxima Categoria"**:
   - Posicionamento fixo a 40% da altura da tela para evitar "piscagem"
   - Remoção de efeitos de animação desnecessários

### Linter Errors

O código atual apresenta erros de linter relacionados principalmente a:
- Importações não encontradas (como 'lucide-react' e 'react')
- Tipos implícitos em elementos JSX

Estes problemas provavelmente se devem à configuração do linter no ambiente específico e não afetam o funcionamento da aplicação.

## Licença

[Incluir informações de licença aqui]