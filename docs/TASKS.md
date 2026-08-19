# Tasks — Painel SUS

> Ordem de execução definida por dependências. Cada tarefa foi dimensionada para menos de 30 minutos, limita-se a três arquivos e possui de três a cinco critérios verificáveis.

## Épico 1 — Base do projeto

- [x] **ID**: `SETUP-01`
  - **Files**: `package.json`, `components.json`, `src/components/ui/`
  - **Dependencies**: `[]`
  - **Acceptance**:
    - [x] `components.json` configura Shadcn com RSC, TypeScript, Tailwind CSS e aliases de `src/`
    - [x] Card, Badge, Select, Separator, Skeleton e Tooltip existem em `src/components/ui/`
    - [x] `package.json` contém `recharts@^3.10.1` e as dependências requeridas pelos componentes Shadcn
    - [x] `npm run build` termina sem erros

- [x] **ID**: `SETUP-02`
  - **Files**: `src/lib/types.ts`
  - **Dependencies**: `[]`
  - **Acceptance**:
    - [x] O arquivo exporta `UBS`, `Indicator`, `HistoryRecord`, `Filters` e `PeriodFilter`
    - [x] O arquivo exporta `IndicatorStatus`, `IndicatorDisplay`, `RankingRow` e `RadarDataPoint`
    - [x] `IndicatorStatus` contém exatamente `verde`, `amarelo` e `vermelho`
    - [x] `PeriodFilter` contém exatamente as quatro janelas relativas definidas na SPEC
    - [x] `npx tsc --noEmit` termina sem erros

- [ ] **ID**: `SETUP-03`
  - **Files**: `src/lib/types.ts`
  - **Dependencies**: `SETUP-02`
  - **Acceptance**:
    - [ ] `Indicator.id` usa a união dos quatro IDs definidos na SPEC em vez de `string`
    - [ ] O arquivo exporta os tipos `TrendPoint`, `Trend` e `IndicatorComparisonRow` definidos na SPEC
    - [ ] Os tipos existentes permanecem compatíveis com todos os schemas da seção 5 da SPEC
    - [ ] `npx tsc --noEmit` termina sem erros

- [x] **ID**: `SETUP-04`
  - **Files**: `src/lib/utils.ts`, `package.json`
  - **Dependencies**: `SETUP-01`
  - **Acceptance**:
    - [x] `src/lib/utils.ts` exporta a função `cn(...inputs: ClassValue[])`
    - [x] `cn()` combina `clsx` e `tailwind-merge`
    - [x] `package.json` contém `clsx` e `tailwind-merge`
    - [x] `npx tsc --noEmit` termina sem erros

- [ ] **ID**: `SETUP-05`
  - **Files**: `package.json`, `package-lock.json`
  - **Dependencies**: `[]`
  - **Acceptance**:
    - [ ] As cinco dependências de teste e versões autorizadas na SPEC constam em `devDependencies`
    - [ ] Os scripts `test`, `test:watch` e `test:coverage` correspondem exatamente à SPEC
    - [ ] `package-lock.json` registra as dependências instaladas sem conflito de peer dependencies
    - [ ] `npm install` termina sem erros

- [ ] **ID**: `SETUP-06`
  - **Files**: `vitest.config.ts`, `src/test/setup.ts`
  - **Dependencies**: `SETUP-05`
  - **Acceptance**:
    - [ ] `vitest.config.ts` configura ambiente `jsdom` e globals
    - [ ] `vitest.config.ts` carrega `src/test/setup.ts`
    - [ ] O setup importa `@testing-library/jest-dom/vitest`
    - [ ] `npm test -- --passWithNoTests` e `npx tsc --noEmit` terminam sem erros

- [ ] **ID**: `SETUP-07`
  - **Files**: `src/lib/constants.ts`
  - **Dependencies**: `SETUP-03`
  - **Acceptance**:
    - [ ] `META_THRESHOLDS` contém os limites 100 e 80
    - [ ] `PERIOD_LABELS` mapeia as quatro janelas para labels PT-BR da SPEC
    - [ ] `PERIOD_MONTHS` mapeia as janelas para 1, 3, 6 e 12
    - [ ] `STATUS_CLASSES` contém background, border, text e icon para os três estados
    - [ ] `npx tsc --noEmit` termina sem erros

