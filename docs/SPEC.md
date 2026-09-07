# SPEC — Painel SUS: Especificação Técnica

> **Versão:** 1.3
> **Data:** 2026-09-07
> **Arquitetura:** Next.js App Router, TypeScript strict

## 1. Stack e dependências

### 1.1 Dependências existentes

| Pacote | Versão do `package.json` | Uso |
|---|---:|---|
| `next` | `16.2.12` → `16.3.2` | App Router, Server Components, metadata e correção das vulnerabilidades transitivas registradas |
| `react`, `react-dom` | `19.2.4` | Interface e componentes |
| `tailwindcss` | `^4` | Estilos responsivos |
| `shadcn` | `^4.16.2` | Componentes UI copiados para o projeto |
| `recharts` | `^3.10.1` | LineChart e RadarChart |
| `lucide-react` | `^1.29.0` | Ícones com nomes acessíveis ou decorativos |
| `clsx`, `tailwind-merge` | `^2.1.1`, `^3.6.0` | Composição de classes por `cn()` |
| `typescript` | `^5` | Tipagem strict |

Componentes Shadcn já existentes: `card`, `badge`, `select`, `separator`, `skeleton` e `tooltip`. Não adicionar outro pacote de produção sem atualização prévia desta SPEC.

A atualização de `next` para `16.3.2` está autorizada porque `npm audit --json` em 2026-08-22 confirmou seis vulnerabilidades altas, incluindo a cadeia direta de `next@16.2.12`, `postcss` e `sharp`, com correção indicada nessa versão. A resolução de `SETUP-05` exige também `npm install` sem aviso `ERESOLVE`; avisos não podem ser suprimidos com `--force` ou `--legacy-peer-deps`. Vulnerabilidades remanescentes de ferramentas de desenvolvimento devem ser corrigidas com atualização sem quebra ou registradas pelo Reviewer com cadeia, exposição e decisão explícitas; nenhum gate pode declarar zero vulnerabilidades sem evidência de `npm audit`.

### 1.2 Dependências de teste autorizadas, ainda pendentes

```bash
npm install --save-dev vitest@^3 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^26 @vitest/coverage-v8@^3
```

Scripts requeridos:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

`vitest.config.ts` usa `jsdom`, globals e `src/test/setup.ts`; o setup importa `@testing-library/jest-dom/vitest`. A configuração do Vitest deve resolver explicitamente o alias `@` para o diretório absoluto `src`, mantendo compatibilidade com `paths` do `tsconfig.json` sem adicionar nova dependência.

## 2. Rotas do App Router

| Rota | Arquivo | Renderização | Comportamento |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Server shell + Client dashboard | Dashboard, filtros, quatro cartões, gráfico de linha e ranking |
| `/ubs/[id]` | `src/app/ubs/[id]/page.tsx` | Server Component | Busca local por ID; detalhe ou estado “UBS não encontrada” |
| `/indicadores` | `src/app/indicadores/page.tsx` | Server shell + Client accordion | Lista e detalhe expansível na mesma rota |
| `/sobre` | `src/app/sobre/page.tsx` | Server Component | Explicação, fontes e disclaimer |

Não existe rota `/indicadores/[id]`. Dados são imports estáticos; nenhuma rota de API ou fetch HTTP é necessária.

`src/app/layout.tsx` fornece fontes, metadata padrão, skip link, `Header`, `<main id="main-content">` e `Footer`. `generateMetadata` é usado em `/ubs/[id]`; as demais páginas exportam metadata estática quando necessário.

