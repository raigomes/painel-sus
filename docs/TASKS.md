# Tasks — Painel SUS

> Ordenadas por dependência. Cada tarefa é atômica (< 30 min).  
> **Schema:** ID, Files, Acceptance Criteria, Dependencies

> **OWNER DECISION (2026-08-06):** Layout `.pen` revisado por @designer e @reviewer.
> - ✅ 3 bloqueios anteriores (TrendChart, RankingTable, semáforo) RESOLVIDOS
> - ✅ TrendChart → **BarChart** (decisão de produto: barras são mais legíveis para dados discretos mensais)
> - ✅ IndicatorCard → **fundo tinted** (decisão de produto: cores semáforo no fundo do card para reconhecimento visual imediato)
> - ✅ Font → **Geist Sans** no código (o .pen usa Inter como placeholder do wireframe)
> - ℹ️ Issues moderados: badge "estável" pg3, dados amostrais, footer texto pessoal — todos anotados nas acceptance criteria das tasks
>
> **OWNER DECISION (2026-08-08):** Blocker `dash-01-test-runner` resolvido pela aprovação da stack Vitest + Testing Library + jsdom + coverage V8.
> - ✅ Dependências de teste isoladas em `SETUP-05` e configuração do runner em `SETUP-06`
> - ✅ Cobertura comportamental do `IndicatorCard` isolada em `DASH-01A`
> - ✅ Dependências e comandos definidos no `docs/SPEC.md` antes da criação das tarefas
---

## Épico 1 — Setup & Infraestrutura

- [x] **ID**: `SETUP-01`
      **Files**: `package.json`, `src/app/globals.css`
      **Acceptance**:
  - [x] `npx shadcn@latest init` executado com sucesso (components.json criado)
  - [x] `npx shadcn@latest add card badge select separator skeleton tooltip` instala 6 componentes em `src/components/ui/`
  - [x] `npm install recharts` adicionado ao package.json
  - [x] `npm run build` passa sem erros após instalações
        **Dependencies**: `[]`

- [x] **ID**: `SETUP-02`
      **Files**: `src/lib/types.ts`
      **Acceptance**:
  - [x] Interfaces `UBS`, `Indicator`, `HistoryRecord`, `IndicatorStatus`, `PeriodFilter`, `Filters`, `IndicatorDisplay`, `RankingRow`, `RadarDataPoint` estão definidas
  - [x] `IndicatorStatus` é union type `"verde" | "amarelo" | "vermelho"`
  - [x] `PeriodFilter` é union type com 4 valores exatos
  - [x] `npx tsc --noEmit` passa sem erros
        **Dependencies**: `[]`

- [ ] **ID**: `SETUP-03`
      **Files**: `src/lib/constants.ts`
      **Acceptance**:
  - [ ] `META_THRESHOLDS` definido com valores 100 e 80
  - [ ] `PERIOD_LABELS` mapeia os 4 PeriodFilter para labels em PT-BR
  - [ ] `PERIOD_MONTHS` mapeia os 4 PeriodFilter para quantidade de meses (1, 3, 6, 12)
  - [ ] `COLORS` mapeia verde/amarelo/vermelho para classes Tailwind (bg, border, text, icon)
  - [ ] `npx tsc --noEmit` passa sem erros
        **Dependencies**: `SETUP-02`

- [ ] **ID**: `SETUP-04`
      **Files**: `src/lib/utils.ts`
      **Acceptance**:
  - [ ] Função `cn()` exportada (clsx + twMerge ou equivalente do Shadcn)
  - [ ] `npx tsc --noEmit` passa sem erros
        **Dependencies**: `SETUP-01`

- [ ] **ID**: `SETUP-05`
  - **Files**: `package.json`, `package-lock.json`
  - **Dependencies**: `[]`
  - **Acceptance**:
    - [ ] `vitest@^3`, `@testing-library/react@^16`, `@testing-library/jest-dom@^6`, `jsdom@^26` e `@vitest/coverage-v8@^3` constam em `devDependencies`
    - [ ] Scripts `test`, `test:watch` e `test:coverage` correspondem aos comandos definidos no `docs/SPEC.md`
    - [ ] `package-lock.json` registra as versões instaladas sem conflito de peer dependencies
    - [ ] `npm install` termina sem erros

