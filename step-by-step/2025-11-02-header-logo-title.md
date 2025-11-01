# Ajuste do Header – Título Centralizado

## Contexto
- Data: 02/11/2025
- Objetivo: Transformar o título “JOGO DO ANO” em um elemento centralizado com aparência de logo dentro do cabeçalho.

## Alterações
- `src/components/Header.tsx`: reestruturei o container principal para usar `grid`, inserindo o título como item central e encapsulando o `UserInfo` em um wrapper alinhado à direita. Apliquei estilização com gradiente, espaçamento entre letras e efeito de brilho para que o texto funcione como logotipo, mantendo responsividade com `whitespace-nowrap` e ajustes progressivos de `tracking`.

## Resultado
- O título agora está visualmente centralizado entre o ícone da marca e a seção de usuário, reforçando o branding do projeto e preservando a legibilidade em telas menores.

## Próximos Passos
- Validar o comportamento em diferentes larguras de tela e, se necessário, ajustar os valores de `tracking` para evitar cortes em dispositivos muito estreitos.

---

# Ajuste de Tamanho do Logo no Header

## Contexto
- Data: 02/11/2025
- Objetivo: Aumentar o tamanho do logo na posição superior esquerda para garantir visibilidade e identidade visual.

## Alterações
- `src/components/Header.tsx`: aumentei o logo de 32x32px para 48x48px.

## Resultado
- O logo está mais visível no header, com a hierarquia entre logo, título centralizado e informações do usuário preservadas.

## Próximos Passos
- Monitorar o uso do espaço no header em larguras menores e, se necessário, introduzir uma versão compacta em breakpoints móveis.

