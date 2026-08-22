# Tasks — Painel SUS

> Fonte de requisitos: `docs/PRD.md` v1.2 e `docs/SPEC.md` v1.2. Ordem definida por dependências. Cada tarefa altera no máximo três arquivos, deve caber em menos de 30 minutos e possui critérios verificáveis.
>
> Precondição do fluxo da Squad: antes das tarefas visuais, o Designer deve alinhar `docs/DESIGN_SYSTEM.md` e `docs/layout/painel-sus.pen` ao LineChart, ao seletor de indicador e ao ranking municipal definidos na SPEC v1.2.

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

- [ ] **ID**: `TASK-005`
  - **Files**: `package.json`, `package-lock.json`
  - **Dependencies**: `[]`
  - **Acceptance**:
    - [ ] `next` está fixado em `16.3.2` e as dependências de teste permanecem nas faixas autorizadas pela SPEC
    - [ ] `npm install` termina com código zero e sem aviso `ERESOLVE`
    - [ ] Nenhum conflito é ocultado com `--force` ou `--legacy-peer-deps`
    - [ ] `npm audit --json` não registra vulnerabilidade alta ou crítica com correção disponível
    - [ ] `npm run build` termina sem erros

- [x] **ID**: `TASK-006`
  - **Files**: `vitest.config.ts`, `src/test/setup.ts`
  - **Dependencies**: `TASK-005`
  - **Acceptance**:
    - [x] Vitest usa ambiente `jsdom` e globals
    - [x] A configuração carrega `src/test/setup.ts`
    - [x] O setup importa `@testing-library/jest-dom/vitest`
    - [x] `npm test -- --passWithNoTests` termina sem erros

- [ ] **ID**: `TASK-007`
  - **Files**: `src/lib/constants.ts`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [ ] `META_THRESHOLDS` contém os limites 100 e 80
    - [ ] `PERIOD_LABELS` contém as quatro labels PT-BR
    - [ ] `PERIOD_MONTHS` mapeia as janelas para 1, 3, 6 e 12
    - [ ] `STATUS_CLASSES` define background, border, text e icon para os três estados
    - [ ] `npx tsc --noEmit` termina sem erros

## Dados locais

- [ ] **ID**: `TASK-008`
  - **Files**: `src/data/ubs.ts`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [ ] `ubsList` exporta exatamente 15 objetos `UBS`
    - [ ] IDs únicos cobrem 1 a 15 e códigos CNES únicos possuem seis dígitos
    - [ ] Cada unidade possui nome, equipe e endereço
    - [ ] Cada unidade possui entre 1.500 e 4.500 cadastrados

- [ ] **ID**: `TASK-009`
  - **Files**: `src/data/indicators.ts`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [ ] `indicatorsList` exporta exatamente quatro objetos `Indicator`
    - [ ] IDs e metas correspondem à seção 4 do PRD
    - [ ] Cada indicador possui descrição, unidade e fonte
    - [ ] `npx tsc --noEmit` termina sem erros

- [ ] **ID**: `TASK-010`
  - **Files**: `src/data/history.ts`
  - **Dependencies**: `TASK-008`, `TASK-009`
  - **Acceptance**:
    - [ ] `historyData` exporta exatamente 720 registros
    - [ ] Cada combinação UBS/indicador contém os 12 meses de `2025-07` a `2026-06`
    - [ ] Valores ficam entre zero e 130% da meta correspondente
    - [ ] Cada série respeita o limite de desvio padrão da SPEC
    - [ ] Junho supera julho em pelo menos 42 das 60 séries

- [ ] **ID**: `TASK-011`
  - **Files**: `src/data/data-integrity.test.ts`
  - **Dependencies**: `TASK-006`, `TASK-010`
  - **Acceptance**:
    - [ ] Testes verificam cardinalidade, referências e meses contínuos
    - [ ] Testes verificam limites de valores e cadastrados
    - [ ] Testes verificam desvio padrão por série e tendência geral
    - [ ] `npm test -- src/data/data-integrity.test.ts` termina sem falhas

## Regras de negócio

- [ ] **ID**: `TASK-012`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-006`, `TASK-007`
  - **Acceptance**:
    - [ ] `getIndicatorStatus` implementa os limites de RB-01
    - [ ] Meta inválida ou entrada não finita lança erro
    - [ ] Testes cobrem os limites exatos de 80% e 100%
    - [ ] O teste direcionado e `npx tsc --noEmit` terminam sem erros

- [ ] **ID**: `TASK-013`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-012`
  - **Acceptance**:
    - [ ] `filterByPeriod` ancora no maior mês recebido
    - [ ] As janelas retornam 1, 3, 6 e 12 meses calendário inclusivos
    - [ ] A função não usa `new Date()` e ordena por mês crescente
    - [ ] Testes cobrem virada de ano e entrada vazia