## Épico 2 — Dados locais

- [ ] **ID**: `DATA-01`
  - **Files**: `src/data/ubs.ts`
  - **Dependencies**: `SETUP-03`
  - **Acceptance**:
    - [ ] `ubsList` exporta exatamente 15 objetos tipados como `UBS[]`
    - [ ] IDs são únicos e cobrem os inteiros de 1 a 15
    - [ ] Cada código CNES é uma string única de seis dígitos
    - [ ] Cada UBS possui nome, equipe, endereço e entre 1.500 e 4.500 cadastrados

- [ ] **ID**: `DATA-02`
  - **Files**: `src/data/indicators.ts`
  - **Dependencies**: `SETUP-03`
  - **Acceptance**:
    - [ ] `indicatorsList` exporta exatamente quatro objetos tipados como `Indicator[]`
    - [ ] Os IDs são `cobertura-vacinal`, `pre-natal`, `hipertensao` e `diabetes`
    - [ ] As metas são respectivamente 95, 60, 50 e 50
    - [ ] Cada objeto possui descrição com pelo menos 50 caracteres, unidade e fonte

- [ ] **ID**: `DATA-03`
  - **Files**: `src/data/history.ts`
  - **Dependencies**: `DATA-01`, `DATA-02`
  - **Acceptance**:
    - [ ] `historyData` exporta exatamente 720 registros tipados como `HistoryRecord[]`
    - [ ] Cada combinação de UBS e indicador contém uma vez cada mês de `2025-07` a `2026-06`
    - [ ] Todos os valores estão entre zero e 130% da meta correspondente
    - [ ] O desvio padrão de cada série é no máximo 15% da média da própria série
    - [ ] Junho de 2026 supera julho de 2025 em pelo menos 42 das 60 séries

- [ ] **ID**: `DATA-04`
  - **Files**: `src/data/data-integrity.test.ts`
  - **Dependencies**: `SETUP-06`, `DATA-03`
  - **Acceptance**:
    - [ ] Testes verificam cardinalidade, IDs, referências e 12 meses contínuos
    - [ ] Testes verificam limites de valores e cadastrados definidos na SPEC
    - [ ] Testes calculam e verificam o limite de desvio padrão por série
    - [ ] Testes verificam a tendência positiva em pelo menos 70% das séries
    - [ ] `npm test -- src/data/data-integrity.test.ts` termina sem falhas

## Épico 3 — Regras de negócio

- [ ] **ID**: `BIZ-01`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `SETUP-06`, `SETUP-07`
  - **Acceptance**:
    - [ ] `getIndicatorStatus` implementa os limites vermelho, amarelo e verde da RB-01
    - [ ] Entradas não finitas ou meta menor ou igual a zero lançam erro
    - [ ] Testes cobrem valores abaixo, exatamente em e acima dos limites de 80% e 100%
    - [ ] O teste direcionado e `npx tsc --noEmit` terminam sem erros

- [ ] **ID**: `BIZ-02`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `BIZ-01`
  - **Acceptance**:
    - [ ] `filterByPeriod` ancora a janela no maior mês presente nos registros recebidos
    - [ ] As quatro janelas retornam respectivamente 1, 3, 6 e 12 meses calendário inclusivos
    - [ ] A função não usa `new Date()` e retorna meses em ordem crescente
    - [ ] Testes cobrem virada de ano e array vazio
    - [ ] O teste direcionado e `npx tsc --noEmit` terminam sem erros

- [ ] **ID**: `BIZ-03`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `BIZ-02`
  - **Acceptance**:
    - [ ] `aggregateByIndicator` calcula a média temporal de cada UBS antes da consolidação
    - [ ] A consolidação pondera somente UBS com registros por quantidade de cadastrados
    - [ ] O resultado é arredondado para uma casa decimal e ausência de registros retorna zero
    - [ ] Testes usam UBS com populações diferentes e verificam o resultado numérico exato
    - [ ] O teste direcionado e `npx tsc --noEmit` terminam sem erros