## 3. Estrutura de arquivos prevista

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── indicadores/page.tsx
│   ├── sobre/page.tsx
│   └── ubs/[id]/page.tsx
├── components/
│   ├── dashboard/{dashboard-client,indicator-card,indicator-grid,trend-chart,ranking-table,empty-state}.tsx
│   ├── filters/{ubs-filter,period-filter,indicator-filter}.tsx
│   ├── indicadores/{indicator-list,indicator-detail}.tsx
│   ├── layout/{header,footer}.tsx
│   ├── ubs/{ubs-info-card,radar-chart,history-table}.tsx
│   └── ui/{badge,card,select,separator,skeleton,tooltip}.tsx
├── data/{ubs,indicators,history}.ts
├── hooks/use-filters.ts
├── lib/{utils,types,constants,filters}.ts
└── test/setup.ts
vitest.config.ts
```

## 4. Matriz Server/Client Components

Arquivos sem `"use client"` permanecem Server Components. Somente arquivos que precisam de estado, eventos, pathname ou Recharts são Client Components.

| Arquivo/componente | Tipo | Motivo |
|---|---|---|
| `app/layout.tsx` | Server | Metadata e shell estático |
| `app/page.tsx` | Server | Importa dados locais e entrega props serializáveis ao dashboard |
| `dashboard/dashboard-client.tsx` | Client | Estado dos filtros e dados derivados interativos |
| `filters/ubs-filter.tsx` | Client | `Select` controlado |
| `filters/period-filter.tsx` | Client | `Select` controlado |
| `filters/indicator-filter.tsx` | Client | `Select` controlado da série histórica |
| `dashboard/indicator-card.tsx` | Server-compatible | Somente apresentação; sem evento obrigatório |
| `dashboard/indicator-grid.tsx` | Server-compatible | Somente composição de props |
| `dashboard/trend-chart.tsx` | Client | Recharts e tooltip interativo |
| `dashboard/ranking-table.tsx` | Server-compatible | Usa `<Link href>`; não recebe callback |
| `dashboard/empty-state.tsx` | Client-compatible | Recebe callback de limpar filtros dentro do dashboard |
| `layout/header.tsx` | Client | `usePathname` para `aria-current` e estado ativo |
| `layout/footer.tsx` | Server | Conteúdo estático |
| `app/ubs/[id]/page.tsx` | Server | Params, metadata e seleção de dados locais |
| `ubs/ubs-info-card.tsx` | Server | Apresentação |
| `ubs/radar-chart.tsx` | Client | Recharts |
| `ubs/history-table.tsx` | Server | Tabela HTML derivada de props |
| `app/indicadores/page.tsx` | Server | Carrega dados e entrega props |
| `indicadores/indicator-list.tsx` | Client | Estado do item expandido |
| `indicadores/indicator-detail.tsx` | Client | Recharts dentro do detalhe expansível |
| `app/sobre/page.tsx` | Server | Conteúdo estático |
| `hooks/use-filters.ts` | Client hook | `useState` |

“Server-compatible” significa componente sem diretiva Client, que pode ser renderizado dentro de uma árvore Client quando recebe somente props serializáveis e não recebe funções.

## 5. Schemas TypeScript

Todos ficam em `src/lib/types.ts`, salvo props locais triviais.

```typescript
export interface UBS {
  id: number;
  nome: string;
  codigo: string;
  equipe: string;
  cadastrados: number;
  endereco: string;
}

export interface Indicator {
  id: "cobertura-vacinal" | "pre-natal" | "hipertensao" | "diabetes";
  nome: string;
  descricao: string;
  meta: number;
  unidade: string;
  fonte: string;
}

export interface HistoryRecord {
  ubsId: number;
  indicatorId: Indicator["id"];
  mes: string; // YYYY-MM
  valor: number;
}

export type IndicatorStatus = "verde" | "amarelo" | "vermelho";
export type Trend = "alta" | "estavel" | "queda";
export type PeriodFilter = "ultimo-mes" | "ultimo-trimestre" | "ultimo-semestre" | "ultimo-ano";

export interface Filters {
  ubsId: number | null;
  period: PeriodFilter;
}

export interface IndicatorDisplay {
  indicator: Indicator;
  valorAtual: number;
  status: IndicatorStatus;
  tendencia: Trend;
  percentualMeta: number;
}

export interface TrendPoint {
  mes: string;
  valor: number;
  meta: number;
}

export interface RankingRow {
  posicao: number;
  ubs: UBS;
  pontuacao: number;
  status: IndicatorStatus;
}

export interface RadarDataPoint {
  indicador: string;
  valor: number;
  meta: number;
}