- [ ] **ID**: `TASK-014`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-013`, `TASK-008`
  - **Acceptance**:
    - [ ] `aggregateByIndicator` calcula a média temporal de cada UBS antes da consolidação
    - [ ] A consolidação pondera somente UBS com registros por cadastrados
    - [ ] O resultado usa uma casa decimal e entrada vazia retorna zero
    - [ ] Testes verificam um resultado ponderado numérico exato

- [ ] **ID**: `TASK-015`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-014`, `TASK-009`
  - **Acceptance**:
    - [ ] `calculateUBSScore` aplica quatro parcelas iguais limitadas a 0–100
    - [ ] `calculateRanking` exclui UBS sem os quatro indicadores
    - [ ] Ordenação usa pontuação decrescente e desempate por nome `pt-BR`
    - [ ] Testes cobrem teto, arredondamento, exclusão, ordem e empate

- [ ] **ID**: `TASK-016`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `TASK-014`
  - **Acceptance**:
    - [ ] `getTrend` compara os três meses recentes aos três anteriores por padrão
    - [ ] Variações acima de 5%, abaixo de -5% e intermediárias retornam os três estados corretos
    - [ ] O consolidado municipal é ponderado por cadastrados
    - [ ] Histórico insuficiente retorna `estavel`
    - [ ] Testes cobrem os quatro comportamentos

- [ ] **ID**: `TASK-017`
  - **Files**: `src/hooks/use-filters.ts`, `src/hooks/use-filters.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-004`
  - **Acceptance**:
    - [ ] O hook inicia com todas as UBS e último mês
    - [ ] Alterações de UBS e período preservam o outro campo
    - [ ] `resetFilters` restaura o estado inicial
    - [ ] O teste direcionado termina sem falhas

## Layout compartilhado

- [ ] **ID**: `TASK-018`
  - **Files**: `src/app/layout.tsx`, `src/app/globals.css`
  - **Dependencies**: `TASK-003`
  - **Acceptance**:
    - [ ] `html` usa `lang="pt-BR"` e metadata contextual do Painel SUS
    - [ ] Body usa Geist, altura mínima de tela e estrutura flexível
    - [ ] Skip link aponta para `#main-content` e fica visível ao foco
    - [ ] Foco global e movimento reduzido atendem à seção 10 da SPEC
    - [ ] `npx tsc --noEmit` termina sem erros

- [ ] **ID**: `TASK-019`
  - **Files**: `src/components/layout/header.tsx`
  - **Dependencies**: `TASK-018`
  - **Acceptance**:
    - [ ] Header contém links para Dashboard, Indicadores e Sobre
    - [ ] Navegação possui nome acessível e alvos mínimos de 44×44 px
    - [ ] A rota ativa usa `aria-current="page"`, peso e underline além de cor
    - [ ] O layout permanece utilizável a 375 px

- [ ] **ID**: `TASK-020`
  - **Files**: `src/components/layout/footer.tsx`
  - **Dependencies**: `TASK-018`
  - **Acceptance**:
    - [ ] Footer informa que os dados são simulados
    - [ ] Footer lista CNES, e-SUS AB e DATASUS
    - [ ] Footer mostra “Protótipo v1.0 — Saúde Itapira”
    - [ ] Conteúdo não fica recortado e usa `role="contentinfo"`

- [ ] **ID**: `TASK-021`
  - **Files**: `src/app/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`
  - **Dependencies**: `TASK-019`, `TASK-020`
  - **Acceptance**:
    - [ ] Header aparece antes de `<main id="main-content">`
    - [ ] Main cresce para preencher a página
    - [ ] Footer aparece depois do main em todas as rotas
    - [ ] `npm run build` termina sem erros

## Filtros e dashboard

- [ ] **ID**: `TASK-022`
  - **Files**: `src/components/filters/ubs-filter.tsx`, `src/components/filters/period-filter.tsx`
  - **Dependencies**: `TASK-007`, `TASK-008`
  - **Acceptance**:
    - [ ] Os Selects são controlados e usam as props da SPEC
    - [ ] UBS oferece “Todas as UBS” e as 15 unidades
    - [ ] Período oferece as quatro janelas de `PERIOD_LABELS`
    - [ ] Labels visíveis estão associados aos controles
    - [ ] Alterações retornam valores tipados corretos

- [ ] **ID**: `TASK-023`
  - **Files**: `src/components/filters/indicator-filter.tsx`
  - **Dependencies**: `TASK-009`
  - **Acceptance**:
    - [ ] O Select controlado usa `IndicatorFilterProps`
    - [ ] As quatro opções vêm da prop `indicators`
    - [ ] A label visível é “Indicador do gráfico”
    - [ ] Alterar a seleção retorna um `Indicator["id"]`

