# Esclarecimentos necessários — validação do planejamento

**Status:** RESOLVIDO — 2026-08-22

A revisão de continuidade encontrou duas decisões de negócio que alteravam os resultados exibidos no dashboard. O responsável confirmou as opções **1A e 2A** em 2026-08-22.

## Decisões vinculantes atuais

1. **Gráfico do dashboard:** haverá um seletor próprio de indicador, iniciado em Cobertura Vacinal, e o gráfico exibirá uma única série por vez.
2. **Ranking com UBS selecionada:** o ranking continuará comparando as 15 UBS; o filtro de UBS afetará cartões e gráfico, enquanto a janela relativa continuará afetando cartões, gráfico e ranking.

## Decisões anteriores preservadas

As decisões abaixo continuam vinculantes e não precisam de nova resposta:

1. A visualização histórica principal é um **gráfico de linha**.
2. O ranking usa os quatro indicadores com **peso igual de 25% cada**.
3. Cada parcela é `valor/meta × 100`, limitada ao intervalo **0–100**; a pontuação final é arredondada para **uma casa decimal**.
4. O detalhe é expansível na própria rota `/indicadores`; não existe `/indicadores/[id]`.
5. Existem somente as janelas relativas Último mês, Último trimestre, Último semestre e Último ano, ancoradas no mês mais recente presente nos dados recebidos.
6. Não existe erro artificial nem ação “Tentar novamente”; filtros sem registros produzem estado vazio com “Limpar filtros”, e dados locais inválidos são erro de desenvolvimento.

## Correções propagadas

1. `docs/PRD.md` v1.2 registra as duas decisões em cenários Gherkin e nas regras RB-12 e RB-13.
2. `docs/SPEC.md` v1.2 define o estado do seletor, o fluxo de dados, `IndicatorFilterProps`, o ranking municipal e o alinhamento visual obrigatório.
3. `docs/TASKS.md` foi regenerado somente após PRD e SPEC, com IDs sequenciais `TASK-001` a `TASK-048`.
4. A antiga `SETUP-05` foi reaberta como `TASK-005`, incluindo atualização autorizada do Next.js, instalação sem `ERESOLVE` e evidência de `npm audit --json`.
5. O alinhamento de `docs/DESIGN_SYSTEM.md` e do `.pen` com LineChart, seletor e ranking municipal foi registrado como precondição visual e gate do Reviewer.

O blocker de negócio está encerrado e permanece neste arquivo para rastreabilidade.

---

## Bloqueio técnico aberto — TASK-005 (2026-09-06)

**Status:** RESOLVIDO — 2026-09-06

O Coder executou a atualização autorizada de `next` e `eslint-config-next` para `16.3.2`:

- `npm install`: código zero e sem aviso `ERESOLVE`;
- `npm run build`: código zero;
- `npm audit --json`: código 1, com quatro vulnerabilidades altas e `fixAvailable: true` em `brace-expansion`, `fast-uri`, `js-yaml` e `nanoid`.

A `TASK-005` permanece aberta porque seu critério proíbe vulnerabilidade alta ou crítica com correção disponível. O gate `TASK-042` também permanece bloqueado.

### Decisão do responsável — 2026-09-06

Foi autorizada a opção recomendada: atualização controlada das dependências diretas de desenvolvimento que introduzem as cadeias vulneráveis, limitada às versões principais já previstas na SPEC e condicionada à aprovação de instalação, TypeScript, lint, testes, auditoria e build.

Se a correção exigir mudança de versão principal fora das faixas autorizadas, o Coder deve parar. O Owner apresentará nova pergunta ao responsável e atualizará a SPEC antes de qualquer mudança.

Permanecem proibidos `npm audit fix --force`, `--legacy-peer-deps`, `overrides` e `resolutions` ad hoc.

### Resolução

O Coder aplicou atualizações compatíveis dentro das versões principais autorizadas. O Reviewer validou independentemente:

- `npm install`: código zero e sem `ERESOLVE`;
- `npm audit --json`: código zero e zero vulnerabilidades;
- `npx tsc --noEmit`: código zero;
- `npm run lint`: código zero;
- `npm test -- --passWithNoTests`: código zero;
- `npm run test:coverage -- --passWithNoTests`: código zero;
- `npm run build`: código zero com Next.js `16.3.2`.

A `TASK-005` recebeu **PASS** do Reviewer e foi encerrada. A ausência atual de testes efetivos não reprova esta tarefa, mas deve ser eliminada pelas tarefas de testes antes do gate `TASK-042`.