- [ ] **ID**: `BIZ-04`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `BIZ-03`
  - **Acceptance**:
    - [ ] `calculateUBSScore` aplica quatro parcelas com peso de 25% e limite 0–100
    - [ ] A pontuação final é arredondada para uma casa decimal
    - [ ] `calculateRanking` exclui UBS sem os quatro indicadores e retorna `RankingRow[]`
    - [ ] O ranking ordena por pontuação e desempata por nome `pt-BR` antes de atribuir posições
    - [ ] Testes cobrem teto, arredondamento, exclusão, ordem e empate

- [ ] **ID**: `BIZ-05`
  - **Files**: `src/lib/filters.ts`, `src/lib/filters.test.ts`
  - **Dependencies**: `BIZ-03`
  - **Acceptance**:
    - [ ] `getTrend` compara N meses recentes aos N imediatamente anteriores, com padrão N igual a 3
    - [ ] Variação maior que 5% retorna alta, menor que -5% retorna queda e demais casos retornam estável
    - [ ] Consolidação com `ubsId=null` é ponderada por cadastrados
    - [ ] Menos de `2N` meses válidos retorna estável
    - [ ] Testes cobrem alta, queda, estabilidade, consolidado e histórico insuficiente

- [ ] **ID**: `BIZ-06`
  - **Files**: `src/hooks/use-filters.ts`, `src/hooks/use-filters.test.tsx`
  - **Dependencies**: `SETUP-06`, `SETUP-03`
  - **Acceptance**:
    - [ ] `useFilters` inicia com `ubsId=null` e `period="ultimo-mes"`
    - [ ] `setUBS` e `setPeriod` alteram somente seus campos correspondentes
    - [ ] `resetFilters` restaura integralmente o estado inicial
    - [ ] Testes exercitam estado inicial, alterações e reset
    - [ ] O teste direcionado e `npx tsc --noEmit` terminam sem erros

## Épico 4 — Layout compartilhado

- [ ] **ID**: `LAYOUT-01`
  - **Files**: `src/app/layout.tsx`
  - **Dependencies**: `SETUP-01`
  - **Acceptance**:
    - [ ] Metadata padrão usa título e descrição contextuais do Painel SUS
    - [ ] O elemento `html` usa `lang="pt-BR"`
    - [ ] O body usa Geist Sans, Geist Mono e layout flexível com altura mínima de tela
    - [ ] Existe skip link “Pular para conteúdo principal” apontando para `#main-content`
    - [ ] `npx tsc --noEmit` termina sem erros

- [ ] **ID**: `LAYOUT-02`
  - **Files**: `src/components/layout/header.tsx`
  - **Dependencies**: `LAYOUT-01`
  - **Acceptance**:
    - [ ] O header exibe “Painel SUS” e links para `/`, `/indicadores` e `/sobre`
    - [ ] A navegação possui `aria-label="Navegação principal"`
    - [ ] `usePathname` define `aria-current="page"` no link ativo
    - [ ] O link ativo combina underline, peso e cor sem depender somente de cor
    - [ ] Todos os links possuem alvo mínimo de 44×44 px

- [ ] **ID**: `LAYOUT-03`
  - **Files**: `src/components/layout/footer.tsx`
  - **Dependencies**: `LAYOUT-01`
  - **Acceptance**:
    - [ ] O footer informa que os dados são simulados para demonstração
    - [ ] O footer lista CNES, e-SUS AB e DATASUS como fontes
    - [ ] O footer mostra “Protótipo v1.0 — Saúde Itapira” e nenhum texto promocional pessoal
    - [ ] O elemento usa `role="contentinfo"` e os estilos de rodapé definidos na SPEC

- [ ] **ID**: `LAYOUT-04`
  - **Files**: `src/app/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`
  - **Dependencies**: `LAYOUT-02`, `LAYOUT-03`
  - **Acceptance**:
    - [ ] `Header` aparece antes do conteúdo em todas as rotas
    - [ ] O conteúdo usa `<main id="main-content">` e cresce para preencher a página
    - [ ] `Footer` aparece depois do conteúdo em todas as rotas
    - [ ] `npm run build` termina sem erros