- [ ] **ID**: `SETUP-06`
  - **Files**: `vitest.config.ts`, `src/test/setup.ts`
  - **Dependencies**: `SETUP-05`
  - **Acceptance**:
    - [ ] `vitest.config.ts` usa ambiente `jsdom`
    - [ ] `vitest.config.ts` habilita globals e carrega `src/test/setup.ts`
    - [ ] `src/test/setup.ts` importa `@testing-library/jest-dom/vitest`
    - [ ] `npm test -- --passWithNoTests` e `npx tsc --noEmit` terminam sem erros

---

## Épico 2 — Camada de Dados (Mock)

- [ ] **ID**: `DATA-01`
      **Files**: `src/data/ubs.ts`
      **Acceptance**:
  - [ ] Array `ubsList` exportado com 15 UBS
  - [ ] Cada UBS possui: id (1-15), nome, codigo (6 dígitos string), equipe, cadastrados (1500-4500), endereco
  - [ ] Nomes são realistas (bairros paulistas: "Jardim Paulista", "Vila Nova", "Parque Industrial" etc.)
  - [ ] Cadastrados variam realisticamente (nenhuma = 0 ou > 5000)
        **Dependencies**: `SETUP-02`

- [ ] **ID**: `DATA-02`
      **Files**: `src/data/indicators.ts`
      **Acceptance**:
  - [ ] Array `indicatorsList` exportado com 4 indicadores
  - [ ] IDs: "cobertura-vacinal", "pre-natal", "hipertensao", "diabetes"
  - [ ] Cada indicador tem: id, nome, descricao (≥ 50 chars), meta (number), unidade, fonte
  - [ ] Metas: 95, 60, 50, 50 (conforme PRD)
        **Dependencies**: `SETUP-02`

- [ ] **ID**: `DATA-03`
      **Files**: `src/data/history.ts`
      **Acceptance**:
  - [ ] Array `historyData` exportado com 720 registros (15 UBS × 4 indicadores × 12 meses)
  - [ ] Meses cobrem jul/2025 a jun/2026 (formato "YYYY-MM")
  - [ ] Valores variam realisticamente (desvio padrão ≤ 15% da meta do indicador)
  - [ ] Tendência geral levemente positiva (jun/2026 > jul/2025 em ~70% dos casos)
  - [ ] Nenhum valor é negativo ou > 130% da meta
        **Dependencies**: `DATA-01`, `DATA-02`

---

## Épico 3 — Funções de Negócio

- [ ] **ID**: `BIZ-01`
      **Files**: `src/lib/filters.ts`
      **Acceptance**:
  - [ ] `getIndicatorStatus(valor, meta)` retorna "verde"/"amarelo"/"vermelho"
  - [ ] Verde: valor >= meta; Amarelo: valor >= meta * 0.8; Vermelho: caso contrário
  - [ ] Testes manuais: 95/95 → verde; 80/100 → amarelo; 70/100 → vermelho
        **Dependencies**: `SETUP-03`

- [ ] **ID**: `BIZ-02`
      **Files**: `src/lib/filters.ts`
      **Acceptance**:
  - [ ] `filterByPeriod(records, period, referenceDate)` retorna subset de registros
  - [ ] "ultimo-mes" retorna 1 mês; "ultimo-trimestre" retorna 3 meses; etc.
  - [ ] Trata corretamente wrap-around de ano (jan/2026 + 3 meses = out/2025 a jan/2026)
        **Dependencies**: `SETUP-02`

- [ ] **ID**: `BIZ-03`
      **Files**: `src/lib/filters.ts`
      **Acceptance**:
  - [ ] `aggregateByIndicator(records, indicatorId, ubsList)` retorna percentual único
  - [ ] Usa média ponderada: Σ(valor × cadastrados) / Σ(cadastrados)
  - [ ] Retorna 0 se não houver registros
        **Dependencies**: `BIZ-02`

