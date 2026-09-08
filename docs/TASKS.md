# Tasks — Painel SUS

> Fonte de requisitos: `docs/PRD.md` v1.3 e `docs/SPEC.md` v1.3. Ordem definida por dependências. Cada tarefa altera no máximo três arquivos, deve caber em menos de 30 minutos e possui critérios verificáveis.
>
> Precondição do fluxo da Squad: antes das tarefas visuais, o Designer deve alinhar `docs/DESIGN_SYSTEM.md` e `docs/layout/painel-sus.pen` ao LineChart, ao seletor de indicador e ao ranking municipal definidos na SPEC v1.2.
>
> Estado verificado em 2026-09-06: `docs/DESIGN_SYSTEM.md` v1.2 e `docs/layout/painel-sus.pen` existem; as tarefas `TASK-001`, `TASK-002`, `TASK-003`, `TASK-004` e `TASK-006` estão concluídas. `src/app/layout.tsx` e `src/app/page.tsx` ainda contêm o template inicial do Next.js, e os módulos de dados, regras de negócio, componentes do produto e rotas adicionais ainda não existem.
>
> Revalidação independente do Reviewer em 2026-09-07: a correção pontual de `eslint.config.mjs` foi aprovada (**PASS**). `npm run lint`, TypeScript, coverage, build e `git diff --check` passaram; `coverage/**` é específico para artefato gerado e não mascara `src/`, testes ou configurações. O produto ainda está no template inicial, sem confundir esta aprovação de base com produto completo nem com os gates `TASK-045`–`TASK-048`. `TASK-001`–`TASK-007` podem ser considerados base validada pelos critérios registrados, sem marcar tarefas por conta própria; `TASK-008` pode ser delegada pelo Owner. Evidências em `docs/audits/reviewer-revalidation-audit.json`.

## Plano de execução do Coder

### Prioridades

- **P0 — caminho crítico ou gate:** `TASK-005`, `TASK-007`–`TASK-010`, `TASK-012`–`TASK-016`, `TASK-018`, `TASK-021`, `TASK-029`, `TASK-031`, `TASK-035`, `TASK-036`, `TASK-039`, `TASK-041` e `TASK-042`.
- **P1 — entrega funcional ou teste obrigatório:** `TASK-011`, `TASK-017`, `TASK-019`, `TASK-020`, `TASK-022`–`TASK-027`, `TASK-030`, `TASK-032`–`TASK-034`, `TASK-037`, `TASK-038`, `TASK-040`, `TASK-043` e `TASK-044`.
- **Gate independente do Reviewer:** `TASK-045`–`TASK-048`; o Coder não executa nem conclui essas tarefas.

### Fluxo obrigatório de execução e revisão

1. O Owner delega somente uma tarefa atômica ao Coder, respeitando arquivos, dependências e critérios declarados.
2. Ao concluir, o Coder entrega alterações e evidências, mas não marca a tarefa como concluída.
3. O Owner delega imediatamente a mesma tarefa ao Reviewer para validação independente dos critérios, testes e regressões aplicáveis.
4. Somente após o Reviewer retornar **PASS**, o Owner marca a tarefa e seus critérios como concluídos em `docs/TASKS.md` e libera suas dependentes.
5. Se o Reviewer retornar **FAIL**, a tarefa permanece aberta, a falha é registrada em `docs/failures/` e a mesma tarefa volta ao Coder para correção; após a correção, uma nova revisão é obrigatória.
6. As tarefas `TASK-045`–`TASK-048` continuam sendo gates exclusivos do Reviewer e não são executadas pelo Coder.

### Ondas executáveis

1. **Onda 1 — risco e desbloqueio:** executar `TASK-005` primeiro. Em paralelo, quando houver mais de um executor, podem avançar `TASK-007`, `TASK-008`, `TASK-009`, `TASK-017`, `TASK-018`, `TASK-026`, `TASK-028` e `TASK-033`. `TASK-032` aguarda `TASK-008`.
2. **Onda 2 — dados e regras:** após `TASK-007`–`TASK-009`, executar `TASK-010`, `TASK-012`, `TASK-022`, `TASK-023`, `TASK-024`, `TASK-027`, `TASK-032` e `TASK-034` conforme suas dependências; continuar a cadeia `TASK-012` → `TASK-013` → `TASK-014` → (`TASK-015` e `TASK-016`).
3. **Onda 3 — shell e componentes:** executar `TASK-019` e `TASK-020` após `TASK-018`, integrar em `TASK-021` e concluir `TASK-025` após `TASK-024`.
4. **Onda 4 — integrações de produto:** executar `TASK-029` → `TASK-030` → `TASK-031`; em paralelo, concluir `TASK-035` → `TASK-036` e `TASK-037` → `TASK-038` → `TASK-039`, além de `TASK-040`.
5. **Onda 5 — endurecimento:** executar `TASK-041` → `TASK-042` → `TASK-043` → `TASK-044`; somente então transferir para o Reviewer em `TASK-045`.

### Caminho crítico atual

`TASK-007` → `TASK-012` → `TASK-013` → `TASK-014` → `TASK-016` → `TASK-029` → `TASK-031` → `TASK-041` → `TASK-042` → `TASK-043` → `TASK-044` → `TASK-045` → `TASK-046` → `TASK-047` → `TASK-048`.

### Riscos e regras de parada

