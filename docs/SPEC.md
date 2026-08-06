# SPEC — Painel SUS: Especificação Técnica

> **Projeto:** Protótipo de Painel SUS  
> **Versão:** 1.0  
> **Autor:** Owner (Agent)  
> **Data:** 2026-08-05

---

## 1. Stack Tecnológica

| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|---------------|
| Framework | Next.js (App Router) | 16.x | SSR/SSG, rotas dinâmicas, metadata API |
| UI Library | React | 19.x | Server Components, Suspense |
| Estilo | Tailwind CSS | 4.x | Utility-first, tree-shaking nativo |
| Componentes | Shadcn/UI | latest | Acessibilidade built-in, copy-paste |
| Gráficos | Recharts | 2.x | React-native, SVG, acessível |
| Linguagem | TypeScript | 5.x (strict) | Type safety, DX |

**Dependências a instalar:**
```bash
npx shadcn@latest init
npx shadcn@latest add card badge select separator skeleton tooltip
npm install recharts
```

## 2. Estrutura de Diretórios

```
src/
├── app/
│   ├── layout.tsx              # Layout raiz (header, nav, footer)
│   ├── page.tsx                # Dashboard principal "/"
│   ├── globals.css             # Tailwind imports + CSS variables
│   ├── ubs/
│   │   └── [id]/
│   │       └── page.tsx        # Detalhe da UBS
│   ├── indicadores/
│   │   └── page.tsx            # Lista de indicadores
│   └── sobre/
│       └── page.tsx            # Página sobre / fontes
│
├── components/
│   ├── layout/
│   │   ├── header.tsx          # Navegação principal
│   │   └── footer.tsx          # Rodapé com disclaimer
│   ├── dashboard/
│   │   ├── indicator-card.tsx  # Card com semáforo
│   │   ├── indicator-grid.tsx  # Grid dos 4 cards
│   │   ├── trend-chart.tsx     # Gráfico de linha (série 12 meses)
│   │   └── ranking-table.tsx   # Tabela ranking UBS
│   ├── ubs/
│   │   ├── ubs-info-card.tsx   # Card informativo da UBS
│   │   ├── radar-chart.tsx     # Gráfico radar comparativo
│   │   └── history-table.tsx   # Tabela histórico mensal
│   ├── indicadores/
│   │   ├── indicator-list.tsx  # Lista de indicadores
│   │   └── indicator-detail.tsx # Detalhe com série + comparativo
│   ├── filters/
│   │   ├── ubs-filter.tsx      # Seletor de UBS
│   │   └── period-filter.tsx   # Seletor de período
│   └── ui/                     # Shadcn/UI components (auto-gerado)
│       ├── card.tsx
│       ├── badge.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       └── tooltip.tsx
│
├── lib/
│   ├── utils.ts                # cn() helper do Shadcn
│   ├── types.ts                # Interfaces TypeScript centralizadas
│   ├── constants.ts            # Metas, períodos, configurações
│   └── filters.ts              # Funções de filtragem e cálculo
│
├── data/
│   ├── ubs.ts                  # Mock: 15 UBS
│   ├── indicators.ts           # Mock: 4 indicadores + metas
│   └── history.ts              # Mock: 12 meses × 15 UBS × 4 indicadores
│
└── hooks/
    └── use-filters.ts          # Hook de estado dos filtros (UBS + período)
```

## 3. Modelo de Dados

### 3.1 Tipos TypeScript (`src/lib/types.ts`)

```typescript
/** Unidade Básica de Saúde */
export interface UBS {
  id: number;
  nome: string;
  codigo: string;          // Código CNES fictício (6 dígitos)
  equipe: string;          // Nome da equipe e-SUS (ex: "eSF 001")
  cadastrados: number;     // População cadastrada (1500-4500)
  endereco: string;        // Bairro/logradouro
}

/** Indicador do Previne Brasil */
export interface Indicator {
  id: string;              // ex: "cobertura-vacinal"
  nome: string;            // ex: "Cobertura Vacinal"
  descricao: string;       // Descrição completa do indicador
  meta: number;            // Meta em percentual (ex: 95)
  unidade: string;         // ex: "% de crianças <1ano"
  fonte: string;           // ex: "CNES / e-SUS AB"
}

/** Registro mensal de um indicador para uma UBS */
export interface HistoryRecord {
  ubsId: number;
  indicatorId: string;
  mes: string;             // "YYYY-MM" (ex: "2025-07")
  valor: number;           // Valor em percentual
}

/** Status semáforo de um indicador */
export type IndicatorStatus = "verde" | "amarelo" | "vermelho";

/** Período de filtro selecionado */
export type PeriodFilter = "ultimo-mes" | "ultimo-trimestre" | "ultimo-semestre" | "ultimo-ano";

/** Filtros ativos */
export interface Filters {
  ubsId: number | null;    // null = "Todas as UBS"
  period: PeriodFilter;
}

/** Dados processados para exibição no card */
export interface IndicatorDisplay {
  indicator: Indicator;
  valorAtual: number;
  status: IndicatorStatus;
  tendencia: "alta" | "estavel" | "queda";
  percentualMeta: number;  // valor / meta × 100
}

/** Linha da tabela de ranking */
export interface RankingRow {
  posicao: number;
  ubs: UBS;
  pontuacao: number;       // 0-100, média ponderada
  status: IndicatorStatus;
}

/** Dados para gráfico radar (UBS específica) */
export interface RadarDataPoint {
  indicador: string;
  valor: number;
  meta: number;
}
```