- [ ] **ID**: `BIZ-04`
      **Files**: `src/lib/filters.ts`
      **Acceptance**:
  - [ ] `calculateRanking(ubs, history, indicators, period)` retorna RankingRow
  - [ ] Pontuação = média dos 4 indicadores normalizada 0-100
  - [ ] Status baseado na pontuação geral (não no melhor indicador)
        **Dependencies**: `BIZ-01`, `BIZ-02`, `BIZ-03`

- [ ] **ID**: `BIZ-05`
      **Files**: `src/lib/filters.ts`
      **Acceptance**:
  - [ ] `getTrend(records, indicatorId, ubsId, months)` retorna "alta"/"estavel"/"queda"
  - [ ] Compara média dos últimos N meses com N meses anteriores
  - [ ] > +5% = alta; < -5% = queda; senão = estável
        **Dependencies**: `BIZ-02`

- [ ] **ID**: `BIZ-06`
      **Files**: `src/hooks/use-filters.ts`
      **Acceptance**:
  - [ ] Hook `useFilters()` retorna `{ filters, setUBS, setPeriod, resetFilters }`
  - [ ] Estado inicial: ubsId=null, period="ultimo-mes"
  - [ ] `resetFilters` volta ao estado inicial
  - [ ] `npx tsc --noEmit` passa sem erros
        **Dependencies**: `SETUP-02`

---

## Épico 4 — Componentes de Layout

- [ ] **ID**: `LAYOUT-01`
      **Files**: `src/app/layout.tsx`
      **Acceptance**:
  - [ ] Metadata atualizada: title "Painel SUS - Dashboard de Indicadores", description contextual
  - [ ] `<html lang="pt-BR">` (não "en")
  - [ ] Body com `className="min-h-screen flex flex-col"`
  - [ ] Skip link "Pular para conteúdo principal" visível apenas com focus
        **Dependencies**: `SETUP-01`

- [ ] **ID**: `LAYOUT-02`
      **Files**: `src/components/layout/header.tsx`
      **Acceptance**:
  - [ ] Logo/nome "Painel SUS" à esquerda com ícone (SVG inline ou emoji 🏥)
  - [ ] Links de navegação: Dashboard (/), Indicadores (/indicadores), Sobre (/sobre)
  - [ ] Link ativo tem `aria-current="page"` e estilo diferenciado
  - [ ] Usa `<nav aria-label="Navegação principal">`
  - [ ] Responsivo: sempre visível (sem hamburger em v1.0)
        **Dependencies**: `LAYOUT-01`

- [ ] **ID**: `LAYOUT-03`
      **Files**: `src/components/layout/footer.tsx`
      **Acceptance**:
  - [ ] Disclaimer: "Dados simulados para fins de demonstração."
  - [ ] Fonte: "Fontes: CNES, e-SUS AB, DATASUS."
  - [ ] Versão: "Protótipo v1.0 — Saúde Itapira"
  - [ ] Background: `bg-zinc-50`, border-top: `border-zinc-200`, padding: `py-6 px-6`
  - [ ] Texto: `text-sm text-zinc-500 text-center`
  - [ ] **Sem** texto promocional pessoal (raigomes.dev ou similar)
  - [ ] Usa `<footer role="contentinfo">`
        **Dependencies**: `LAYOUT-01`

- [ ] **ID**: `LAYOUT-04`
      **Files**: `src/app/layout.tsx`
      **Acceptance**:
  - [ ] Layout inclui `<Header />` antes do conteúdo
  - [ ] Layout inclui `<Footer />` após o conteúdo
  - [ ] Main content com `id="main-content"` e `role="main"`
  - [ ] `npm run build` passa sem erros
        **Dependencies**: `LAYOUT-02`, `LAYOUT-03`

---

## Épico 5 — Filtros