- **Dependências (`TASK-005`):** o histórico `docs/failures/setup-05-peer-dependency-failure.json` registra `ERESOLVE` e seis vulnerabilidades altas. Em 2026-09-06, o Coder atualizou `next` e `eslint-config-next` juntos para `16.3.2`; `npm install` e `npm run build` passaram sem `ERESOLVE`, mas `npm audit --json` ainda encontrou quatro vulnerabilidades altas com correção disponível (`brace-expansion`, `fast-uri`, `js-yaml` e `nanoid`). O responsável autorizou atualização controlada das dependências diretas de desenvolvimento dentro das versões principais previstas na SPEC, desde que todos os gates permaneçam sem quebra. Mudança de versão principal exige nova decisão e atualização prévia da SPEC. Permanecem proibidos `--force`, `--legacy-peer-deps`, `overrides` e `resolutions` ad hoc.
- **Dados (`TASK-010`):** os 720 registros devem ser determinísticos e satisfazer cardinalidade, continuidade, limite, desvio padrão e tendência antes de `TASK-011`; não preencher manualmente sem validação reproduzível.
- **Estado inconsistente conhecido:** `TASK-006` possui artefatos concluídos, embora `TASK-005` ainda esteja aberta. Os testes podem ser usados durante o desenvolvimento, mas o gate final `TASK-042` continua bloqueado por `TASK-005`.
- **Atomicidade:** executar uma tarefa por vez por agente e respeitar os arquivos declarados. Se uma tarefa ultrapassar 30 minutos ou três arquivos, interromper e devolver ao Owner para subdivisão, sem ampliar silenciosamente o escopo.
- **Visual:** toda implementação deve seguir `docs/DESIGN_SYSTEM.md` v1.2 e o `.pen`, preservando LineChart de série única, seletor próprio, ranking municipal com 15 UBS, três estados, três tendências, histórico de 12 meses, navegação ativa sublinhada e footer completo.

## Base e dependências

- [x] **ID**: `TASK-001`
  - **Files**: `components.json`, `src/components/ui/card.tsx`, `src/components/ui/select.tsx`
  - **Dependencies**: `[]`
  - **Acceptance**:
    - [x] Shadcn está configurado com RSC, TypeScript, Tailwind e aliases de `src/`
    - [x] Card e Select existem e compilam sem alteração de suas assinaturas públicas
    - [x] `npx tsc --noEmit` termina sem erros

- [x] **ID**: `TASK-002`
  - **Files**: `src/components/ui/badge.tsx`, `src/components/ui/separator.tsx`, `src/components/ui/tooltip.tsx`
  - **Dependencies**: `TASK-001`
  - **Acceptance**:
    - [x] Badge, Separator e Tooltip existem em `src/components/ui/`
    - [x] Os componentes permanecem compatíveis com Server e Client Components conforme sua implementação
    - [x] `npx tsc --noEmit` termina sem erros

- [x] **ID**: `TASK-003`
  - **Files**: `src/components/ui/skeleton.tsx`, `src/lib/utils.ts`, `package.json`
  - **Dependencies**: `TASK-001`
  - **Acceptance**:
    - [x] Skeleton existe em `src/components/ui/`
    - [x] `cn()` combina `clsx` e `tailwind-merge`
    - [x] As dependências usadas por `cn()` constam em `package.json`
    - [x] `npx tsc --noEmit` termina sem erros

- [x] **ID**: `TASK-004`
  - **Files**: `src/lib/types.ts`
  - **Dependencies**: `[]`
  - **Acceptance**:
    - [x] O arquivo exporta todos os schemas de domínio da seção 5 da SPEC
    - [x] `Indicator.id` contém exatamente os quatro IDs autorizados
    - [x] `IndicatorStatus`, `Trend` e `PeriodFilter` contêm exatamente seus valores especificados
    - [x] `npx tsc --noEmit` termina sem erros

- [x] **ID**: `TASK-005`
  - **Files**: `package.json`, `package-lock.json`
  - **Dependencies**: `[]`
  - **Acceptance**:
    - [x] `next` está fixado em `16.3.2` e as dependências de teste permanecem nas faixas autorizadas pela SPEC
    - [x] `npm install` termina com código zero e sem aviso `ERESOLVE`
    - [x] Nenhum conflito é ocultado com `--force` ou `--legacy-peer-deps`
    - [x] `npm audit --json` não registra vulnerabilidade alta ou crítica com correção disponível
    - [x] `npm run build` termina sem erros

- [x] **ID**: `TASK-006`
  - **Files**: `vitest.config.ts`, `src/test/setup.ts`
  - **Dependencies**: `TASK-005`
  - **Acceptance**:
    - [x] Vitest usa ambiente `jsdom` e globals
    - [x] A configuração carrega `src/test/setup.ts`
    - [x] O setup importa `@testing-library/jest-dom/vitest`
    - [x] `npm test -- --passWithNoTests` termina sem erros

- [x] **ID**: `TASK-007`
  - **Files**: `src/lib/constants.ts`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [x] `META_THRESHOLDS` contém os limites 100 e 80
    - [x] `PERIOD_LABELS` contém as quatro labels PT-BR
    - [x] `PERIOD_MONTHS` mapeia as janelas para 1, 3, 6 e 12
    - [x] `STATUS_CLASSES` define background, border, text e icon para os três estados
    - [x] `npx tsc --noEmit` termina sem erros

## Dados locais