### 3.2 Constantes (`src/lib/constants.ts`)

```typescript
export const META_THRESHOLDS = {
  verde: 100,    // ≥ 100% da meta
  amarelo: 80,   // ≥ 80% e < 100% da meta
  // < 80% = vermelho
} as const;

export const PERIOD_LABELS: Record<PeriodFilter, string> = {
  "ultimo-mes": "Último mês",
  "ultimo-trimestre": "Último trimestre",
  "ultimo-semestre": "Último semestre",
  "ultimo-ano": "Último ano",
};

export const PERIOD_MONTHS: Record<PeriodFilter, number> = {
  "ultimo-mes": 1,
  "ultimo-trimestre": 3,
  "ultimo-semestre": 6,
  "ultimo-ano": 12,
};

export const COLORS = {
  verde: { bg: "bg-emerald-50", border: "border-emerald-500", text: "text-emerald-700", icon: "text-emerald-600" },
  amarelo: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700", icon: "text-amber-600" },
  vermelho: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", icon: "text-red-600" },
} as const;
```

## 4. Funções de Negócio (`src/lib/filters.ts`)

### 4.1 Determinar Status Semáforo

```typescript
export function getIndicatorStatus(valor: number, meta: number): IndicatorStatus {
  const percentualMeta = (valor / meta) * 100;
  if (percentualMeta >= META_THRESHOLDS.verde) return "verde";
  if (percentualMeta >= META_THRESHOLDS.amarelo) return "amarelo";
  return "vermelho";
}
```

### 4.2 Filtrar Histórico por Período

```typescript
export function filterByPeriod(
  records: HistoryRecord[],
  period: PeriodFilter,
  referenceDate: Date = new Date()
): HistoryRecord[] {
  // Retorna os N meses mais recentes a partir de referenceDate
  const months = PERIOD_MONTHS[period];
  // Lógica de filtragem por data
}
```

### 4.3 Calcular Valor Agregado (Todas as UBS)

```typescript
export function aggregateByIndicator(
  records: HistoryRecord[],
  indicatorId: string,
  ubsList: UBS[]
): number {
  // Média ponderada: Σ(valor × cadastrados) / Σ(cadastrados)
  // Retorna percentual consolidado
}
```

### 4.4 Calcular Pontuação Ranking

```typescript
export function calculateRanking(
  ubs: UBS,
  history: HistoryRecord[],
  indicators: Indicator[],
  period: PeriodFilter
): RankingRow {
  // Média dos 4 indicadores, normalizada 0-100
  // Ordena por pontuação decrescente
}
```

### 4.5 Detectar Tendência

```typescript
export function getTrend(
  records: HistoryRecord[],
  indicatorId: string,
  ubsId: number | null,
  months: number = 3
): "alta" | "estavel" | "queda" {
  // Compara média dos últimos N meses com N meses anteriores
  // > +5% = alta; < -5% = queda; senão = estável
}
```

## 5. Especificação de Componentes

### 5.1 `IndicatorCard`

**Props:**
```typescript
interface IndicatorCardProps {
  indicator: IndicatorDisplay;
  onClick?: () => void;
}
```

**Comportamento:**
- Renderiza card com borda colorida (semáforo)
- Exibe: nome, valor atual (%), meta, ícone de status
- Badge com tendência (↑ alta, → estável, ↓ queda)
- Acessível: `role="article"`, `aria-label` descritivo
- Hover: leve elevação (shadow)

### 5.2 `TrendChart`

**Props:**
```typescript
interface TrendChartProps {
  data: { mes: string; valor: number }[];
  meta: number;
  indicatorName: string;
}
```

**Comportamento:**
- Gráfico de **barras** Recharts com 12 barras (meses) + ReferenceLine de meta (tracejada)
- Tooltip interativo com mês, valor, meta
- Eixo Y: 0-120% (com margem)
- Eixo X: labels de mês (abr, mai, jun...)
- Acessível: `role="img"`, `aria-label` descritivo, `aria-describedby`

### 5.3 `RankingTable`

**Props:**
```typescript
interface RankingTableProps {
  rows: RankingRow[];
  onUBSClick: (ubsId: number) => void;
}
```

**Comportamento:**
- Tabela HTML semântica (`<table>`, `<thead>`, `<tbody>`)
- Colunas: #, UBS, Equipe, Pontuação, Status
- Clicável: navega para `/ubs/[id]`
- Ordenável por coluna (futuro)
- Acessível: `<caption>`, `scope` nas th

### 5.4 `UBSFilter` / `PeriodFilter`

**Props (ambos):**
```typescript
interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}
```

**Comportamento:**
- Usa componente `Select` do Shadcn/UI
- Label visível + `aria-label`
- Reset para valor padrão com botão "Limpar"