export interface IndicatorComparisonRow {
  ubs: UBS;
  valor: number;
  meta: number;
  status: IndicatorStatus;
}
```

Schemas de props:

```typescript
interface DashboardClientProps {
  ubs: UBS[];
  indicators: Indicator[];
  history: HistoryRecord[];
}
interface UBSFilterProps { ubs: UBS[]; value: number | null; onChange(value: number | null): void; }
interface PeriodFilterProps { value: PeriodFilter; onChange(value: PeriodFilter): void; }
interface IndicatorFilterProps { indicators: Indicator[]; value: Indicator["id"]; onChange(value: Indicator["id"]): void; }
interface IndicatorCardProps { display: IndicatorDisplay; }
interface IndicatorGridProps { items: IndicatorDisplay[]; }
interface TrendChartProps { data: TrendPoint[]; indicatorName: string; }
interface RankingTableProps { rows: RankingRow[]; }
interface EmptyStateProps { onClear(): void; }
interface UBSInfoCardProps { ubs: UBS; }
interface RadarChartProps { data: RadarDataPoint[]; ubsName: string; }
interface HistoryTableProps { records: HistoryRecord[]; indicators: Indicator[]; }
interface IndicatorListProps { indicators: Indicator[]; history: HistoryRecord[]; ubs: UBS[]; }
interface IndicatorDetailProps { indicator: Indicator; history: HistoryRecord[]; ubs: UBS[]; }
```

## 6. Constantes

`src/lib/constants.ts` exporta:

```typescript
export const META_THRESHOLDS = { verde: 100, amarelo: 80 } as const;
export const PERIOD_LABELS: Record<PeriodFilter, string> = { /* quatro labels do PRD */ };
export const PERIOD_MONTHS: Record<PeriodFilter, number> = {
  "ultimo-mes": 1,
  "ultimo-trimestre": 3,
  "ultimo-semestre": 6,
  "ultimo-ano": 12,
};
export const STATUS_CLASSES: Record<IndicatorStatus, {
  background: string; border: string; text: string; icon: string;
}> = { /* classes Tailwind completas */ };
```

## 7. Dados locais e validação

- `src/data/ubs.ts`: `ubsList` com exatamente 15 UBS, IDs 1–15, CNES fictício de seis dígitos e 1.500–4.500 cadastrados.
- `src/data/indicators.ts`: `indicatorsList` com os quatro IDs e metas do PRD.
- `src/data/history.ts`: `historyData` com exatamente 720 registros, de `2025-07` a `2026-06`.
- Para cada combinação UBS/indicador existem 12 meses únicos e contínuos.
- Valores são não negativos e não excedem 130% da meta.
- Em cada série UBS/indicador, desvio padrão dos 12 valores ≤ 15% da média da própria série.
- Em pelo menos 70% das 60 séries, junho de 2026 é maior que julho de 2025.

A integridade é verificada por testes automatizados. Formato, cardinalidade ou referências inválidas falham no desenvolvimento/teste; a UI não oferece “Tentar novamente”. Uma combinação de filtros sem registros é um estado válido da UI e oferece “Limpar filtros”.

## 8. Regras determinísticas (`src/lib/filters.ts`)

### 8.1 Status

```typescript
getIndicatorStatus(valor: number, meta: number): IndicatorStatus
```

- Lança erro se `meta <= 0` ou entradas não forem finitas.
- Calcula `(valor / meta) * 100`.
- `>=100`: verde; `>=80 e <100`: amarelo; `<80`: vermelho.

### 8.2 Janela relativa

```typescript
filterByPeriod(records: HistoryRecord[], period: PeriodFilter): HistoryRecord[]
```

- Não usa `new Date()`.
- Encontra lexicograficamente o maior `mes` no array recebido.
- Gera os 1, 3, 6 ou 12 meses calendário inclusivos terminando nesse mês.
- Mantém somente registros desses meses e os ordena por mês crescente.
- Array vazio retorna array vazio.

### 8.3 Agregação

```typescript
aggregateByIndicator(records: HistoryRecord[], indicatorId: Indicator["id"], ubs: UBS[]): number
```

- Calcula primeiro a média dos registros selecionados de cada UBS.
- Consolida essas médias por `Σ(médiaUBS × cadastrados) / Σ(cadastrados)`.
- Considera somente UBS com registros; sem registros retorna `0`.
- Resultado arredondado para uma casa decimal.

### 8.4 Pontuação e ranking

```typescript
calculateUBSScore(ubsId: number, records: HistoryRecord[], indicators: Indicator[]): number
calculateRanking(ubs: UBS[], records: HistoryRecord[], indicators: Indicator[]): RankingRow[]
```

Para cada UBS e cada um dos quatro indicadores:

1. calcula a média dos registros já filtrados;
2. calcula `parcela = clamp((média / meta) * 100, 0, 100)`;
3. atribui peso de 25% a cada parcela.

A soma ponderada é arredondada para uma casa decimal. Ausência de qualquer um dos quatro indicadores exclui a UBS do ranking. `calculateRanking` ordena por pontuação decrescente e, em empate, por `ubs.nome` com locale `pt-BR`; depois atribui posições 1..N. Status do ranking aplica RB-01 à pontuação com meta 100.

### 8.5 Tendência

```typescript
getTrend(records: HistoryRecord[], indicatorId: Indicator["id"], ubsId: number | null, months?: number): Trend
```

- Usa padrão `months = 3`.
- Compara a média dos N meses mais recentes com a média dos N imediatamente anteriores.
- Para `ubsId=null`, usa consolidação ponderada por UBS antes da comparação.
- Variação relativa `>5%`: alta; `<-5%`: queda; entre ambos, estável.
- Menos de `2N` meses válidos retorna estável.

## 9. Componentes e comportamento

### Dashboard

- `DashboardClient` inicia filtros com `{ ubsId: null, period: "ultimo-mes" }` via `useFilters`, mantém `selectedIndicatorId` separado em `"cobertura-vacinal"` e mantém `periodTouched=false` para a janela inicial própria do gráfico.
- Enquanto `periodTouched=false`, cartões e ranking usam `ultimo-mes`, mas o gráfico usa `ultimo-ano`. A primeira alteração do período define `periodTouched=true` e aplica o período selecionado aos três. `resetFilters` restaura filtros e `periodTouched=false`.
- O filtro de UBS é aplicado somente ao derivar cartões e gráfico; o ranking sempre recebe todas as UBS e todos os registros da janela relativa correspondente.
- `UBSFilter`, `PeriodFilter` e `IndicatorFilter` mantêm IDs técnicos no estado, mas `SelectValue` recebe explicitamente a label de apresentação correspondente. A UI nunca exibe `all`, `ultimo-mes`, `cobertura-vacinal` ou outros IDs internos.
- `IndicatorFilter` possui label visível “Indicador do gráfico”, lista os quatro indicadores e altera somente `selectedIndicatorId`.
- `TrendChart` recebe exclusivamente os pontos do indicador selecionado; a troca do indicador não altera cartões, filtros de UBS/período nem ranking.
- `IndicatorCard`: card semântico, fundo suave e borda esquerda de 4px; usa ícone visual por indicador (`💉`, `🤰`, `❤️`, `🩸`) e mantém estado/tendência por texto acessível. Estado vermelho mostra “Abaixo da meta”.
- `TrendChart`: Recharts `LineChart`, uma `Line` com pontos mensais, `ReferenceLine` da meta, eixos, tooltip com mês/valor/meta e descrição acessível. Exibe somente o indicador escolhido e apenas os meses da janela ativa no dashboard; no detalhe de indicador exibe os 12 meses desse indicador.
- `RankingTable`: tabela semântica com `caption`, posição, UBS, equipe, pontuação e estado. Nome da UBS é `<Link href={`/ubs/${id}`}>`; não recebe callback e não força Client Component.
- `EmptyState`: texto de ausência e botão “Limpar filtros”.

### UBS

- Rota valida ID inteiro positivo e busca em `ubsList`.
- `RadarChart`: um radar de valor e outro de meta para quatro indicadores.
- `HistoryTable`: 12 linhas mensais e cinco colunas; estado também comunicado textualmente.

### Indicadores

- `IndicatorList` usa botões com `aria-expanded` e `aria-controls`.
- Apenas um detalhe precisa permanecer aberto por vez; inicialmente nenhum.
- `IndicatorDetail` mostra descrição, meta, fonte, `TrendChart` consolidado de 12 meses e tabela com 15 UBS.
- A expansão não altera a rota.

### Layout

- Header: links Dashboard, Indicadores e Sobre; item ativo usa `aria-current="page"`, cor, peso 600, `line-height: 20px`, sem raio visual no estado ativo e underline reto de 2px com cantos de 1px conforme o componente `DoffB` do Pencil.
- Footer: três linhas completas com disclaimer, fontes, “Protótipo v1.0 — Saúde Itapira” e a referência promocional autorizada “Para saber mais sobre o meu trabalho, visite raigomes.dev”.
- Skip link aponta para `#main-content`.