- [x] **ID**: `TASK-008`
  - **Files**: `src/data/ubs.ts`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [x] `ubsList` exporta exatamente 15 objetos `UBS`
    - [x] IDs únicos cobrem 1 a 15 e códigos CNES únicos possuem seis dígitos
    - [x] Cada unidade possui nome, equipe e endereço
    - [x] Cada unidade possui entre 1.500 e 4.500 cadastrados

- [x] **ID**: `TASK-009`
  - **Files**: `src/data/indicators.ts`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [x] `indicatorsList` exporta exatamente quatro objetos `Indicator`
    - [x] IDs e metas correspondem à seção 4 do PRD
    - [x] Cada indicador possui descrição, unidade e fonte
    - [x] `npx tsc --noEmit` termina sem erros

- [x] **ID**: `TASK-010`
  - **Files**: `src/data/history.ts`
  - **Dependencies**: `TASK-008`, `TASK-009`
  - **Acceptance**:
    - [x] `historyData` exporta exatamente 720 registros
    - [x] Cada combinação UBS/indicador contém os 12 meses de `2025-07` a `2026-06`
    - [x] Valores ficam entre zero e 130% da meta correspondente
    - [x] Cada série respeita o limite de desvio padrão da SPEC
    - [x] Junho supera julho em pelo menos 42 das 60 séries

- [x] **ID**: `TASK-011`
  - **Files**: `vitest.config.ts`, `src/data/data-integrity.test.ts`
  - **Dependencies**: `TASK-006`, `TASK-010`
  - **Acceptance**:
    - [x] Vitest resolve o alias `@` para `src` sem mocks de infraestrutura nem nova dependência
    - [x] Testes verificam cardinalidade, referências e meses contínuos
    - [x] Testes verificam limites de valores e cadastrados
    - [x] Testes verificam desvio padrão por série e tendência geral
    - [x] `npm test -- src/data/data-integrity.test.ts` termina sem falhas

## Regras de negócio

- [x] **ID**: `TASK-012`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-006`, `TASK-007`
  - **Acceptance**:
    - [x] `getIndicatorStatus` implementa os limites de RB-01
    - [x] Meta inválida ou entrada não finita lança erro
    - [x] Testes cobrem os limites exatos de 80% e 100%
    - [x] O teste direcionado e `npx tsc --noEmit` terminam sem erros

- [x] **ID**: `TASK-013`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-012`
  - **Acceptance**:
    - [x] `filterByPeriod` ancora no maior mês recebido
    - [x] As janelas retornam 1, 3, 6 e 12 meses calendário inclusivos
    - [x] A função não usa `new Date()` e ordena por mês crescente
    - [x] Testes cobrem virada de ano e entrada vazia

- [x] **ID**: `TASK-014`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-013`, `TASK-008`
  - **Acceptance**:
    - [x] `aggregateByIndicator` calcula a média temporal de cada UBS antes da consolidação
    - [x] A consolidação pondera somente UBS com registros por cadastrados
    - [x] O resultado usa uma casa decimal e entrada vazia retorna zero
    - [x] Testes verificam um resultado ponderado numérico exato

- [x] **ID**: `TASK-015`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-014`, `TASK-009`
  - **Acceptance**:
    - [x] `calculateUBSScore` aplica quatro parcelas iguais limitadas a 0–100
    - [x] `calculateRanking` exclui UBS sem os quatro indicadores
    - [x] Ordenação usa pontuação decrescente e desempate por nome `pt-BR`
    - [x] Testes cobrem teto, arredondamento, exclusão, ordem e empate

- [x] **ID**: `TASK-016`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-014`
  - **Acceptance**:
    - [x] `getTrend` compara os três meses recentes aos três anteriores por padrão
    - [x] Variações acima de 5%, abaixo de -5% e intermediárias retornam os três estados corretos
    - [x] O consolidado municipal é ponderado por cadastrados
    - [x] Histórico insuficiente retorna `estavel`
    - [x] Testes cobrem os quatro comportamentos

- [x] **ID**: `TASK-017`
  - **Files**: `src/hooks/use-filters.ts`, `src/hooks/use-filters.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-004`
  - **Acceptance**:
    - [x] O hook inicia com todas as UBS e último mês
    - [x] Alterações de UBS e período preservam o outro campo
    - [x] `resetFilters` restaura o estado inicial
    - [x] O teste direcionado termina sem falhas

## Layout compartilhado

- [x] **ID**: `TASK-018`
  - **Files**: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
  - **Dependencies**: `TASK-003`
  - **Acceptance**:
    - [x] `html` usa `lang="pt-BR"` e metadata contextual do Painel SUS
    - [x] Body usa Geist, altura mínima de tela e estrutura flexível
    - [x] Skip link aponta para `#main-content` e fica visível ao foco
    - [x] Foco global e movimento reduzido atendem à seção 10 da SPEC
    - [x] A rota inicial renderiza um único `<main id="main-content">` sem substituir ainda o conteúdo da TASK-031
    - [x] `npx tsc --noEmit` termina sem erros

- [x] **ID**: `TASK-019`
  - **Files**: `src/components/layout/header.tsx`
  - **Dependencies**: `TASK-018`
  - **Acceptance**:
    - [x] Header contém links para Dashboard, Indicadores e Sobre
    - [x] Navegação possui nome acessível e alvos mínimos de 44×44 px
    - [x] A rota ativa usa `aria-current="page"`, peso e underline além de cor
    - [x] O layout permanece utilizável a 375 px