## Épico 5 — Filtros e dashboard

- [ ] **ID**: `FILTER-01`
  - **Files**: `src/components/filters/ubs-filter.tsx`
  - **Dependencies**: `DATA-01`
  - **Acceptance**:
    - [ ] O Select controlado recebe exatamente as props `UBSFilterProps` da SPEC
    - [ ] A primeira opção representa `null` e exibe “Todas as UBS”
    - [ ] As 15 opções restantes exibem os nomes de `ubs`
    - [ ] Existe label visível associada “Unidade de Saúde”
    - [ ] Alterar a seleção chama `onChange` com `number` ou `null`

- [ ] **ID**: `FILTER-02`
  - **Files**: `src/components/filters/period-filter.tsx`
  - **Dependencies**: `SETUP-07`
  - **Acceptance**:
    - [ ] O Select controlado recebe exatamente as props `PeriodFilterProps` da SPEC
    - [ ] As quatro opções e labels vêm de `PERIOD_LABELS`
    - [ ] Existe label visível associada “Período”
    - [ ] Alterar a seleção chama `onChange` com um `PeriodFilter`

- [ ] **ID**: `DASH-01`
  - **Files**: `src/components/dashboard/indicator-card.tsx`
  - **Dependencies**: `BIZ-01`, `SETUP-07`
  - **Acceptance**:
    - [ ] O card recebe `IndicatorCardProps` e exibe nome, valor, unidade, meta e tendência
    - [ ] Fundo suave e borda esquerda usam o estado fornecido e `STATUS_CLASSES`
    - [ ] Ícone e texto identificam verde, amarelo ou vermelho sem depender somente de cor
    - [ ] Estado vermelho exibe “Abaixo da meta”
    - [ ] O artigo possui nome acessível descritivo e números tabulares

- [ ] **ID**: `DASH-02`
  - **Files**: `src/components/dashboard/indicator-card.test.tsx`
  - **Dependencies**: `SETUP-06`, `DASH-01`
  - **Acceptance**:
    - [ ] Teste encontra nome, valor, unidade, meta e tendência
    - [ ] Teste encontra o cartão por `role="article"` e nome acessível
    - [ ] Casos verde, amarelo e vermelho verificam suas identificações textuais e ícones
    - [ ] Caso vermelho verifica “Abaixo da meta”
    - [ ] `npm test -- src/components/dashboard/indicator-card.test.tsx` termina sem falhas

- [ ] **ID**: `DASH-03`
  - **Files**: `src/components/dashboard/indicator-grid.tsx`
  - **Dependencies**: `DASH-01`
  - **Acceptance**:
    - [ ] O componente recebe `IndicatorGridProps` e renderiza um card por item
    - [ ] Quatro itens resultam em quatro `IndicatorCard`
    - [ ] O grid usa uma coluna no mobile, duas a partir de 640px e quatro a partir de 1024px
    - [ ] O espaçamento entre cartões permanece consistente em todos os breakpoints

- [ ] **ID**: `DASH-04`
  - **Files**: `src/components/dashboard/trend-chart.tsx`
  - **Dependencies**: `SETUP-03`
  - **Acceptance**:
    - [ ] O Client Component usa Recharts `LineChart` com uma `Line` sobre todos os pontos recebidos
    - [ ] `ReferenceLine` representa a meta e os eixos identificam mês e percentual
    - [ ] Tooltip informa mês, valor e meta do ponto ativo
    - [ ] Contêiner responsivo preserva a largura e altura mínima definidas na SPEC
    - [ ] Região e resumo textual tornam os dados essenciais acessíveis

- [ ] **ID**: `DASH-05`
  - **Files**: `src/components/dashboard/ranking-table.tsx`
  - **Dependencies**: `BIZ-04`, `SETUP-07`
  - **Acceptance**:
    - [ ] A tabela possui `caption`, `thead`, `tbody` e headers com `scope="col"`
    - [ ] As colunas são posição, UBS, equipe, pontuação e estado
    - [ ] As linhas preservam a ordem recebida e exibem pontuação com uma casa decimal
    - [ ] Cada nome de UBS é um link para `/ubs/[id]`, sem callback de navegação
    - [ ] Estado inclui badge e texto, e a tabela tem contêiner com overflow horizontal