## 10. Acessibilidade e responsividade

- `html lang="pt-BR"`.
- Foco visível global e alvos interativos mínimos de 44×44 px.
- Labels visíveis associados aos filtros de UBS, período e indicador do gráfico.
- Estado nunca comunicado somente por cor.
- Tabelas usam `caption`, `scope="col"` e links operáveis por teclado.
- Gráficos têm região nomeada e resumo textual; dados essenciais também aparecem em texto/tabela.
- 375px: uma coluna; 768px: até duas; ≥1024px: quatro cartões.
- Tabelas usam contêiner com overflow horizontal, sem cortar conteúdo.

## 11. Testes e verificação

Testes ficam junto aos módulos (`*.test.ts`/`*.test.tsx`), exceto setup. Cobertura mínima obrigatória:

- dados: cardinalidade, meses, referências, limites, desvio e tendência geral;
- filtros: status, âncoras temporais, agregação, score, ordenação, empate e tendência;
- `IndicatorCard`: conteúdo, nome acessível e três estados;
- dashboard: estado inicial Cobertura Vacinal, troca da série sem efeito colateral, ranking municipal sob filtro de UBS, estado vazio e ação de limpar;
- ranking: semântica, ordem e links;
- indicador: expansão sem mudança de rota.

Comandos de gate do Coder:

