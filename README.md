# Jogo do Ano

O Jogo do Ano é uma plataforma de votação para escolher os melhores jogos em diferentes categorias. O projeto foi desenvolvido com Next.js, TypeScript, Tailwind CSS e outras tecnologias modernas.

## 🚀 Funcionalidades

### Splash Screen
- Animação suave de entrada e saída na primeira visita
- Fade in e fade out com duração de 5 segundos
- Transição suave para a página inicial
- Persistência do estado de visita no localStorage

### Interface de Votação
- Suporte a múltiplas edições de votação (2025 e Todos os Tempos)
- Layout responsivo para desktop e mobile
- Navegação por categorias com tabs
- Seleção de jogos com animações suaves
- Contagem regressiva para edições futuras
- Sistema de votação com validação de categorias

### Autenticação
- Login com Google
- Persistência de sessão
- Proteção de rotas
- Gerenciamento de estado de autenticação

### UI/UX
- Design moderno com gradientes e efeitos de glassmorphism
- Animações suaves usando Framer Motion
- Tema escuro com cores personalizadas
- Componentes reutilizáveis e acessíveis
- Feedback visual para interações do usuário

### Responsividade
- Layout adaptativo para diferentes tamanhos de tela
- Interface otimizada para mobile
- Navegação por gestos em dispositivos touch
- Grid responsivo para exibição de jogos

## 🛠️ Tecnologias

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [date-fns](https://date-fns.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/jogodoano.git
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id
NEXT_PUBLIC_API_URL=sua_url_api
```

### Estrutura de Diretórios

```
src/
  ├── app/              # Rotas e páginas
  ├── components/       # Componentes reutilizáveis
  ├── hooks/           # Custom hooks
  ├── repositories/    # Dados e configurações
  ├── services/        # Serviços e integrações
  ├── styles/          # Estilos globais
  ├── types/           # Definições de tipos
  └── utils/           # Funções utilitárias
```

## 🎨 Temas e Estilos

O projeto utiliza um sistema de temas personalizado com as seguintes cores principais:

- `chart-1` a `chart-5`: Cores para gráficos e elementos visuais
- `background`: Cor de fundo principal
- `foreground`: Cor do texto principal
- `muted`: Cores para elementos secundários
- `primary`, `secondary`, `accent`: Cores de destaque

## 📱 Responsividade

O projeto foi desenvolvido com foco em responsividade, utilizando:

- Breakpoints do Tailwind CSS
- Layouts flexíveis
- Grid system adaptativo
- Componentes responsivos
- Media queries personalizadas

## 🔒 Segurança

- Autenticação via Google OAuth
- Proteção de rotas
- Validação de dados com Zod
- Sanitização de inputs
- HTTPS forçado em produção

## 🚀 Deploy

O projeto está configurado para deploy automático na Vercel:

1. Push para a branch main
2. Build automático
3. Deploy em produção

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para contato@jogodoano.com.br ou abra uma issue no GitHub.