- [ ] **ID**: `DASH-06`
  - **Files**: `src/components/dashboard/ranking-table.test.tsx`
  - **Dependencies**: `SETUP-06`, `DASH-05`
  - **Acceptance**:
    - [ ] Teste encontra a tabela por nome acessível e todos os cinco headers
    - [ ] Teste confirma a ordem das linhas fornecidas e uma casa decimal nas pontuações
    - [ ] Teste confirma href `/ubs/[id]` nos nomes das unidades
    - [ ] Teste confirma a identificação textual dos três estados
    - [ ] O teste direcionado termina sem falhas

- [ ] **ID**: `DASH-07`
  - **Files**: `src/components/dashboard/empty-state.tsx`
  - **Dependencies**: `SETUP-01`
  - **Acceptance**:
    - [ ] O estado vazio informa que não há registros para os filtros atuais
    - [ ] Existe botão “Limpar filtros” com alvo mínimo de 44×44 px
    - [ ] Ativar o botão chama exatamente uma vez a função `onClear`
    - [ ] Não existe ação ou texto “Tentar novamente”

- [ ] **ID**: `DASH-08`
  - **Files**: `src/components/dashboard/dashboard-client.tsx`
  - **Dependencies**: `BIZ-04`, `BIZ-05`, `BIZ-06`, `FILTER-01`, `FILTER-02`, `DASH-03`, `DASH-04`, `DASH-05`, `DASH-07`
  - **Acceptance**:
    - [ ] O componente recebe `DashboardClientProps` e aplica primeiro UBS e janela relativa
    - [ ] Cartões, gráfico e ranking derivam da mesma combinação ativa de filtros
    - [ ] A ausência de registros renderiza `EmptyState` e o reset restaura os filtros padrão
    - [ ] A composição visual segue filtros, cartões, gráfico de linha e ranking nessa ordem
    - [ ] `npx tsc --noEmit` termina sem erros

- [ ] **ID**: `DASH-09`
  - **Files**: `src/components/dashboard/dashboard-client.test.tsx`
  - **Dependencies**: `SETUP-06`, `DASH-08`
  - **Acceptance**:
    - [ ] Teste confirma os filtros padrão “Todas as UBS” e “Último mês”
    - [ ] Teste confirma atualização dos dados ao escolher UBS e período
    - [ ] Teste força combinação sem registros e encontra o estado vazio
    - [ ] Teste aciona “Limpar filtros” e confirma restauração dos padrões
    - [ ] O teste direcionado termina sem falhas

- [ ] **ID**: `PAGE-01`
  - **Files**: `src/app/page.tsx`
  - **Dependencies**: `DATA-03`, `DASH-08`, `LAYOUT-04`
  - **Acceptance**:
    - [ ] A página permanece Server Component e importa os três conjuntos de dados locais
    - [ ] A página renderiza `DashboardClient` com props serializáveis completas
    - [ ] Título e introdução identificam o dashboard e o período baseado nos dados
    - [ ] Não existe fetch HTTP nem conteúdo padrão do Create Next App
    - [ ] `npm run build` gera a rota `/` sem erros

## Épico 6 — Detalhe da UBS

- [ ] **ID**: `UBS-01`
  - **Files**: `src/components/ubs/ubs-info-card.tsx`
  - **Dependencies**: `DATA-01`
  - **Acceptance**:
    - [ ] O card recebe `UBSInfoCardProps`
    - [ ] Exibe nome, código CNES, equipe, cadastrados e endereço
    - [ ] Rótulos e valores são compreensíveis sem depender da posição visual
    - [ ] O número de cadastrados usa formatação `pt-BR`