```bash
npx tsc --noEmit
npm run lint
npm test
npm run test:coverage
npm run build
```

Verificações manuais: rotas `/`, `/ubs/1`, `/ubs/999`, `/indicadores`, `/sobre`; teclado; viewports 375×667, 768×1024, 1280×800 e 1920×1080. O dashboard contém dois tipos de gráfico Recharts: `LineChart` (reutilizado no dashboard e indicadores) e `RadarChart` (UBS).

## 12. Performance, segurança e alinhamento visual

- Dados locais sem fetch HTTP.
- Server Components por padrão e Client Components restritos à matriz.
- Objetivo: conteúdo principal em menos de 3s sob 3G simulado, Lighthouse Performance >95 e Accessibility >98 no gate rápido.
- Headers de segurança, incluindo CSP, são configurados somente por tarefa explícita e auditados pelo Reviewer.
- `npm install` deve terminar sem `ERESOLVE`; `npm audit --json` deve ser anexado ao gate de dependências e qualquer risco remanescente deve estar documentado.
- Medição de bundle não usa limite não reproduzível; o Reviewer registra artefatos e métricas do build/Lighthouse.
- PRD v1.3 e SPEC v1.3 são fontes vinculantes para comportamento: o histórico usa `LineChart`, não `BarChart`; o dashboard inclui seletor de indicador; o ranking permanece municipal sob filtro de UBS; e a visão inicial do gráfico usa 12 meses independentemente do período inicial de cartões/ranking.
- Antes da implementação visual, o Designer deve alinhar `docs/DESIGN_SYSTEM.md` e `docs/layout/painel-sus.pen` a essas três decisões e validar o `.pen` com os guardrails do projeto.
- O alinhamento visual deve ainda prevenir as falhas históricas: três estados semáforo, tendências alta/estável/queda, gráfico e ranking completos, 12 meses no histórico, 15 UBS nas comparações, link ativo com underline e footer sem recorte com fontes e versão.