- [ ] **ID**: `FILTER-01`
      **Files**: `src/components/filters/ubs-filter.tsx`
      **Acceptance**:
  - [ ] Usa componente `Select` do Shadcn/UI
  - [ ] Primeira opção: "Todas as UBS" (value="all")
  - [ ] Demais opções: 15 UBS com nome como label
  - [ ] Label visual: "Unidade de Saúde"
  - [ ] `aria-label="Filtrar por Unidade de Saúde"` presente
        **Dependencies**: `SETUP-01`, `DATA-01`

- [ ] **ID**: `FILTER-02`
      **Files**: `src/components/filters/period-filter.tsx`
      **Acceptance**:
  - [ ] Usa componente `Select` do Shadcn/UI
  - [ ] 4 opções: Último mês, Último trimestre, Último semestre, Último ano
  - [ ] Valor padrão: "Último mês"
  - [ ] Label visual: "Período"
  - [ ] `aria-label="Filtrar por período"` presente
        **Dependencies**: `SETUP-01`

---

## Épico 6 — Componentes do Dashboard

- [ ] **ID**: `DASH-01`
      **Files**: `src/components/dashboard/indicator-card.tsx`
      **Acceptance**:
  - [ ] Recebe props `IndicatorDisplay` (definido em types.ts)
  - [ ] Renderiza card com **fundo tinted** (verde/amarelo/vermelho) + borda esquerda 4px via COLORS
  - [ ] Exibe: nome do indicador, valor atual com unidade (Geist Mono, tabular-nums), meta
  - [ ] Badge com tendência (↑ alta, → estável, ↓ queda) — cores consistentes: alta=verde, estável=zinc, queda=vermelho
  - [ ] Ícone semáforo: check (verde), alerta (amarelo), erro (vermelho)
  - [ ] `role="article"` e `aria-label` descritivo
  - [ ] Hover: elevação `shadow-sm → shadow-md` com `transition-shadow duration-200`
        **Dependencies**: `SETUP-01`, `SETUP-03`, `BIZ-01`

- [ ] **ID**: `DASH-01A`
  - **Files**: `src/components/dashboard/indicator-card.test.tsx`
  - **Dependencies**: `SETUP-06`, `DASH-01`
  - **Acceptance**:
    - [ ] Teste happy path encontra nome, valor atual, unidade, meta e tendência do indicador
    - [ ] Teste acessível encontra o card por `role="article"` e nome acessível descritivo
    - [ ] Casos verde, amarelo e vermelho verificam os respectivos ícones e identificações visuais
    - [ ] Caso vermelho verifica a mensagem "Abaixo da meta"
    - [ ] `npm test -- src/components/dashboard/indicator-card.test.tsx` termina sem falhas

- [ ] **ID**: `DASH-02`
      **Files**: `src/components/dashboard/indicator-grid.tsx`
      **Acceptance**:
  - [ ] Renderiza 4 `IndicatorCard` em grid responsivo
  - [ ] Grid: 1 coluna (mobile), 2 colunas (sm/md), 4 colunas (lg+)
  - [ ] Cada card recebe dados do seu indicador (via props ou data)
  - [ ] Espaçamento consistente entre cards (gap-4 ou gap-6)
        **Dependencies**: `DASH-01`

- [ ] **ID**: `DASH-03`
      **Files**: `src/components/dashboard/trend-chart.tsx`
      **Acceptance**:
  - [ ] Usa Recharts `BarChart` com 12 `<Bar>` (meses) + `<ReferenceLine>` de meta (tracejada zinc-400)
  - [ ] Barras: fill `#004B87` (primary), radius `[4, 4, 0, 0]` (topos arredondados)
  - [ ] Tooltip interativo: exibe mês, valor, meta (CustomTooltip com card branco)
  - [ ] Eixo Y: 0-120%, `tickFormatter={v => v + '%'}`
  - [ ] Eixo X: labels de mês em PT-BR (jul/25, ago/25...)
  - [ ] `role="img"` e `aria-label` com resumo textual do gráfico
  - [ ] ResponsiveContainer: alturas conforme DESIGN_SYSTEM §4.3
        **Dependencies**: `SETUP-01`