- [ ] **ID**: `TASK-024`
  - **Files**: `src/components/dashboard/indicator-card.tsx`, `src/components/dashboard/indicator-card.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-007`, `TASK-012`
  - **Acceptance**:
    - [ ] Card exibe nome, valor, unidade, meta, tendência e estado
    - [ ] Fundo e borda correspondem ao estado recebido
    - [ ] Verde, amarelo e vermelho possuem texto e ícone; vermelho mostra “Abaixo da meta”
    - [ ] O artigo possui nome acessível e números tabulares
    - [ ] Testes cobrem conteúdo e os três estados

- [ ] **ID**: `TASK-025`
  - **Files**: `src/components/dashboard/indicator-grid.tsx`
  - **Dependencies**: `TASK-024`
  - **Acceptance**:
    - [ ] Um card é renderizado para cada item recebido
    - [ ] Quatro itens produzem quatro artigos
    - [ ] Grid usa uma coluna no mobile, duas a partir de 640 px e quatro a partir de 1024 px
    - [ ] Espaçamento segue o Design System alinhado à SPEC v1.2

- [ ] **ID**: `TASK-026`
  - **Files**: `src/components/dashboard/trend-chart.tsx`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [ ] O Client Component usa Recharts `LineChart` e exatamente uma `Line`
    - [ ] `ReferenceLine`, eixos e tooltip informam meta, mês e percentual
    - [ ] Todos os pontos recebidos aparecem em ordem
    - [ ] Região nomeada e resumo textual comunicam indicador, valores e meta
    - [ ] O componente não usa `BarChart`

- [ ] **ID**: `TASK-027`
  - **Files**: `src/components/dashboard/ranking-table.tsx`, `src/components/dashboard/ranking-table.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-007`, `TASK-015`
  - **Acceptance**:
    - [ ] Tabela semântica contém caption e cinco headers com `scope="col"`
    - [ ] Linhas preservam a ordem e pontuação com uma casa decimal
    - [ ] Cada UBS possui link para `/ubs/[id]`
    - [ ] Estado é comunicado por texto além de cor e a tabela permite overflow horizontal
    - [ ] Testes cobrem semântica, ordem, links e estados

- [ ] **ID**: `TASK-028`
  - **Files**: `src/components/dashboard/empty-state.tsx`
  - **Dependencies**: `TASK-003`
  - **Acceptance**:
    - [ ] O estado informa ausência de registros para os filtros
    - [ ] Botão “Limpar filtros” possui alvo mínimo de 44×44 px
    - [ ] Ativar o botão chama `onClear` uma vez
    - [ ] Não existe texto ou ação “Tentar novamente”

- [ ] **ID**: `TASK-029`
  - **Files**: `src/components/dashboard/dashboard-client.tsx`
  - **Dependencies**: `TASK-016`, `TASK-017`, `TASK-022`, `TASK-023`, `TASK-025`, `TASK-026`, `TASK-027`, `TASK-028`
  - **Acceptance**:
    - [ ] Estado inicial usa todas as UBS, último mês e Cobertura Vacinal no gráfico
    - [ ] UBS filtra somente cartões e gráfico; período filtra cartões, gráfico e ranking
    - [ ] Ranking sempre é calculado com as 15 UBS da janela ativa
    - [ ] Seletor do gráfico troca somente a série, meta e resumo do gráfico
    - [ ] Ausência de registros mostra `EmptyState` e limpar restaura UBS e período

- [ ] **ID**: `TASK-030`
  - **Files**: `src/components/dashboard/dashboard-client.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-029`
  - **Acceptance**:
    - [ ] Teste confirma os três valores iniciais dos controles
    - [ ] Teste confirma que trocar indicador altera o gráfico sem alterar cartões ou ranking
    - [ ] Teste confirma que selecionar UBS preserva as 15 linhas do ranking
    - [ ] Teste confirma que período atualiza cartões, gráfico e ranking
    - [ ] Teste cobre estado vazio e limpeza dos filtros

- [ ] **ID**: `TASK-031`
  - **Files**: `src/app/page.tsx`
  - **Dependencies**: `TASK-010`, `TASK-021`, `TASK-029`
  - **Acceptance**:
    - [ ] A página permanece Server Component
    - [ ] Dados locais completos são passados ao `DashboardClient`
    - [ ] Título e introdução identificam painel e período dos dados
    - [ ] Não existe fetch HTTP nem conteúdo padrão do Create Next App
    - [ ] `npm run build` gera `/` sem erros

## Detalhe de UBS