- [ ] **ID**: `UBS-02`
  - **Files**: `src/components/ubs/radar-chart.tsx`
  - **Dependencies**: `SETUP-03`
  - **Acceptance**:
    - [ ] O Client Component usa Recharts `RadarChart` com quatro eixos
    - [ ] Dois radares distinguem valor e meta e possuem legenda visível
    - [ ] O componente recebe `RadarChartProps` sem importar dados globais
    - [ ] Região e resumo textual informam nome da UBS e os quatro valores

- [ ] **ID**: `UBS-03`
  - **Files**: `src/components/ubs/history-table.tsx`
  - **Dependencies**: `BIZ-01`, `DATA-02`
  - **Acceptance**:
    - [ ] A tabela recebe `HistoryTableProps` e organiza 12 meses em ordem crescente
    - [ ] Possui cinco colunas: mês e os quatro indicadores
    - [ ] Usa `caption` e headers com `scope="col"`
    - [ ] Cada célula informa valor e estado por texto, ícone ou nome acessível
    - [ ] Contêiner permite overflow horizontal sem cortar colunas

- [ ] **ID**: `PAGE-02`
  - **Files**: `src/app/ubs/[id]/page.tsx`
  - **Dependencies**: `DATA-03`, `UBS-01`, `LAYOUT-04`
  - **Acceptance**:
    - [ ] A rota Server Component converte `params.id` em inteiro positivo e busca `ubsList`
    - [ ] ID inexistente exibe “UBS não encontrada” e link para `/`
    - [ ] UBS existente exibe breadcrumb e `UBSInfoCard`
    - [ ] `generateMetadata` retorna título com o nome ou “UBS não encontrada”
    - [ ] `npm run build` gera a rota dinâmica sem erros

- [ ] **ID**: `PAGE-03`
  - **Files**: `src/app/ubs/[id]/page.tsx`
  - **Dependencies**: `PAGE-02`, `BIZ-03`, `UBS-02`, `UBS-03`
  - **Acceptance**:
    - [ ] A página deriva os quatro pontos radar do último mês disponível da UBS
    - [ ] O radar aparece abaixo do card informativo com valor e meta
    - [ ] A tabela recebe exatamente os 12 meses da UBS
    - [ ] A página não usa estado Client nem fetch HTTP
    - [ ] `/ubs/1` e `/ubs/999` compilam sem erro de tipo

## Épico 7 — Indicadores e página Sobre

- [ ] **ID**: `IND-01`
  - **Files**: `src/components/indicadores/indicator-detail.tsx`
  - **Dependencies**: `BIZ-03`, `DASH-04`, `DASH-05`
  - **Acceptance**:
    - [ ] O detalhe recebe `IndicatorDetailProps` e exibe descrição, meta e fonte
    - [ ] O gráfico de linha apresenta os 12 meses consolidados e referência da meta
    - [ ] A tabela compara as 15 UBS para o indicador no último mês disponível
    - [ ] Valor, meta e estado são identificados sem depender somente de cor
    - [ ] O componente não cria navegação para `/indicadores/[id]`

- [ ] **ID**: `IND-02`
  - **Files**: `src/components/indicadores/indicator-list.tsx`
  - **Dependencies**: `IND-01`
  - **Acceptance**:
    - [ ] A lista recebe `IndicatorListProps` e renderiza os quatro indicadores
    - [ ] Cada botão possui `aria-expanded`, `aria-controls` e alvo mínimo de 44×44 px
    - [ ] Inicialmente nenhum detalhe está aberto e no máximo um permanece aberto
    - [ ] Expandir e recolher ocorre localmente sem alterar a URL
    - [ ] O painel expandido renderiza `IndicatorDetail` com dados correspondentes

- [ ] **ID**: `IND-03`
  - **Files**: `src/components/indicadores/indicator-list.test.tsx`
  - **Dependencies**: `SETUP-06`, `IND-02`
  - **Acceptance**:
    - [ ] Teste encontra os quatro botões por nome acessível
    - [ ] Teste confirma estado inicial recolhido e atributos ARIA
    - [ ] Teste expande um indicador e encontra histórico, meta e comparação
    - [ ] Teste abre outro indicador e confirma que o anterior foi recolhido
    - [ ] O teste direcionado termina sem falhas