- [ ] **ID**: `DASH-04`
      **Files**: `src/components/dashboard/ranking-table.tsx`
      **Acceptance**:
  - [ ] Tabela HTML semântica: `<table>`, `<caption>`, `<thead>`, `<tbody>`
  - [ ] Colunas: # (posição), UBS, Equipe, Pontuação, Status
  - [ ] Header row: `bg-zinc-100` `font-semibold` `text-zinc-700`
  - [ ] Body rows: alternating `bg-white` / `bg-zinc-50`, `h-12`, `border-b border-zinc-100`
  - [ ] Cada linha é clicável (navega para /ubs/[id])
  - [ ] UBS ordenadas por pontuação decrescente
  - [ ] `scope="col"` em todos os `<th>`
  - [ ] Status exibe badge colorido (verde/amarelo/vermelho)
  - [ ] Fonte numérica: Geist Mono, tabular-nums
        **Dependencies**: `SETUP-01`, `SETUP-03`, `BIZ-04`

---

## Épico 7 — Página Dashboard Principal

- [ ] **ID**: `PAGE-01`
      **Files**: `src/app/page.tsx`
      **Acceptance**:
  - [ ] Importa e renderiza Header (via layout) e filtros + conteúdo
  - [ ] Filtros: UBSFilter + PeriodFilter + botão "Limpar"
  - [ ] Estado dos filtros gerenciado por `useFilters()` hook
  - [ ] Layout: filtros no topo, cards, gráfico, ranking na sequência
  - [ ] `npx tsc --noEmit` passa sem erros
        **Dependencies**: `BIZ-06`, `FILTER-01`, `FILTER-02`, `DASH-02`, `DASH-03`, `DASH-04`

- [ ] **ID**: `PAGE-02`
      **Files**: `src/app/page.tsx`
      **Acceptance**:
  - [ ] Quando "Todas as UBS" selecionado: cards mostram valores agregados (média ponderada)
  - [ ] Quando UBS específica selecionada: cards mostram dados daquela UBS
  - [ ] Mudança de período recalcula todos os valores exibidos
  - [ ] Gráfico de linha atualiza dados ao mudar período/UBS
  - [ ] Ranking atualiza ao mudar período
        **Dependencies**: `PAGE-01`, `BIZ-01`, `BIZ-02`, `BIZ-03`, `BIZ-04`, `BIZ-05`

---

## Épico 8 — Página Detalhe da UBS

- [ ] **ID**: `PAGE-03`
      **Files**: `src/app/ubs/[id]/page.tsx`, `src/components/ubs/ubs-info-card.tsx`
      **Acceptance**:
  - [ ] Rota dinâmica extrai `id` dos params
  - [ ] `ubs-info-card.tsx` exibe: nome, código CNES, equipe, cadastrados, endereço
  - [ ] Se UBS não encontrada (id inválido): mostra "UBS não encontrada" + link volta ao dashboard
  - [ ] `generateMetadata()` retorna título dinâmico com nome da UBS
        **Dependencies**: `DATA-01`, `LAYOUT-01`

- [ ] **ID**: `PAGE-04`
      **Files**: `src/components/ubs/radar-chart.tsx`, `src/app/ubs/[id]/page.tsx`
      **Acceptance**:
  - [ ] `radar-chart.tsx` usa Recharts `RadarChart` com 2 Radar (valor + meta)
  - [ ] Cada eixo = um dos 4 indicadores
  - [ ] Legenda visível distinguindo valor de meta
  - [ ] `aria-label` com resumo: "Indicadores da UBS [nome]: Vacinal X%, Pré-natal Y%..."
  - [ ] Página UBS renderiza o radarChart abaixo do info card
        **Dependencies**: `PAGE-03`, `BIZ-02`, `BIZ-03`