- [ ] **ID**: `TASK-032`
  - **Files**: `src/components/ubs/ubs-info-card.tsx`
  - **Dependencies**: `TASK-008`
  - **Acceptance**:
    - [ ] Card exibe nome, CNES, equipe, cadastrados e endereço
    - [ ] Rótulos são compreensíveis sem depender da posição visual
    - [ ] Cadastrados usam formatação `pt-BR`
    - [ ] `npx tsc --noEmit` termina sem erros

- [ ] **ID**: `TASK-033`
  - **Files**: `src/components/ubs/radar-chart.tsx`
  - **Dependencies**: `TASK-004`
  - **Acceptance**:
    - [ ] Client Component usa `RadarChart` com quatro eixos
    - [ ] Séries de valor e meta possuem legenda visível
    - [ ] Dados chegam exclusivamente por `RadarChartProps`
    - [ ] Região e resumo textual informam UBS e os quatro valores

- [ ] **ID**: `TASK-034`
  - **Files**: `src/components/ubs/history-table.tsx`
  - **Dependencies**: `TASK-009`, `TASK-012`
  - **Acceptance**:
    - [ ] Tabela possui 12 linhas mensais e cinco colunas
    - [ ] Meses ficam em ordem crescente
    - [ ] Caption, headers e estados são semanticamente identificados
    - [ ] Todas as colunas permanecem acessíveis por overflow horizontal

- [ ] **ID**: `TASK-035`
  - **Files**: `src/app/ubs/[id]/page.tsx`
  - **Dependencies**: `TASK-010`, `TASK-021`, `TASK-032`
  - **Acceptance**:
    - [ ] Server Component valida ID inteiro positivo e busca a UBS local
    - [ ] ID inexistente mostra “UBS não encontrada” e link para `/`
    - [ ] UBS existente mostra breadcrumb e card informativo
    - [ ] `generateMetadata` usa nome da UBS ou estado não encontrado
    - [ ] `npm run build` gera a rota dinâmica sem erros

- [ ] **ID**: `TASK-036`
  - **Files**: `src/app/ubs/[id]/page.tsx`
  - **Dependencies**: `TASK-014`, `TASK-033`, `TASK-034`, `TASK-035`
  - **Acceptance**:
    - [ ] Quatro pontos radar usam o último mês disponível da UBS
    - [ ] Radar apresenta valor e meta abaixo do card informativo
    - [ ] Tabela recebe os 12 meses completos da unidade
    - [ ] A página não usa estado Client nem fetch HTTP
    - [ ] `/ubs/1` e `/ubs/999` compilam sem erro

## Indicadores e Sobre

- [ ] **ID**: `TASK-037`
  - **Files**: `src/components/indicadores/indicator-detail.tsx`
  - **Dependencies**: `TASK-014`, `TASK-026`, `TASK-027`
  - **Acceptance**:
    - [ ] Detalhe exibe descrição, meta e fonte do indicador
    - [ ] LineChart apresenta os 12 meses consolidados e referência da meta
    - [ ] Tabela compara as 15 UBS no último mês disponível
    - [ ] Valor, meta e estado não dependem somente de cor
    - [ ] Nenhum link para `/indicadores/[id]` é criado

- [ ] **ID**: `TASK-038`
  - **Files**: `src/components/indicadores/indicator-list.tsx`, `src/components/indicadores/indicator-list.test.tsx`
  - **Dependencies**: `TASK-006`, `TASK-037`
  - **Acceptance**:
    - [ ] Lista renderiza quatro botões com `aria-expanded` e `aria-controls`
    - [ ] Inicialmente nenhum item está aberto e no máximo um permanece aberto
    - [ ] Expansão não altera a URL e renderiza o detalhe correto
    - [ ] Alvos interativos possuem no mínimo 44×44 px
    - [ ] Testes cobrem estado inicial, troca e recolhimento

- [ ] **ID**: `TASK-039`
  - **Files**: `src/app/indicadores/page.tsx`
  - **Dependencies**: `TASK-010`, `TASK-021`, `TASK-038`
  - **Acceptance**:
    - [ ] Server Component exporta metadata “Indicadores - Painel SUS”
    - [ ] Introdução explica os detalhes expansíveis
    - [ ] Lista recebe indicadores, histórico e UBS por props
    - [ ] Não existe rota dinâmica nem fetch HTTP
    - [ ] `npm run build` gera `/indicadores` sem erros

- [ ] **ID**: `TASK-040`
  - **Files**: `src/app/sobre/page.tsx`
  - **Dependencies**: `TASK-021`
  - **Acceptance**:
    - [ ] Página exporta metadata “Sobre - Painel SUS”
    - [ ] Explica Previne Brasil e o objetivo do protótipo em linguagem clara
    - [ ] Lista CNES, e-SUS AB e DATASUS como fontes simuladas
    - [ ] Destaca que os dados são simulados
    - [ ] `npm run build` gera `/sobre` sem erros

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