- [x] **ID**: `TASK-020`
  - **Files**: `src/components/layout/footer.tsx`
  - **Dependencies**: `TASK-018`
  - **Acceptance**:
    - [x] Footer informa que os dados são simulados
    - [x] Footer lista CNES, e-SUS AB e DATASUS
    - [x] Footer mostra “Protótipo v1.0 — Saúde Itapira”
    - [x] Conteúdo não fica recortado e usa `role="contentinfo"`

- [x] **ID**: `TASK-021`
  - **Files**: `src/app/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`
  - **Dependencies**: `TASK-019`, `TASK-020`
  - **Acceptance**:
    - [x] Header aparece antes de `<main id="main-content">`
    - [x] Main cresce para preencher a página
    - [x] Footer aparece depois do main em todas as rotas
    - [x] `npm run build` termina sem erros

## Filtros e dashboard

- [x] **ID**: `TASK-022`
  - **Files**: `src/components/filters/ubs-filter.tsx`, `src/components/filters/period-filter.tsx`
  - **Dependencies**: `TASK-007`, `TASK-008`
  - **Acceptance**:
    - [x] Os Selects são controlados e usam as props da SPEC
    - [x] UBS oferece “Todas as UBS” e as 15 unidades
    - [x] Período oferece as quatro janelas de `PERIOD_LABELS`
    - [x] Labels visíveis estão associados aos controles
    - [x] Alterações retornam valores tipados corretos

- [x] **ID**: `TASK-023`
  - **Files**: `src/components/filters/indicator-filter.tsx`
  - **Dependencies**: `TASK-009`
  - **Acceptance**:
    - [x] O Select controlado usa `IndicatorFilterProps`
    - [x] As quatro opções vêm da prop `indicators`
    - [x] A label visível é “Indicador do gráfico”
    - [x] Alterar a seleção retorna um `Indicator["id"]`

- [x] **ID**: `TASK-024`
  - **Files**: `src/components/dashboard/indicator-card.tsx`, `src/components/dashboard/indicator-card.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-007`, `TASK-012`
  - **Acceptance**:
    - [x] Card exibe nome, valor, unidade, meta, tendência e estado
    - [x] Fundo e borda correspondem ao estado recebido
    - [x] Verde, amarelo e vermelho possuem texto e ícone; vermelho mostra “Abaixo da meta”
    - [x] O artigo possui nome acessível e números tabulares
    - [x] Testes cobrem conteúdo e os três estados

- [x] **ID**: `TASK-025`
  - **Files**: `src/components/dashboard/indicator-grid.tsx`
  - **Dependencies**: `TASK-024`
  - **Acceptance**:
    - [x] Um card é renderizado para cada item recebido
    - [x] Quatro itens produzem quatro artigos
    - [x] Grid usa uma coluna no mobile, duas a partir de 640 px e quatro a partir de 1024 px
    - [x] Espaçamento segue o Design System alinhado à SPEC v1.2

- [x] **ID**: `TASK-026`
  - **Files**: `src/components/dashboard/trend-chart.tsx`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [x] O Client Component usa Recharts `LineChart` e exatamente uma `Line`
    - [x] `ReferenceLine`, eixos e tooltip informam meta, mês e percentual
    - [x] Todos os pontos recebidos aparecem em ordem
    - [x] Região nomeada e resumo textual comunicam indicador, valores e meta
    - [x] O componente não usa `BarChart`

- [x] **ID**: `TASK-027`
  - **Files**: `src/components/dashboard/ranking-table.tsx`, `src/components/dashboard/ranking-table.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-007`, `TASK-015`
  - **Acceptance**:
    - [x] Tabela semântica contém caption e cinco headers com `scope="col"`
    - [x] Linhas preservam a ordem e pontuação com uma casa decimal
    - [x] Cada UBS possui link para `/ubs/[id]`
    - [x] Estado é comunicado por texto além de cor e a tabela permite overflow horizontal
    - [x] Testes cobrem semântica, ordem, links e estados

- [x] **ID**: `TASK-028`
  - **Files**: `src/components/dashboard/empty-state.tsx`
  - **Dependencies**: `TASK-003`
  - **Acceptance**:
    - [x] O estado informa ausência de registros para os filtros
    - [x] Botão “Limpar filtros” possui alvo mínimo de 44×44 px
    - [x] Ativar o botão chama `onClear` uma vez
    - [x] Não existe texto ou ação “Tentar novamente”

- [x] **ID**: `TASK-029`
  - **Files**: `src/components/dashboard/dashboard-client.tsx`
  - **Dependencies**: `TASK-016`, `TASK-017`, `TASK-022`, `TASK-023`, `TASK-025`, `TASK-026`, `TASK-027`, `TASK-028`
  - **Acceptance**:
    - [x] Estado inicial usa todas as UBS, último mês e Cobertura Vacinal no gráfico
    - [x] UBS filtra somente cartões e gráfico; período filtra cartões, gráfico e ranking
    - [x] Ranking sempre é calculado com as 15 UBS da janela ativa
    - [x] Seletor do gráfico troca somente a série, meta e resumo do gráfico
    - [x] Ausência de registros mostra `EmptyState` e limpar restaura UBS e período