- [ ] **ID**: `PAGE-04`
  - **Files**: `src/app/indicadores/page.tsx`
  - **Dependencies**: `DATA-03`, `IND-02`, `LAYOUT-04`
  - **Acceptance**:
    - [ ] A página Server Component exporta metadata “Indicadores - Painel SUS”
    - [ ] Título e introdução explicam que os detalhes são expansíveis
    - [ ] `IndicatorList` recebe indicadores, histórico e UBS por props
    - [ ] Nenhuma rota dinâmica ou fetch HTTP é criado
    - [ ] `npm run build` gera `/indicadores` sem erros

- [ ] **ID**: `PAGE-05`
  - **Files**: `src/app/sobre/page.tsx`
  - **Dependencies**: `LAYOUT-04`
  - **Acceptance**:
    - [ ] A página exporta metadata “Sobre - Painel SUS”
    - [ ] Explica o Previne Brasil e o objetivo do protótipo em linguagem clara
    - [ ] Lista CNES, e-SUS AB e DATASUS como fontes simuladas
    - [ ] Destaca que os dados são simulados para demonstração
    - [ ] `npm run build` gera `/sobre` sem erros

## Épico 8 — Acessibilidade, segurança e gates do Coder

- [ ] **ID**: `A11Y-01`
  - **Files**: `src/app/globals.css`
  - **Dependencies**: `LAYOUT-04`
  - **Acceptance**:
    - [ ] `:focus-visible` possui outline de pelo menos 2px com contraste perceptível
    - [ ] O skip link fica oculto fora do foco e visível quando focado
    - [ ] Preferência `prefers-reduced-motion` reduz transições não essenciais
    - [ ] Estilos globais não removem foco nem reduzem contraste do tema claro

- [ ] **ID**: `A11Y-02`
  - **Files**: `src/components/filters/ubs-filter.tsx`, `src/components/filters/period-filter.tsx`, `src/components/dashboard/empty-state.tsx`
  - **Dependencies**: `A11Y-01`, `FILTER-01`, `FILTER-02`, `DASH-07`
  - **Acceptance**:
    - [ ] Labels visíveis estão programaticamente associados aos dois Selects
    - [ ] Selects e botão de limpar possuem nome acessível inequívoco
    - [ ] Todos os controles possuem alvo mínimo de 44×44 px
    - [ ] Navegação por Tab alcança os três controles em ordem lógica

- [ ] **ID**: `A11Y-03`
  - **Files**: `src/components/dashboard/indicator-card.tsx`, `src/components/dashboard/ranking-table.tsx`, `src/components/ubs/history-table.tsx`
  - **Dependencies**: `A11Y-01`, `DASH-01`, `DASH-05`, `UBS-03`
  - **Acceptance**:
    - [ ] Os três estados possuem identificação textual ou nome acessível além da cor
    - [ ] Ícones decorativos usam `aria-hidden="true"`
    - [ ] Links e elementos focáveis mostram foco visível e têm alvo mínimo de 44×44 px
    - [ ] Tabelas mantêm caption e associação correta de headers

- [ ] **ID**: `SEC-01`
  - **Files**: `next.config.ts`
  - **Dependencies**: `PAGE-01`, `PAGE-03`, `PAGE-04`, `PAGE-05`
  - **Acceptance**:
    - [ ] `headers()` aplica Content-Security-Policy a todas as rotas
    - [ ] Também aplica `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`
    - [ ] A CSP permite somente origens necessárias ao aplicativo local e ao Next.js
    - [ ] `npm run build` termina sem erros após a configuração

- [ ] **ID**: `VERIFY-01`
  - **Files**: `package.json`, `tsconfig.json`, `vitest.config.ts`
  - **Dependencies**: `DATA-04`, `DASH-02`, `DASH-06`, `DASH-09`, `IND-03`, `A11Y-02`, `A11Y-03`, `SEC-01`
  - **Acceptance**:
    - [ ] `npx tsc --noEmit` termina com código zero
    - [ ] `npm run lint` termina com código zero e sem warnings
    - [ ] `npm test` termina com todos os testes aprovados
    - [ ] `npm run test:coverage` gera relatório V8 sem erro
    - [ ] `npm run build` termina com código zero