- [ ] **ID**: `PAGE-05`
      **Files**: `src/components/ubs/history-table.tsx`, `src/app/ubs/[id]/page.tsx`
      **Acceptance**:
  - [ ] `history-table.tsx` renderiza tabela com 12 linhas (meses) × 5 colunas (mês + 4 indicadores)
  - [ ] Tabela semântica: `<table>`, `<caption>`, `scope` em th/td
  - [ ] Células com cores condicionais (verde/amarelo/vermelho conforme status)
  - [ ] Página UBS renderiza history-table abaixo do radar
        **Dependencies**: `PAGE-03`, `BIZ-01`

---

## Épico 9 — Página Indicadores

- [ ] **ID**: `PAGE-06`
      **Files**: `src/app/indicadores/page.tsx`, `src/components/indicadores/indicator-list.tsx`
      **Acceptance**:
  - [ ] Lista os 4 indicadores com: nome, descrição, meta, unidade
  - [ ] Cada item é clicável (expandir detalhe ou link)
  - [ ] Layout: cards ou lista estilizada
  - [ ] `generateMetadata()` retorna "Indicadores - Painel SUS"
        **Dependencies**: `DATA-02`, `LAYOUT-01`

- [ ] **ID**: `PAGE-07`
      **Files**: `src/components/indicadores/indicator-detail.tsx`, `src/app/indicadores/page.tsx`
      **Acceptance**:
  - [ ] `indicator-detail.tsx` exibe: descrição completa, meta, fonte
  - [ ] Gráfico de série histórica (12 meses, consolidado todas UBS)
  - [ ] Tabela comparativa: UBS × valor do indicador
  - [ ] Meta destacada visualmente (linha tracejada no gráfico, cor diferenciada na tabela)
  - [ ] Detalhe é expansível (accordion) ou seção abaixo da lista
        **Dependencies**: `PAGE-06`, `DASH-03`, `BIZ-03`

---

## Épico 10 — Página Sobre

- [ ] **ID**: `PAGE-08`
      **Files**: `src/app/sobre/page.tsx`
      **Acceptance**:
  - [ ] Título: "Sobre o Painel SUS"
  - [ ] Seção "O que é o Previne Brasil" com explicação contextual
  - [ ] Seção "Fontes de Dados" listando: CNES, e-SUS AB, DATASUS
  - [ ] Disclaimer em destaque: "Este é um protótipo com dados simulados"
  - [ ] `generateMetadata()` retorna "Sobre - Painel SUS"
  - [ ] Layout responsivo e acessível
        **Dependencies**: `LAYOUT-01`

---

## Épico 11 — Acessibilidade & Polish

- [ ] **ID**: `A11Y-01`
      **Files**: `src/app/globals.css`
      **Acceptance**:
  - [ ] CSS variables para cores semáforo definidas (se não já via Tailwind)
  - [ ] Focus ring visível: `*:focus-visible { outline: 2px solid ... }`
  - [ ] Skip link estilizado: visível apenas com focus
  - [ ] Print styles (opcional): esconde nav, mostra apenas conteúdo
        **Dependencies**: `SETUP-01`

- [ ] **ID**: `A11Y-02`
      **Files**: Todos os componentes interativos
      **Acceptance**:
  - [ ] Todos os `<a>` e `<button>` têm tamanho mínimo de toque 44x44px
  - [ ] Nenhum `div` clickável sem `role="button"` e `tabIndex={0}`
  - [ ] Todos os ícones decorativos têm `aria-hidden="true"`
  - [ ] Todos os ícones informativos têm `aria-label`
        **Dependencies**: `DASH-01`, `DASH-04`, `LAYOUT-02`

- [ ] **ID**: `A11Y-03`
      **Files**: `src/app/page.tsx`, `src/app/ubs/[id]/page.tsx`, `src/app/indicadores/page.tsx`
      **Acceptance**:
  - [ ] Tab navigation funciona sequencialmente em todas as rotas
  - [ ] Focus trap não existe (usuário pode Tab livremente)
  - [ ] Skip link leva ao `#main-content`
  - [ ] Teste manual: Tab de 1 a N elementos interativos, todos recebem foco visível
        **Dependencies**: `A11Y-01`, `A11Y-02`, `PAGE-01`, `PAGE-03`, `PAGE-06`