### 5.5 `RadarChart`

**Props:**
```typescript
interface RadarChartProps {
  data: RadarDataPoint[];
  ubsName: string;
}
```

**Comportamento:**
- Gráfico radar Recharts com 2 polígonos: valor (preenchido) e meta (tracejado)
- Cada eixo = um indicador
- Legenda visível
- Acessível: `aria-label` com resumo dos valores

### 5.6 `Header`

**Comportamento:**
- Logo/nome "Painel SUS" à esquerda
- Links de navegação: Dashboard, Indicadores, Sobre
- Link ativo com `aria-current="page"`
- Responsivo: hamburger em mobile (opcional v1.0, nav sempre visível)
- Skip link: "Pular para conteúdo principal"

### 5.7 `Footer`

**Comportamento:**
- Disclaimer: "Dados simulados para fins de demonstração"
- Fonte: "Fontes: CNES, e-SUS AB, DATASUS"
- Versão do protótipo

## 6. Layout e Responsividade

### Breakpoints (Tailwind default)

| Breakpoint | Largura | Comportamento |
|-----------|---------|---------------|
| Default | < 640px | 1 coluna, cards empilhados, nav compacta |
| `sm:` | ≥ 640px | 2 colunas de cards |
| `md:` | ≥ 768px | 2 colunas, gráficos maiores |
| `lg:` | ≥ 1024px | 4 colunas de cards, sidebar opcional |
| `xl:` | ≥ 1280px | Layout completo, tabelas detalhadas |

### Grid do Dashboard

```
┌─────────────────────────────────────────────┐
│ [UBS Filter]  [Period Filter]    [Limpar]   │
├─────────┬─────────┬─────────┬───────────────┤
│ Card 1  │ Card 2  │ Card 3  │    Card 4     │
│ Vacinal │ PréNat  │ Hiper   │   Diabetes    │
│░░░░░░░░░│░░░░░░░░░│░░░░░░░░░│░░░░░░░░░░░░░░│ tinted bg
├─────────┴─────────┴─────────┴───────────────┤
│         Gráfico de Barras (12 meses)        │
│         + Meta reference line (dashed)      │
├─────────────────────────────────────────────┤
│         Tabela Ranking UBS                  │
└─────────────────────────────────────────────┘
```

## 7. Acessibilidade (WCAG 2.1 AA)

| Requisito | Implementação |
|-----------|--------------|
| Contraste texto | Tailwind classes com valores ≥ 4.5:1 (text-zinc-900 on white) |
| Contraste ícones | Cores semáforo ≥ 3:1 contra fundo claro |
| Navegação teclado | Todos os interativos são `<button>` ou `<a>`, foco visível com `ring-2` |
| Skip link | `<a href="#main-content" class="sr-only focus:not-sr-only">` |
| Labels formulários | `<label htmlFor>` em todos os Selects |
| ARIA roles | `role="main"`, `role="navigation"`, `role="contentinfo"` |
| Alt text | Todos os ícones decorativos `aria-hidden="true"`, informativos com `aria-label` |
| Tabelas | `<caption>`, `scope="col"`, `scope="row"` |
| Gráficos | `role="img"` + `aria-label` com resumo numérico |

## 8. Estrutura de Dados Mockados

### 8.1 UBS (`src/data/ubs.ts`)

15 UBS com nomenclatura realista de bairros paulistas:
- Cada UBS: id (1-15), nome (ex: "UBS Jardim Paulista"), código CNES (6 dígitos), equipe e-SUS (ex: "eSF 001"), cadastrados (1500-4500), endereço

### 8.2 Indicadores (`src/data/indicators.ts`)

4 indicadores com metas oficiais do Previne Brasil.

### 8.3 Histórico (`src/data/history.ts`)

- 12 meses: jul/2025 a jun/2026
- 15 UBS × 4 indicadores × 12 meses = **720 registros**
- Valores com variação realista: desvio padrão ≤ 15% da média
- Tendência geral: leve melhoria ao longo dos meses (simulando esforço da secretaria)

## 9. Performance

| Métrica | Target | Como Achiever |
|---------|--------|---------------|
| First Contentful Paint | < 1.5s | Dados estáticos, SSR |
| Largest Contentful Paint | < 2.5s | Skeleton loading nos gráficos |
| Total Blocking Time | < 200ms | Sem lazy-loading excessivo (poucos componentes) |
| Bundle size (gzipped) | < 200KB | Tree-shaking Recharts |
| Tempo carregamento 3G | < 3s | Dados mockados inline, sem fetch |

## 10. Critérios de Verificação

Após implementação, verificar:

1. **`npm run build`** — Build sem erros
2. **`npm run lint`** — Zero warnings
3. **`npx tsc --noEmit`** — Zero erros de tipo
4. **Acessibilidade:** Tab navigation funciona em todas as rotas
5. **Responsivo:** Testar em 375px, 768px, 1280px
6. **Gráficos:** Todos os 4 Recharts renderizam sem erro
7. **Filtros:** Mudar UBS e período atualiza todos os elementos
8. **Rotas:** /, /ubs/1, /indicadores, /sobre funcionam
