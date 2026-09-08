# Painel SUS

Dashboard de indicadores do Previne Brasil para a Saúde Itapira.

## Sobre o Projeto

O Painel SUS é um protótipo de dashboard interativo que monitora os indicadores de saúde da Atenção Primária em conformidade com o Previne Brasil. Permite analisar métricas como cobertura vacinal, pré-natal, hipertensão e diabetes por Unidade Básica de Saúde (UBS).

## Funcionalidades

- **Dashboard**: Visão geral com cards de indicadores, tabela de ranking e gráfico de tendências
- **Indicadores**: Detalhamento individual de cada métrica com status (verde/amarelo/vermelho)
- **Sobre**: Contexto sobre o Previne Brasil e metodologia do projeto

## Tecnologias

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [TypeScript Strict](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/) (testes unitários)

## Fluxo de Desenvolvimento

Este projeto utiliza um **harness de agentes AI** para o ciclo de desenvolvimento:

1. **Owner** → Gera PRD e TASKS a partir do briefing
2. **Designer** → Cria protótipos `.pen` e design system
3. **Coder** → Implementa tarefas no código
4. **Reviewer** → Valida com tsc, testes e auditoria WebAuditMCP

## Instalação

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera build de produção
npm run start    # Inicia o servidor de produção
npm run lint     # Executa ESLint
npm run test     # Roda testes unitários
npm run test:coverage  # Testes com cobertura
```

## Testes

```bash
npm run test          # Roda todos os testes
npm run test:watch    # Modo watch
npm run test:coverage # Gera relatório de cobertura
```

## Auditoria Web

Para auditoria completa de performance e acessibilidade:

1. Instale o [WebAuditMCP](https://github.com/iberi22/WebAuditMCP)
2. Inicie o servidor: `npm run dev &`
3. O **Reviewer** executará automaticamente Lighthouse, axe e security headers

## Estrutura

```
src/app/           # Rotas e componentes da interface
src/components/    # Componentes reutilizáveis
  dashboard/       # Cards, gráficos, tabelas
  filters/         # Filtros de período e UBS
  indicadores/     # Listas de indicadores
  layout/          # Header, Footer
src/data/          # Dados mockados (UBS, indicadores, histórico)
src/hooks/         # Hooks customizados
src/lib/           # Funções de filtro, tipos e utilitários
docs/              # PRD, SPEC, TASKS, Design System, Audits
.opencode/         # Configuração dos agentes AI
```

## Licença

Protótipo — Saúde Itapira