- [x] **ID**: `TASK-030`
  - **Files**: `src/components/dashboard/dashboard-client.tsx`, `src/components/dashboard/dashboard-client.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-029`
  - **Acceptance**:
    - [x] Teste confirma os três valores iniciais dos controles
    - [x] Teste confirma que trocar indicador altera o gráfico sem alterar cartões ou ranking
    - [x] Teste confirma que selecionar UBS preserva as 15 linhas do ranking
    - [x] Teste confirma que período atualiza cartões, gráfico e ranking
    - [x] Teste cobre estado vazio e limpeza dos filtros

- [x] **ID**: `TASK-031`
  - **Files**: `src/app/page.tsx`
  - **Dependencies**: `TASK-010`, `TASK-021`, `TASK-029`
  - **Acceptance**:
    - [x] A página permanece Server Component
    - [x] Dados locais completos são passados ao `DashboardClient`
    - [x] Título e introdução identificam painel e período dos dados
    - [x] Não existe fetch HTTP nem conteúdo padrão do Create Next App
    - [x] `npm run build` gera `/` sem erros

## Correção de paridade visual do Dashboard

> Auditoria de referência: `docs/audits/dashboard-pen-visual-gap-audit.json`. O frame `pg1` de `docs/layout/painel-sus.pen` orienta geometria e composição visual; PRD/SPEC prevalecem em conflitos de conteúdo, dados e acessibilidade. Não alterar valores de produção para imitar exemplos estáticos do `.pen`.

- [x] **ID**: `TASK-049`
  - **Files**: `src/components/layout/header.tsx`
  - **Dependencies**: `TASK-031`
  - **Acceptance**:
    - [x] Header desktop usa altura de 64 px, padding horizontal de 24 px e navegação com gap de 24 px
    - [x] Marca usa `public/logo.png` em 44×24 px e título “Painel SUS” em 18 px/700 sem subtítulo adicional
    - [x] Estado ativo preserva `aria-current`, cor, peso e underline
    - [x] Em 375 px os três links permanecem visíveis, operáveis e sem overflow horizontal

- [x] **ID**: `TASK-050`
  - **Files**: `src/app/globals.css`, `src/app/page.tsx`, `src/components/dashboard/dashboard-client.tsx`
  - **Dependencies**: `TASK-049`
  - **Acceptance**:
    - [x] Tokens globais resolvem background para `#fafafa`, primary para `#004B87` e primary hover/light conforme o Design System
    - [x] A página usa largura máxima de 1280 px, canvas zinc-50 e ritmo vertical coerente com `pg1`
    - [x] Título e introdução exigidos pela TASK-031 permanecem disponíveis sem romper a sequência visual principal Filter Bar → Cards → Trend → Ranking
    - [x] Títulos de seção do dashboard usam 18 px/600 e valores dos cards permanecem em 30 px/700

- [x] **ID**: `TASK-051`
  - **Files**: `src/components/dashboard/dashboard-client.tsx`, `src/components/filters/ubs-filter.tsx`, `src/components/filters/period-filter.tsx`
  - **Dependencies**: `TASK-050`
  - **Acceptance**:
    - [x] Em 1280 px a Filter Bar usa fundo branco, borda inferior, padding 16×24 px, gap de 16 px e controles alinhados horizontalmente
    - [x] UBS e período usam larguras de 200 px e 180 px, respectivamente, com labels acessíveis sem ocupar linha acima dos controles
    - [x] A ação visual “Limpar” permanece presente e desabilitada no estado padrão, sem disparar callback quando desabilitada
    - [x] Em 375 px os controles ocupam a largura disponível, empilham sem overflow e mantêm alvos de 44 px

- [x] **ID**: `TASK-052`
  - **Files**: `src/components/dashboard/indicator-card.tsx`, `src/components/dashboard/indicator-grid.tsx`
  - **Dependencies**: `TASK-050`
  - **Acceptance**:
    - [x] Em 1280 px a grade apresenta quatro cards de largura uniforme, altura de 245 px e gap de 24 px
    - [x] Cards usam padding de 24 px, radius de 8 px, shadow-sm e borda esquerda semafórica de 4 px
    - [x] Anatomia visual segue ícone, nome, valor, meta e tendência; texto de estado permanece acessível sem criar desalinhamento entre cards
    - [x] Em 375 px os cards usam uma coluna, largura fluida e não recortam conteúdo

- [x] **ID**: `TASK-053`
  - **Files**: `src/components/dashboard/dashboard-client.tsx`, `src/components/dashboard/trend-chart.tsx`, `src/components/filters/indicator-filter.tsx`
  - **Dependencies**: `TASK-051`, `TASK-052`
  - **Acceptance**:
    - [x] Título, seletor de 260×44 px e resumo curto ficam dentro do mesmo card de tendência com border, radius 12 px, shadow e padding 24 px
    - [x] Em 1280 px label, seletor e resumo ficam na mesma linha; em 375 px quebram sem overflow
    - [x] Gráfico mantém exatamente uma `Line`, `ReferenceLine`, tooltip e altura responsiva definida na SPEC
    - [x] Legenda visível identifica “Valor” e “Meta”, enquanto a descrição detalhada permanece disponível para tecnologia assistiva
    - [x] Trocar o indicador continua alterando somente série, meta e resumo do gráfico