- [ ] **ID**: `VERIFY-02`
  - **Files**: `src/app/page.tsx`, `src/app/ubs/[id]/page.tsx`, `src/app/indicadores/page.tsx`
  - **Dependencies**: `VERIFY-01`
  - **Acceptance**:
    - [ ] `/` exibe quatro cartões, gráfico de linha e ranking das 15 UBS
    - [ ] Alterar UBS e janela atualiza cartões, gráfico e ranking; limpar restaura padrões
    - [ ] `/ubs/1` exibe perfil, radar e 12 meses, enquanto `/ubs/999` exibe retorno seguro
    - [ ] `/indicadores` expande detalhes sem mudar a rota
    - [ ] `/sobre` exibe explicação, fontes e disclaimer

- [ ] **ID**: `VERIFY-03`
  - **Files**: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/dashboard/dashboard-client.tsx`
  - **Dependencies**: `VERIFY-02`
  - **Acceptance**:
    - [ ] Em 375×667 os cartões ficam em uma coluna e não há corte horizontal da página
    - [ ] Em 768×1024 os cartões usam no máximo duas colunas e gráficos ocupam a largura disponível
    - [ ] Em 1280×800 e 1920×1080 os quatro cartões ficam na mesma linha com largura legível
    - [ ] Tab percorre controles e links das quatro rotas com foco visível e sem foco preso
    - [ ] Conteúdo principal aparece em menos de 3s sob simulação 3G

## Épico 9 — Gate independente do Reviewer

- [ ] **ID**: `REVIEW-01`
  - **Files**: `docs/audits/review-01-static-audit.json`, `docs/failures/review-01-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `VERIFY-03`
  - **Acceptance**:
    - [ ] Reviewer registra comandos e códigos de saída de typecheck, lint, testes, cobertura e build
    - [ ] Todos os cinco comandos passam para concluir a tarefa
    - [ ] Falha gera ou atualiza `docs/failures/review-01-failure.json`
    - [ ] Sucesso fica registrado em `docs/audits/review-01-static-audit.json`

- [ ] **ID**: `REVIEW-02`
  - **Files**: `docs/audits/review-02-visual-audit.json`, `docs/failures/review-02-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `REVIEW-01`
  - **Acceptance**:
    - [ ] Reviewer compara `/`, `/ubs/1`, `/indicadores` e `/sobre` com o `.pen` e o Design System
    - [ ] Auditoria cobre tipografia, cores, espaçamento, estados e conteúdo completo
    - [ ] Auditoria cobre 375px, 768px, 1280px e 1920px
    - [ ] Qualquer desvio mantém a tarefa aberta e gera o arquivo de falha

- [ ] **ID**: `REVIEW-03`
  - **Files**: `docs/audits/review-03-web-audit.json`, `docs/failures/review-03-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `REVIEW-02`
  - **Acceptance**:
    - [ ] Reviewer confirma `http://localhost:3000` antes das auditorias
    - [ ] Lighthouse desktop registra Performance maior que 95 e Accessibility maior que 98
    - [ ] Axe não registra violação bloqueante ou crítica e Security Headers supera 80 com CSP segura
    - [ ] Resultados completos são salvos no arquivo de auditoria
    - [ ] Qualquer gate não atendido mantém a tarefa aberta e gera o arquivo de falha

- [ ] **ID**: `REVIEW-04`
  - **Files**: `docs/audits/review-04-release-audit.json`, `docs/failures/review-04-failure.json`, `docs/TASKS.md`
  - **Dependencies**: `REVIEW-03`
  - **Acceptance**:
    - [ ] Auditoria responsiva cobre 375×667, 768×1024 e 1920×1080
    - [ ] Relatório consolida auditorias estática, visual, Lighthouse, axe e segurança
    - [ ] Budgets finais são Accessibility ≥95, Performance ≥90 e Security ≥85
    - [ ] Release só registra `passed: true` quando todos os budgets e gates passam
    - [ ] Falha mantém a tarefa aberta e gera o arquivo de falha
