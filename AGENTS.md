# Repository Agent Harness & Squad Rules

## Workflow Sequencial da Squad

1. **OWNER (@owner)**: Lê `docs/briefing.md`, cria `docs/PRD.md` e `docs/TASKS.md`.
2. **DESIGNER (@designer)**: Consome `PRD.md`, gera layouts `.pen` e `docs/DESIGN_SYSTEM.md`.
3. **CODER (@coder)**: Executa tarefas do `TASKS.md` (Next.js, TS Strict, sem conversa).
4. **REVIEWER (@reviewer)**: Valida tipos (`tsc`), layout, performance e segurança via **WebAuditMCP**. Regra falhas em `docs/failures/` e auditorias em `docs/audits/`.

## Diretrizes de Código

- Stack: Next.js 15+, React 19, Tailwind CSS, Shadcn UI.
- Não altere assinaturas de componentes UI sem aprovação do Reviewer.

## Gotchas

- **Spec Kit**: Ignore a pasta `specs/`. A única fonte de tarefas é `docs/TASKS.md`.

## System Prompts Locais

Cada agente carrega seu prompt especializado antes de iniciar:

- **@owner**: `.opencode/agents/owner.md`
- **@designer**: `.opencode/agents/designer.md`
- **@coder**: `.opencode/agents/coder.md`
- **@reviewer**: `.opencode/agents/reviewer.md`