- [x] **ID**: `TASK-054`
  - **Files**: `src/components/dashboard/dashboard-client.tsx`, `src/components/dashboard/ranking-table.tsx`, `src/components/dashboard/ranking-table.test.tsx`
  - **Dependencies**: `TASK-053`
  - **Acceptance**:
    - [x] Ranking fica em card branco com border, radius 12 px, shadow-sm, padding 24 px e gap interno de 16 px
    - [x] Título visível é “Ranking municipal das UBS” em 18 px/600
    - [x] Nota visível informa “Comparação municipal — 15 UBS na janela selecionada. O filtro de UBS não altera este ranking.”
    - [x] Tabela preserva 15 linhas, altura de 48 px, links e overflow horizontal em 375 px

- [x] **ID**: `TASK-055`
  - **Files**: `docs/audits/dashboard-pen-visual-remediation.json`, `docs/failures/dashboard-pen-visual-remediation-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `TASK-049`, `TASK-050`, `TASK-051`, `TASK-052`, `TASK-053`, `TASK-054`
  - **Acceptance**:
    - [x] Reviewer compara header, Filter Bar, cards, tendência, ranking e footer com `pg1` em 1280 px e 375 px
    - [x] Auditoria registra evidência visual disponível e diferenças residuais, sem exigir que dados reais imitem valores demonstrativos do `.pen`
    - [x] Footer permanece conforme PRD/SPEC, sem promoção pessoal, com fontes e versão completas
    - [x] TypeScript, lint, testes e build passam sem regressões
    - [x] Qualquer desvio dos critérios TASK-049–TASK-054 mantém a tarefa aberta e gera o arquivo de falha

- [x] **ID**: `TASK-056`
  - **Files**: `src/components/layout/header.tsx`, `.next/`
  - **Dependencies**: `TASK-055`
  - **Acceptance**:
    - [x] Header não importa nem renderiza `Building2` e usa somente `/logo.png` para a marca visual
    - [x] Cache de desenvolvimento `.next` é regenerado após encerrar o servidor Next.js anterior
    - [x] Nova instância de `next dev` responde HTTP 200 sem referenciar o chunk obsoleto `building-2.mjs`
    - [x] TypeScript, lint, testes e build continuam passando

## Ajustes visuais aprovados — PRD/SPEC v1.3

> Decisões do responsável em 2026-09-07: gráfico inicia com 12 meses próprios; título/introdução permanecem e devem ser refletidos no Pencil; footer inclui `raigomes.dev`; cards usam `💉`, `🤰`, `❤️`, `🩸`.

- [x] **ID**: `TASK-057`
  - **Files**: `src/components/filters/ubs-filter.tsx`, `src/components/filters/period-filter.tsx`, `src/components/filters/indicator-filter.tsx`
  - **Dependencies**: `TASK-056`
  - **Acceptance**:
    - [x] Selects mantêm IDs técnicos no estado e exibem as labels selecionadas ao usuário
    - [x] Estado inicial mostra “Todas as UBS”, “Último mês” e “Cobertura Vacinal”
    - [x] Após interação, cada trigger mostra o nome da opção escolhida e nunca `all`, `ultimo-*` ou IDs de indicador
    - [x] Labels, tipos, callbacks e alvos mínimos de 44 px permanecem preservados

- [x] **ID**: `TASK-058`
  - **Files**: `src/components/dashboard/indicator-card.tsx`, `src/components/dashboard/indicator-card.test.tsx`
  - **Dependencies**: `TASK-057`
  - **Acceptance**:
    - [x] Cobertura Vacinal, Pré-natal, Hipertensão e Diabetes exibem respectivamente `💉`, `🤰`, `❤️` e `🩸`
    - [x] Ícones de indicador são decorativos e não substituem texto acessível de nome, estado e tendência
    - [x] Os quatro ícones permanecem alinhados ao cabeçalho dos cards sem alterar a geometria aprovada na TASK-052
    - [x] Testes cobrem o mapeamento completo e os três estados semafóricos

- [x] **ID**: `TASK-059`
  - **Files**: `src/components/dashboard/dashboard-client.tsx`, `src/components/dashboard/dashboard-client.test.tsx`
  - **Dependencies**: `TASK-057`
  - **Acceptance**:
    - [x] Na carga inicial o gráfico recebe 12 pontos, enquanto cartões e ranking usam somente o último mês
    - [x] A primeira alteração do período aplica 1, 3, 6 ou 12 meses a cartões, gráfico e ranking
    - [x] “Limpar filtros” restaura cartões/ranking para Último mês e o gráfico para 12 pontos
    - [x] Filtro de UBS e seletor de indicador preservam os comportamentos independentes definidos na SPEC
    - [x] Testes exercitam o `TrendChart` real e comprovam estado inicial, interação e reset

- [x] **ID**: `TASK-060`
  - **Files**: `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`
  - **Dependencies**: `TASK-058`
  - **Acceptance**:
    - [x] Item ativo do Header usa line-height de 20 px, sem raio visual e underline reto de 2 px com cantos de 1 px
    - [x] Estado ativo preserva alvo de 44 px, foco visível, `aria-current`, cor e peso 600
    - [x] Footer exibe integralmente disclaimer, promoção `raigomes.dev`, fontes e “Protótipo v1.0 — Saúde Itapira”
    - [x] Footer usa altura fluida, wrapping e contraste legível sem cortar texto em 375 px

- [x] **ID**: `TASK-061`
  - **Files**: `docs/layout/painel-sus.pen`
  - **Dependencies**: `TASK-060`
  - **Acceptance**:
    - [x] Designer adiciona ao `pg1` o título “Painel SUS” e a introdução preservados pela TASK-031
    - [x] Footer do Pencil mantém as três linhas completas autorizadas, incluindo `raigomes.dev`, fontes e versão
    - [x] Filtros e gráfico representam labels de apresentação e visão inicial de 12 meses sem IDs técnicos
    - [x] Arquivo `.pen` permanece válido no schema 2.15 e abre sem erro no Pencil

- [x] **ID**: `TASK-062`
  - **Files**: `docs/audits/dashboard-pen-followup-remediation.json`, `docs/failures/dashboard-pen-followup-remediation-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `TASK-057`, `TASK-058`, `TASK-059`, `TASK-060`, `TASK-061`
  - **Acceptance**:
    - [x] Reviewer compara localhost e `pg1` em 1280 px e 375 px para filtros, ícones, gráfico, título, header e footer
    - [x] Auditoria comprova labels humanas nos três Selects e 12 pontos no gráfico inicial
    - [x] Auditoria comprova geometria ativa do Header, título/introdução e footer completos sem recorte
    - [x] TypeScript, lint, testes, cobertura e build passam sem regressões
    - [x] Qualquer desvio mantém a tarefa aberta e gera o arquivo de falha

