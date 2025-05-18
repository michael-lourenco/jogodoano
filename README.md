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
```
├── src/
│ ├── app/ # Rotas e páginas da aplicação (Next.js)
│ ├── application/ # Lógica de aplicação e casos de uso
│ ├── components/ # Componentes React reutilizáveis
│ ├── hooks/ # Hooks personalizados
│ ├── lib/ # Bibliotecas e utilidades
│ ├── repositories/ # Acesso a dados
│ ├── services/ # Serviços da aplicação
│ ├── types/ # Definições de tipos TypeScript
│ └── utils/ # Funções utilitárias
├── types/ # Tipos globais do projeto
├── atual/ # Diretório de dados atuais
├── tailwind.config.ts # Configuração do TailwindCSS
├── components.json # Configuração dos componentes
├── tsconfig.json # Configuração do TypeScript
├── next.config.js # Configuração do Next.js
├── postcss.config.mjs # Configuração do PostCSS
├── Dockerfile # Configuração do container Docker
└── docker-compose.yml # Configuração do ambiente Docker
```

## Tecnologias Utilizadas

- **Frontend**:
  - Next.js: Framework React com suporte a SSR e rotas
  - React: Biblioteca para construção de interfaces
  - TypeScript: Superset tipado de JavaScript
  - TailwindCSS: Framework CSS utilitário
  - Shadcn/ui: Componentes de UI acessíveis

- **Infraestrutura**:
  - Docker: Containerização da aplicação
  - Docker Compose: Orquestração de containers

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn
- Docker e Docker Compose (opcional)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/jogodoano.git
cd jogodoano
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

### Execução com Docker

1. Construa e inicie os containers:
```bash
docker-compose up --build
```

2. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## Arquitetura do Projeto

### Camadas da Aplicação

1. **Presentation Layer** (`src/app/` e `src/components/`)
   - Componentes React
   - Páginas Next.js
   - Interface do usuário

2. **Application Layer** (`src/application/`)
   - Casos de uso
   - Lógica de negócios
   - Orquestração de serviços

3. **Domain Layer** (`src/types/`)
   - Entidades
   - Interfaces
   - Tipos de domínio

4. **Infrastructure Layer** (`src/repositories/` e `src/services/`)
   - Acesso a dados
   - Serviços externos
   - Implementações concretas

### Padrões de Código

- **Clean Architecture**: Separação clara de responsabilidades
- **Repository Pattern**: Abstração do acesso a dados
- **Service Pattern**: Encapsulamento de lógica de negócios
- **Hooks Pattern**: Reutilização de lógica de estado e efeitos

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
   - Mantenha a estrutura de arquitetura limpa
   - Mantenha a compatibilidade mobile e desktop

### Testes Recomendados

Ao implementar novos recursos ou corrigir bugs, teste:

1. **Compatibilidade Mobile/Desktop**:
   - Verificar comportamento responsivo
   - Testar em diferentes navegadores

2. **Acessibilidade**:
   - Navegação por teclado
   - Contraste e legibilidade
   - Semântica apropriada

3. **Performance**:
   - Tempo de carregamento
   - Responsividade da interface

## Melhorias de Interface

### Navegação e Visibilidade
- Footer sempre visível com z-index elevado (z-[100])
- Botão de expandir/recolher menu com z-index adequado (z-50)
- Container de progresso e botões de navegação com z-index dinâmico
  - z-index: 20 quando o menu está expandido
  - z-index: 50 quando o menu está recolhido
- Transições suaves entre estados do menu
- Feedback visual aprimorado para interações do usuário

### Responsividade
- Adaptação automática para dispositivos móveis
- Menu colapsável em dispositivos móveis
- Navegação por gestos (swipe) em dispositivos móveis
- Layout otimizado para diferentes tamanhos de tela

## Licença

[Incluir informações de licença aqui]