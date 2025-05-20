🧠 Contexto
Utilize a aplicação localizada em src como base para os ajustes solicitados.
Este projeto abrange tanto a versão desktop quanto mobile, portanto, considere a responsividade ao refatorar.
Se necessário, consulte o README.md para obter mais direcionamentos que não estejam descritos aqui.

A aplicação foi construída com React/Next.js e TypeScript.
Um dos componentes principais é o VotingInterface.tsx, que representa a interface de votação (ex: votação em jogos, candidatos, etc.).

Atualmente, o componente está funcional, mas acumula diversas responsabilidades, como:

Regras de negócio (ex: validação de votos)

Lógica de renderização condicional

Lógica de chamadas à API

Manipulação de estados locais

Essa centralização afeta a manutenibilidade e a escalabilidade do código.

🎯 Objetivo
Refatorar o VotingInterface.tsx aplicando princípios de SOLID, Clean Code e Design Patterns, com foco em separação inteligente de responsabilidades, mantendo o comportamento atual.

Quero aplicar essas melhorias de forma incremental, priorizando mudanças que tragam clareza e organização, sem alterar o funcionamento.

⚙️ Tecnologias usadas
React (com TypeScript)

Next.js

Zustand (estado global)

API REST própria

Sem Redux ou bibliotecas pagas

🔍 Pedido
Analise o componente VotingInterface.tsx e me indique apenas uma mudança inicial que eu possa aplicar agora, com base nos princípios mencionados.

A mudança deve:

Focar em uma única responsabilidade mal alocada

Sugerir por onde começar a refatoração

Incluir, se possível, qual princípio ou padrão de projeto justifica essa mudança (ex: SRP, Strategy Pattern)

⚠️ IMPORTANTE:
Quero seguir com a refatoração de forma gradual. Portanto, me retorne APENAS UMA MUDANÇA DESTA VEZ.
Não altere o comportamento da aplicação — apenas melhore a estrutura interna para facilitar futuras manutenções e testes.