## Detalhe de UBS

- [x] **ID**: `TASK-032`
  - **Files**: `src/components/ubs/ubs-info-card.tsx`
  - **Dependencies**: `TASK-008`
  - **Acceptance**:
    - [x] Card exibe nome, CNES, equipe, cadastrados e endereço
    - [x] Rótulos são compreensíveis sem depender da posição visual
    - [x] Cadastrados usam formatação `pt-BR`
    - [x] `npx tsc --noEmit` termina sem erros

- [x] **ID**: `TASK-033`
  - **Files**: `src/components/ubs/radar-chart.tsx`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [x] Client Component usa `RadarChart` com quatro eixos
    - [x] Séries de valor e meta possuem legenda visível
    - [x] Dados chegam exclusivamente por `RadarChartProps`
    - [x] Região e resumo textual informam UBS e os quatro valores

- [x] **ID**: `TASK-034`
  - **Files**: `src/components/ubs/history-table.tsx`
  - **Dependencies**: `TASK-009`, `TASK-012`
  - **Acceptance**:
    - [x] Tabela possui 12 linhas mensais e cinco colunas
    - [x] Meses ficam em ordem crescente
    - [x] Caption, headers e estados são semanticamente identificados
    - [x] Todas as colunas permanecem acessíveis por overflow horizontal

- [x] **ID**: `TASK-035`
  - **Files**: `src/app/ubs/[id]/page.tsx`
  - **Dependencies**: `TASK-010`, `TASK-021`, `TASK-032`
  - **Acceptance**:
    - [x] Server Component valida ID inteiro positivo e busca a UBS local
    - [x] ID inexistente mostra “UBS não encontrada” e link para `/`
    - [x] UBS existente mostra breadcrumb e card informativo
    - [x] `generateMetadata` usa nome da UBS ou estado não encontrado
    - [x] `npm run build` gera a rota dinâmica sem erros

- [x] **ID**: `TASK-036`
  - **Files**: `src/app/ubs/[id]/page.tsx`
  - **Dependencies**: `TASK-014`, `TASK-033`, `TASK-034`, `TASK-035`
  - **Acceptance**:
    - [x] Quatro pontos radar usam o último mês disponível da UBS
    - [x] Radar apresenta valor e meta abaixo do card informativo
    - [x] Tabela recebe os 12 meses completos da unidade
    - [x] A página não usa estado Client nem fetch HTTP
    - [x] `/ubs/1` e `/ubs/999` compilam sem erro

## Indicadores e Sobre

- [x] **ID**: `TASK-037`
  - **Files**: `src/components/indicadores/indicator-detail.tsx`
  - **Dependencies**: `TASK-014`, `TASK-026`, `TASK-027`
  - **Acceptance**:
    - [x] Detalhe exibe descrição, meta e fonte do indicador
    - [x] LineChart apresenta os 12 meses consolidados e referência da meta
    - [x] Tabela compara as 15 UBS no último mês disponível
    - [x] Valor, meta e estado não dependem somente de cor
    - [x] Nenhum link para `/indicadores/[id]` é criado

- [x] **ID**: `TASK-038`
  - **Files**: `src/components/indicadores/indicator-list.tsx`, `src/components/indicadores/indicator-list.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-037`
  - **Acceptance**:
    - [x] Lista renderiza quatro botões com `aria-expanded` e `aria-controls`
    - [x] Inicialmente nenhum item está aberto e no máximo um permanece aberto
    - [x] Expansão não altera a URL e renderiza o detalhe correto
    - [x] Alvos interativos possuem no mínimo 44×44 px
    - [x] Testes cobrem estado inicial, troca e recolhimento

- [x] **ID**: `TASK-039`
  - **Files**: `src/app/indicadores/page.tsx`
  - **Dependencies**: `TASK-010`, `TASK-021`, `TASK-038`
  - **Acceptance**:
    - [x] Server Component exporta metadata “Indicadores - Painel SUS”
    - [x] Introdução explica os detalhes expansíveis
    - [x] Lista recebe indicadores, histórico e UBS por props
    - [x] Não existe rota dinâmica nem fetch HTTP
    - [x] `npm run build` gera `/indicadores` sem erros

