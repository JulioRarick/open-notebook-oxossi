# Open Notebook Oxossi

> Um aplicativo web moderno para gestão de anotações e diários pessoais, desenvolvido como parte do Projeto Oxossi.

## 📚 Sobre o Projeto

Este é um projeto de desenvolvimento full-stack que faz parte do **Trabalho de Conclusão de Curso (TCC) em História** pela **Universidade de Brasília**, como parte do **Projeto Oxossi**.

**Desenvolvedor Principal:** Julio Rarick  
**Projeto:** [Oxossi - lhs.unb.br/oxossi](https://lhs.unb.br/oxossi)  
**Universidade:** Universidade de Brasília (UnB)  
**Departamento:** Laboratório de Humanidades Sociais (LHS)

---

## ✨ Funcionalidades

- **Diário Digital:** Crie e gerencie anotações com datas
- **Calendário Integrado:** Navegue entre suas anotações por data
- **Interface Responsiva:** Acesso completo em desktop, tablet e mobile
- **Tema Dinâmico:** Suporte a tema claro e escuro
- **Busca e Filtros:** Encontre suas anotações facilmente
- **Edição em Tempo Real:** Atualizações instantâneas da interface

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org) com App Router
- **Linguagem:** [TypeScript](https://www.typescriptlang.org)
- **Banco de Dados:** SQLite com [Prisma ORM](https://www.prisma.io)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com)
- **UI Components:** [Radix UI](https://www.radix-ui.com)
- **Formulários:** [React Hook Form](https://react-hook-form.com)
- **Validação:** [Zod](https://zod.dev)
- **Notificações:** [Sonner](https://sonner.emilkowal.ski/)
- **Markdown:** [React Markdown](https://github.com/remarkjs/react-markdown)

---

## 🚀 Getting Started

### Pré-requisitos

- Node.js 18+ 
- pnpm 10+

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone <repository-url>
cd open-notebook-oxossi
pnpm install
```

### Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

O projeto utiliza [Turbopack](https://turbo.build/pack) para melhor performance durante o desenvolvimento.

### Build para Produção

```bash
pnpm build
pnpm start
```

---

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas da aplicação Next.js
│   ├── actions/           # Server actions
│   ├── calendar/          # Página do calendário
│   ├── edit/[id]/         # Página de edição
│   ├── entry/[id]/        # Visualização de entrada
│   └── new/entry/         # Criação de nova entrada
├── components/            # Componentes React reutilizáveis
│   ├── ui/               # Componentes de UI genéricos
│   ├── entry-form.tsx    # Formulário de entrada
│   └── nav-bar.tsx       # Barra de navegação
├── lib/                   # Utilitários e helpers
│   ├── db.ts            # Configuração do banco de dados
│   └── utils.ts         # Funções utilitárias
└── types/               # Definições TypeScript
    └── diary.ts         # Tipos do domínio
```

---

## 📖 Documentação

Para mais informações sobre tecnologias utilizadas:

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)

---

## 🔗 Links Úteis

- **Projeto Oxossi:** [lhs.unb.br/oxossi](https://lhs.unb.br/oxossi)
- **Universidade de Brasília:** [unb.br](https://www.unb.br)
- **Laboratório de Humanidades Sociais:** [lhs.unb.br](https://lhs.unb.br)

---

## 📝 Licença

Este projeto é parte de um trabalho acadêmico e pode estar sujeito aos termos da Universidade de Brasília.

---

**Desenvolvido com ❤️ para o Projeto Oxossi**