---

## Épico 12 — Build & Verificação Final

- [ ] **ID**: `VERIFY-01`
      **Files**: N/A (verificação)
      **Acceptance**:
  - [ ] `npm run build` — zero erros
  - [ ] `npm run lint` — zero warnings
  - [ ] `npx tsc --noEmit` — zero erros de tipo
  - [ ] `npm test` — todos os testes passam
  - [ ] `npm run test:coverage` — relatório V8 é gerado sem erro
        **Dependencies**: Todas as tasks anteriores

- [ ] **ID**: `VERIFY-02`
      **Files**: N/A (verificação)
      **Acceptance**:
  - [ ] Dashboard (/) carrega com 4 cards, gráfico e ranking
  - [ ] Filtro UBS atualiza todos os elementos
  - [ ] Filtro período atualiza todos os elementos
  - [ ] /ubs/1 mostra detalhe com radar e tabela
  - [ ] /ubs/999 mostra erro com link de volta
  - [ ] /indicadores mostra lista + detalhe expansível
  - [ ] /sobre mostra informações e disclaimer
        **Dependencies**: `VERIFY-01`

- [ ] **ID**: `VERIFY-03`
      **Files**: N/A (verificação)
      **Acceptance**:
  - [ ] Responsivo: 375px (mobile) — cards empilhados, tudo legível
  - [ ] Responsivo: 768px (tablet) — 2 colunas, gráficos grandes
  - [ ] Responsivo: 1280px (desktop) — 4 colunas, layout completo
  - [ ] Acessibilidade: tab navigation funciona em todas as 4 rotas
  - [ ] Acessibilidade: contraste ≥ 4.5:1 verificado manualmente
        **Dependencies**: `VERIFY-02`, `A11Y-03`

---

## Resumo de Dependências

```
SETUP-01 ─┬─→ SETUP-04
          ├─→ LAYOUT-01 ─┬─→ LAYOUT-02 ─┐
SETUP-05 ───→ SETUP-06 ───→ DASH-01A
                              ↑
DASH-01 ──────────────────────┘
          │               ├─→ LAYOUT-03 ─┼─→ LAYOUT-04
          │               │              │
SETUP-02 ─┼─→ SETUP-03 ──┼─→ DATA-01 ───┼─→ DATA-03 ─→ BIZ-01
          │               │  DATA-02 ────┘    BIZ-02
          │               │                     ├─→ BIZ-03
          │               │                     ├─→ BIZ-04
          │               │                     └─→ BIZ-05
          │               │
          │               └─→ BIZ-06 ─→ PAGE-01 ─→ PAGE-02
          │
          └─→ FILTER-01 ─┐
             FILTER-02 ───┤
             DASH-01 ─────┤
             DASH-02 ─────┤
             DASH-03 ─────┼─→ PAGE-01
             DASH-04 ─────┘
                           │
                           └─→ PAGE-03 ─→ PAGE-04
                                          PAGE-05
                           │
                           └─→ PAGE-06 ─→ PAGE-07
                           │
                           └─→ PAGE-08

VERIFY-01 → VERIFY-02 → VERIFY-03
```

## Estimativa de Esforço

| Épico | Tasks | Tempo estimado |
|-------|-------|---------------|
| 1. Setup | 6 | ~40 min |
| 2. Dados Mock | 3 | ~25 min |
| 3. Funções Negócio | 6 | ~30 min |
| 4. Layout | 4 | ~25 min |
| 5. Filtros | 2 | ~15 min |
| 6. Componentes Dash | 5 | ~45 min |
| 7. Página Dashboard | 2 | ~25 min |
| 8. Página UBS | 3 | ~25 min |
| 9. Página Indicadores | 2 | ~20 min |
| 10. Página Sobre | 1 | ~10 min |
| 11. Acessibilidade | 3 | ~20 min |
| 12. Verificação | 3 | ~15 min |
| **Total** | **40** | **~6h 15min** |