- [x] **ID**: `TASK-040`
  - **Files**: `src/app/sobre/page.tsx`
  - **Dependencies**: `TASK-021`
  - **Acceptance**:
    - [x] Página exporta metadata “Sobre - Painel SUS”
    - [x] Explica Previne Brasil e o objetivo do protótipo em linguagem clara
    - [x] Lista CNES, e-SUS AB e DATASUS como fontes simuladas
    - [x] Destaca que os dados são simulados
    - [x] `npm run build` gera `/sobre` sem erros

## Segurança e gates

- [ ] **ID**: `TASK-041`
  - **Files**: `next.config.ts`
  - **Dependencies**: `TASK-031`, `TASK-036`, `TASK-039`, `TASK-040`
  - **Acceptance**:
    - [ ] `headers()` aplica CSP a todas as rotas
    - [ ] Headers incluem `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`
    - [ ] CSP permite somente origens necessárias ao aplicativo local e ao Next.js
    - [ ] `npm run build` termina sem erros

- [ ] **ID**: `TASK-042`
  - **Files**: `package.json`, `tsconfig.json`, `vitest.config.ts`
  - **Dependencies**: `TASK-005`, `TASK-011`, `TASK-024`, `TASK-027`, `TASK-030`, `TASK-038`, `TASK-041`
  - **Acceptance**:
    - [ ] `npx tsc --noEmit` termina com código zero
    - [ ] `npm run lint` termina com código zero e sem warnings
    - [ ] `npm test` e `npm run test:coverage` terminam sem falhas
    - [ ] `npm audit --json` não contém vulnerabilidade alta ou crítica com correção disponível
    - [ ] `npm run build` termina com código zero

- [ ] **ID**: `TASK-043`
  - **Files**: `src/app/page.tsx`, `src/app/ubs/[id]/page.tsx`, `src/app/indicadores/page.tsx`
  - **Dependencies**: `TASK-042`
  - **Acceptance**:
    - [ ] `/` exibe quatro cards, seletor e LineChart, além do ranking completo
    - [ ] Filtro de UBS preserva 15 UBS no ranking e período atualiza todo o dashboard
    - [ ] `/ubs/1` exibe perfil, radar e 12 meses; `/ubs/999` exibe retorno seguro
    - [ ] `/indicadores` expande detalhes sem mudar a rota
    - [ ] `/sobre` exibe explicação, fontes e disclaimer

- [ ] **ID**: `TASK-044`
  - **Files**: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/dashboard/dashboard-client.tsx`
  - **Dependencies**: `TASK-043`
  - **Acceptance**:
    - [ ] 375×667 usa uma coluna e não corta horizontalmente a página
    - [ ] 768×1024 usa no máximo duas colunas e gráficos ocupam a largura disponível
    - [ ] 1280×800 e 1920×1080 mostram quatro cards na mesma linha com largura legível
    - [ ] Tab percorre controles e links com foco visível e sem foco preso
    - [ ] Conteúdo principal aparece em menos de 3 segundos sob simulação 3G

## Gate independente do Reviewer

- [ ] **ID**: `TASK-045`
  - **Files**: `docs/audits/review-static.json`, `docs/failures/review-static-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `TASK-044`
  - **Acceptance**:
    - [ ] Reviewer registra comandos, versões e códigos de saída dos cinco gates da SPEC
    - [ ] Auditoria inclui `npm install` sem `ERESOLVE` e resultado completo de `npm audit --json`
    - [ ] Todos os gates precisam passar para concluir a tarefa
    - [ ] Falha mantém a tarefa aberta e gera o arquivo de falha

- [ ] **ID**: `TASK-046`
  - **Files**: `docs/audits/review-visual.json`, `docs/failures/review-visual-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `TASK-045`
  - **Acceptance**:
    - [ ] Reviewer compara as quatro rotas com `.pen` e Design System alinhados à SPEC v1.2
    - [ ] Auditoria confirma LineChart, seletor, ranking completo, três estados e três tendências
    - [ ] Auditoria confirma 12 meses, 15 UBS, underline ativo e footer completo sem recorte
    - [ ] Viewports 375, 768, 1280 e 1920 px são registrados
    - [ ] Qualquer desvio mantém a tarefa aberta e gera falha

- [ ] **ID**: `TASK-047`
  - **Files**: `docs/audits/review-web.json`, `docs/failures/review-web-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `TASK-046`
  - **Acceptance**:
    - [ ] Reviewer confirma `http://localhost:3000` antes das auditorias
    - [ ] Lighthouse registra Performance maior que 95 e Accessibility maior que 98
    - [ ] Axe não registra violação bloqueante ou crítica
    - [ ] Security Headers supera 80 com CSP segura
    - [ ] Resultados completos são salvos e qualquer falha mantém a tarefa aberta

- [ ] **ID**: `TASK-048`
  - **Files**: `docs/audits/review-release.json`, `docs/failures/review-release-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `TASK-047`
  - **Acceptance**:
    - [ ] Relatório consolida auditorias estática, visual, responsiva, Lighthouse, axe e segurança
    - [ ] Budgets finais são Accessibility ≥95, Performance ≥90 e Security ≥85
    - [ ] Responsividade é comprovada em 375×667, 768×1024 e 1920×1080
    - [ ] Release registra `passed: true` somente quando todos os gates passam
    - [ ] Falha mantém a tarefa aberta e gera o arquivo de falha
