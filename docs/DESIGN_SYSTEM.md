---
version: "1.0"
project: "Painel SUS"
author: "@designer"
date: "2026-08-05"
tokens:
  colors:
    # Brand
    primary: "#004B87"
    primary_hover: "#003d6f"
    primary_light: "#e8f1fa"
    
    # Semantic Semaphores
    success:
      bg: "#ecfdf5"
      border: "#10B981"
      text: "#047857"
      icon: "#059669"
    warning:
      bg: "#fffbeb"
      border: "#F59E0B"
      text: "#b45309"
      icon: "#d97706"
    error:
      bg: "#fef2f2"
      border: "#EF4444"
      text: "#b91c1c"
      icon: "#dc2626"
    
    # Neutral (Zinc)
    neutral:
      50: "#fafafa"
      100: "#f4f4f5"
      200: "#e4e4e7"
      300: "#d4d4d8"
      400: "#a1a1aa"
      500: "#71717a"
      600: "#52525b"
      700: "#3f3f46"
      800: "#27272a"
      900: "#18181b"
      950: "#09090b"
    
    # Surface
    white: "#ffffff"
    background: "#fafafa"
    card: "#ffffff"
    border: "#e4e4e7"
  
  typography:
    font_sans: "Geist Sans, system-ui, sans-serif"
    font_mono: "Geist Mono, ui-monospace, monospace"
    scale:
      xs: "0.75rem"    # 12px
      sm: "0.875rem"   # 14px
      base: "1rem"     # 16px
      lg: "1.125rem"   # 18px
      xl: "1.25rem"    # 20px
      "2xl": "1.5rem"  # 24px
      "3xl": "1.875rem" # 30px
    weights:
      normal: "400"
      medium: "500"
      semibold: "600"
      bold: "700"
    line_heights:
      tight: "1.25"
      normal: "1.5"
      relaxed: "1.75"
  
  spacing:
    base: "0.25rem"  # 4px
    scale:
      0: "0"
      1: "0.25rem"   # 4px
      2: "0.5rem"    # 8px
      3: "0.75rem"   # 12px
      4: "1rem"      # 16px
      5: "1.25rem"   # 20px
      6: "1.5rem"    # 24px
      8: "2rem"      # 32px
      10: "2.5rem"   # 40px
      12: "3rem"     # 48px
      16: "4rem"     # 64px
  
  border_radius:
    none: "0"
    sm: "0.25rem"    # 4px
    md: "0.375rem"   # 6px
    lg: "0.5rem"     # 8px
    xl: "0.75rem"    # 12px
    "2xl": "1rem"    # 16px
    full: "9999px"
  
  shadows:
    none: "none"
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
    focus: "0 0 0 2px #004B87"
  
  transitions:
    fast: "150ms ease"
    normal: "200ms ease"
    slow: "300ms ease"
  
  breakpoints:
    default: "0px"
    sm: "640px"
    md: "768px"
    lg: "1024px"
    xl: "1280px"
    "2xl": "1536px"
  
  z_index:
    base: "0"
    dropdown: "100"
    sticky: "200"
    modal: "300"
    popover: "400"
    tooltip: "500"
---

# Design System — Painel SUS

Sistema de design para o protótipo do Painel SUS, dashboard de indicadores do Previne Brasil. Baseado no PRD v1.0 e SPEC v1.0.

---

## 1. Color Palette

### 1.1 Brand Color
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#004B87` | Headers, logo, active nav, focus rings, primary buttons |
| `primary_hover` | `#003d6f` | Hover states for primary actions |
| `primary_light` | `#e8f1fa` | Subtle backgrounds, badges |

### 1.2 Semantic Semaphores (Status Colors)

| Status | Background | Border | Text | Icon | Usage |
|--------|------------|--------|------|------|-------|
| **Verde** (Success) | `emerald-50` `#ecfdf5` | `emerald-500` `#10B981` | `emerald-700` `#047857` | `emerald-600` `#059669` | ≥ 100% da meta |
| **Amarelo** (Warning) | `amber-50` `#fffbeb` | `amber-500` `#F59E0B` | `amber-700` `#b45309` | `amber-600` `#d97706` | 80–99% da meta |
| **Vermelho** (Error) | `red-50` `#fef2f2` | `red-500` `#EF4444` | `red-700` `#b91c1c` | `red-600` `#dc2626` | < 80% da meta |

### 1.3 Neutral Palette (Zinc)
| Token | Hex | Usage |
|-------|-----|-------|
| `neutral.50` | `#fafafa` | Page background |
| `neutral.100` | `#f4f4f5` | Hover backgrounds, subtle dividers |
| `neutral.200` | `#e4e4e7` | Borders, input borders |
| `neutral.300` | `#d4d4d8` | Disabled borders |
| `neutral.400` | `#a1a1aa` | Placeholder text, disabled icons |
| `neutral.500` | `#71717a` | Secondary text, meta labels |
| `neutral.600` | `#52525b` | Body text (lower contrast) |
| `neutral.700` | `#3f3f46` | Body text (primary) |
| `neutral.800` | `#27272a` | Headings |
| `neutral.900` | `#18181b` | High emphasis text |
| `neutral.950` | `#09090b` | Maximum emphasis |

### 1.4 Surface Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `white` | `#ffffff` | Card backgrounds, modal surfaces |
| `background` | `#fafafa` | Page background |
| `card` | `#ffffff` | Card/component backgrounds |
| `border` | `#e4e4e7` | Default borders |

---

## 2. Typography

### 2.1 Font Families
| Family | CSS Variable | Fallback |
|--------|--------------|----------|
| **Geist Sans** | `--font-sans` | `system-ui, -apple-system, sans-serif` |
| **Geist Mono** | `--font-mono` | `ui-monospace, SFMono-Regular, monospace` |

> **⚠️ Wireframe Note:** The `.pen` layout file uses `Inter` as a placeholder — Pencil's default font. The Coder must implement **Geist Sans** as specified here. Numeric values (ranks, scores, indicator percentages) must use **Geist Mono** with `tabular-nums`.

### 2.2 Type Scale
| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-xs` | 12px (0.75rem) | 1.5 | 400/500 | Labels, captions, metadata |
| `text-sm` | 14px (0.875rem) | 1.5 | 400/500/600 | Body small, form labels, nav links |
| `text-base` | 16px (1rem) | 1.5 | 400/500 | Default body text |
| `text-lg` | 18px (1.125rem) | 1.5 | 500/600 | Subheadings, card values |
| `text-xl` | 20px (1.25rem) | 1.4 | 600 | Section headings |
| `text-2xl` | 24px (1.5rem) | 1.3 | 600/700 | Page titles |
| `text-3xl` | 30px (1.875rem) | 1.25 | 700 | Indicator values (large) |

### 2.3 Weight Guidelines
- **font-medium (500)**: Labels, navigation, badge text
- **font-semibold (600)**: Headings, card values, table headers
- **font-bold (700)**: Indicator main values, page titles

### 2.4 Font Feature Settings
```css
/* Enable tabular numbers for data alignment */
.tabular-nums { font-variant-numeric: tabular-nums; }
```

---

## 3. Spacing

### 3.1 Base Unit
4px (0.25rem) — all spacing derives from this unit.

### 3.2 Common Patterns
| Pattern | Tokens | Pixels | Usage |
|---------|--------|--------|-------|
| `gap-4` | `spacing.4` | 16px | Default grid gap, component internal gap |
| `gap-6` | `spacing.6` | 24px | Desktop grid gap, section gap |
| `p-4` | `spacing.4` | 16px | Mobile card padding, filter bar padding |
| `p-6` | `spacing.6` | 24px | Desktop card padding, page section padding |
| `space-y-6` | `spacing.6` | 24px | Vertical stack between sections |
| `px-6` | `spacing.6` | 24px | Horizontal page padding |
| `py-4` | `spacing.4` | 16px | Vertical padding for bars, headers |

### 3.3 Responsive Spacing
| Breakpoint | Card Padding | Grid Gap | Section Gap |
|------------|--------------|----------|-------------|
| Default (<640px) | `p-4` | `gap-4` | `space-y-6` |
| sm (≥640px) | `p-5` | `gap-4` | `space-y-6` |
| md (≥768px) | `p-6` | `gap-5` | `space-y-8` |
| lg (≥1024px) | `p-6` | `gap-6` | `space-y-8` |
| xl (≥1280px) | `p-6` | `gap-6` | `space-y-10` |

---

## 4. Component Specifications

### 4.1 IndicatorCard

**Anatomy:**
```
┌─────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← tinted background (semaphore)
│ █                                   │ ← 4px left border (semaphore, darker)
│  💉  Cobertura Vacinal              │
│       94.2%                         │ ← text-3xl font-bold tabular-nums
│       Meta: 95%  ↑ alta             │ ← text-sm text-zinc-500 + badge
└─────────────────────────────────────┘
```

| Property | Value | Token |
|----------|-------|-------|
| `border-left-width` | 4px | — |
| `border-left-color` | Semaphore border color | `colors.success/warning/error.border` |
| `background` | Tinted semaphore bg | `colors.success/warning/error.bg` |
| `padding` | 24px | `spacing.6` |
| `border-radius` | 8px | `border_radius.lg` |
| `box-shadow` | `shadow-sm` | `shadows.sm` |
| `hover box-shadow` | `shadow-md` | `shadows.md` |
| `min-height` | 140px | — |
| `transition` | `shadow 200ms ease` | `transitions.normal` |

> **Owner Decision (2026-08-06):** Cards use tinted backgrounds (not white) for immediate visual status recognition. The tinted colors are very light (e.g., `#ecfdf5` for success) and maintain ≥ 4.5:1 contrast with `zinc-900` text.

**Content Specs:**
| Element | Style |
|---------|-------|
| Icon | 20x20px, semaphore icon color, `mr-3` |
| Indicator Name | `text-sm font-medium text-zinc-900` |
| Value | `text-3xl font-bold tabular-nums text-zinc-900` |
| Meta Label | `text-sm text-zinc-500` |
| Trend Badge | `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium` |
| — Trend Alta | `bg-emerald-50 text-emerald-700` + `↑` |
| — Trend Estável | `bg-zinc-100 text-zinc-700` + `→` |
| — Trend Queda | `bg-red-50 text-red-700` + `↓` |

**Accessibility:**
- `role="article"`
- `aria-label="Cobertura Vacinal: 94.2%, meta 95%, tendência alta"`
- Focus ring on keyboard navigation

---

### 4.2 FilterBar

**Anatomy:**
```
┌────────────────────────────────────────────────────────────────┐
│ [UBS: Todas as UBS ▾]  [Período: Último mês ▾]      [Limpar]  │
└────────────────────────────────────────────────────────────────┘
```

| Property | Value | Token |
|----------|-------|-------|
| `background` | white | `colors.white` |
| `border-bottom` | 1px solid `zinc-200` | `colors.neutral.200` |
| `padding-x` | 24px | `spacing.6` |
| `padding-y` | 16px | `spacing.4` |
| `display` | `flex` | — |
| `align-items` | `center` | — |
| `gap` | 16px | `spacing.4` |
| `flex-wrap` | `wrap` | — |

**Select (UBS):**
- `width`: 200px (`w-[200px]`)
- `min-width`: 180px
- Label: `UBS` (visually hidden, `aria-label="Filtrar por UBS"`)

**Select (Período):**
- `width`: 180px (`w-[180px]`)
- Label: `Período` (visually hidden, `aria-label="Filtrar por período"`)

**Button "Limpar":**
- Variant: `ghost`
- Size: `sm` (`px-3 py-1.5 text-sm`)
- `aria-label="Limpar filtros"`

**Responsive:**
| Breakpoint | Layout |
|------------|--------|
| <640px | Stack vertical, full-width selects, button below |
| ≥640px | Horizontal, auto-width selects |
| ≥1024px | Fixed-width selects (200px/180px) |

---

### 4.3 TrendChart (Recharts BarChart)

> **Owner Decision (2026-08-06):** Changed from LineChart to BarChart. Bar charts provide better visual comparison for discrete monthly health indicators. The .pen wireframe confirms this choice (12 vertical bars with meta reference line).

**Dimensions:**
| Breakpoint | Height |
|------------|--------|
| Default (<640px) | 250px |
| sm (≥640px) | 280px |
| md (≥768px) | 300px |
| lg (≥1024px) | 300px |
| xl (≥1280px) | 300px |

**Series Configuration:**
| Series | Type | Fill | Radius | Stroke | Stroke Width | Stroke Dasharray |
|--------|------|------|--------|--------|--------------|------------------|
| Valor | `<Bar>` | `primary` (`#004B87`) | `[4, 4, 0, 0]` (top rounded) | None | — | — |
| Meta | `<ReferenceLine>` | — | — | `zinc-400` | 1px | `5 5` (dashed) |

**Axes:**
- **X Axis**: Month labels (MMM/YY), `tickLine={false}`, `axisLine={false}`, `tick={{ fill: zinc-500, fontSize: 12 }}`
- **Y Axis**: 0–120% range, `tickLine={false}`, `axisLine={false}`, `tick={{ fill: zinc-500, fontSize: 12 }}`, `tickFormatter={v => v + '%'}`

**Axes:**
- **X Axis**: Month labels (MMM/YY), `tickLine={false}`, `axisLine={false}`, `tick={{ fill: zinc-500, fontSize: 12 }}`
- **Y Axis**: 0–120% range, `tickLine={false}`, `axisLine={false}`, `tick={{ fill: zinc-500, fontSize: 12 }}`, `tickFormatter={v => v + '%'}`

**Grid:**
- `stroke={zinc-100}`, `strokeDasharray="3 3"`, vertical only

**Tooltip:**
```tsx
<Tooltip
  content={<CustomTooltip />}
  wrapperStyle={{
    background: 'white',
    border: '1px solid zinc-200',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    padding: '12px',
  }}
/>
```

**CustomTooltip Content:**
```
┌─────────────────────────┐
│ jul/2025                │
├─────────────────────────┤
│ ● Valor: 94.2%          │
│ ○ Meta: 95%             │
└─────────────────────────┘
```

**Accessibility:**
- `role="img"`
- `aria-label="Gráfico de evolução da Cobertura Vacinal nos últimos 12 meses. Valor atual 94.2%, meta 95%. Tendência geral de alta."`
- `aria-describedby` pointing to hidden description with data table

**Responsive Container:**
```tsx
<ResponsiveContainer width="100%" height={chartHeight}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
    <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={v => `${v}%`} domain={[0, 120]} />
    <Tooltip content={<CustomTooltip />} />
    <ReferenceLine y={meta} stroke="#a1a1aa" strokeDasharray="5 5" strokeWidth={1} />
    <Bar dataKey="valor" fill="#004B87" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

---

### 4.4 RankingTable

**Structure:**
```html
<table role="grid" aria-label="Ranking das UBS por desempenho">
  <caption class="sr-only">Ranking das 15 UBS por pontuação composta</caption>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">UBS</th>
      <th scope="col">Equipe</th>
      <th scope="col">Score</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr tabindex="0" role="row" data-ubs-id="1">
      <td>1</td>
      <td>UBS Vila Nova</td>
      <td>eSF 001</td>
      <td>92</td>
      <td><span class="badge-green">🟢</span></td>
    </tr>
  </tbody>
</table>
```

| Property | Value | Token |
|----------|-------|-------|
| `width` | 100% | — |
| `border-collapse` | `collapse` | — |
| `font-size` | `text-sm` | `typography.scale.sm` |

**Header Row:**
- `background`: `zinc-100` (`bg-zinc-100`)
- `font-weight`: `semibold` (`font-semibold`)
- `padding`: `px-4 py-3`
- `border-bottom`: `1px solid zinc-200`
- `text-align`: `left`
- `color`: `zinc-700`

**Body Rows:**
- `height`: 48px (`h-12`)
- `padding`: `px-4 py-3`
- `border-bottom`: `1px solid zinc-100`
- `hover background`: `zinc-50` (`hover:bg-zinc-50`)
- `cursor`: `pointer` (clickable rows)
- `transition`: `background 150ms ease`

**Cells:**
- **Posição (#)**: `font-mono tabular-nums font-medium text-zinc-900`
- **UBS**: `font-medium text-zinc-900`
- **Equipe**: `text-zinc-600`
- **Score**: `font-mono tabular-nums font-bold text-zinc-900`
- **Status**: Badge component (see semaphore colors)

**Focus State (Keyboard):**
- `outline: none`
- `ring-2 ring-primary ring-offset-2`
- `background: zinc-50`

**Accessibility:**
- `<caption>` with descriptive text
- `scope="col"` on all `<th>`
- `scope="row"` on first `<td>` of each row
- `tabindex="0"` on clickable rows
- `role="row"` on `<tr>`
- `role="grid"` on `<table>`
- Enter/Space triggers navigation to `/ubs/[id]`

**Responsive:**
| Breakpoint | Behavior |
|------------|----------|
| <768px | Horizontal scroll (`overflow-x-auto`), min-width 600px |
| ≥768px | Full width, all columns visible |

---

### 4.5 RadarChart (Recharts RadarChart)

**Dimensions:**
| Breakpoint | Height |
|------------|--------|
| Default | 300px |
| md (≥768px) | 350px |
| lg (≥1024px) | 350px |

**Configuration:**
```tsx
<RadarChart width={width} height={height} data={data}>
  <PolarGrid gridType="polygon" polarRadius={5} 
    polarAngles={polarAngles} stroke={zinc-200} />
  <PolarAngleAxis dataKey="indicador" 
    tick={{ fill: zinc-600, fontSize: 12, fontWeight: 500 }} />
  <PolarRadiusAxis angle={90} 
    tick={{ fill: zinc-500, fontSize: 10 }} 
    domain={[0, 120]} tickCount={5} />
  
  {/* Valor - filled */}
  <Radar dataKey="valor" 
    stroke={emerald-500} strokeWidth={2}
    fill={emerald-200} fillOpacity={0.3}
    dot={{ r: 4, fill: white, stroke: emerald-500, strokeWidth: 2 }}
  />
  
  {/* Meta - outline */}
  <Radar dataKey="meta"
    stroke={zinc-400} strokeWidth={1} strokeDasharray="5 5"
    fill="none"
    dot={false}
  />
  
  <Legend layout="vertical" align="right" verticalAlign="middle" />
  <Tooltip 
    content={<RadarTooltip />}
    wrapperStyle={{ ... }}
  />
</RadarChart>
```

**Series:**
| Series | Fill | Stroke | Stroke Width | Stroke Dasharray |
|--------|------|--------|--------------|------------------|
| Valor | `emerald-200` (opacity 0.3) | `emerald-500` | 2px | Solid |
| Meta | None | `zinc-400` | 1px | `5 5` |

**Axes:**
- **Angle Axis**: Indicator names, `zinc-600`, 12px, medium
- **Radius Axis**: 0–120%, 5 ticks, `zinc-500`, 10px

**Grid:**
- Polygon grid, `zinc-200` stroke

**Tooltip:**
```
┌─────────────────────────┐
│ Cobertura Vacinal       │
├─────────────────────────┤
● Valor: 97%
○ Meta: 95%
└─────────────────────────┘
```

**Accessibility:**
- `role="img"`
- `aria-label="Gráfico radar comparando 4 indicadores da UBS Vila Nova. Cobertura Vacinal 97% (meta 95%), Pré-natal 62% (meta 60%), Hipertensão 45% (meta 50%), Diabetes 51% (meta 50%)."`

---

### 4.6 Header

**Anatomy:**
```
┌────────────────────────────────────────────────────────────────┐
│ 🏥 Painel SUS                              Dashboard Indicadores │
└────────────────────────────────────────────────────────────────┘
```

| Property | Value | Token |
|----------|-------|-------|
| `height` | 64px (`h-16`) | — |
| `background` | white | `colors.white` |
| `border-bottom` | 1px solid `zinc-200` | `colors.neutral.200` |
| `position` | `sticky` / `top-0` / `z-sticky` | `z_index.sticky` |
| `padding-x` | 24px | `spacing.6` |
| `display` | `flex` / `justify-between` / `items-center` | — |

**Logo/Title:**
- `text-lg` (18px) | `font-bold` | `text-primary` (`#004B87`)
- Icon: 24x24px, `mr-2`, `text-primary`
- `aria-label="Painel SUS - Início"`

**Navigation:**
- `display: flex`, `gap: 24px` (`gap-6`)
- Links: `text-sm` `font-medium` `text-zinc-700` `px-3 py-2` `rounded-md`
- **Active**: `text-primary` `border-b-2 border-primary` `pb-2` `-mb-px` + `aria-current="page"`
- **Hover**: `text-primary` `bg-primary-light` (`bg-zinc-50` fallback)
- **Focus**: `ring-2 ring-primary ring-offset-2`

**Skip Link:**
```tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-tooltip px-4 py-2 bg-primary text-white rounded-md"
>
  Pular para conteúdo principal
</a>
```

**Responsive:**
- Mobile: Navigation always visible (no hamburger in v1.0)
- Tablet+: Full horizontal layout

---

### 4.7 Footer

**Anatomy:**
```
┌────────────────────────────────────────────────────────────────┐
│ Dados simulados para fins de demonstração. Fontes: CNES,       │
│ e-SUS AB, DATASUS. Protótipo v1.0 — Saúde Itapira              │
└────────────────────────────────────────────────────────────────┘
```

| Property | Value | Token |
|----------|-------|-------|
| `background` | `zinc-50` | `colors.neutral.50` |
| `border-top` | 1px solid `zinc-200` | `colors.neutral.200` |
| `padding-y` | 24px (`py-6`) | `spacing.6` |
| `padding-x` | 24px (`px-6`) | `spacing.6` |
| `text-align` | `center` | — |
| `font-size` | `text-sm` (14px) | `typography.scale.sm` |
| `color` | `text-zinc-500` | `colors.neutral.500` |
| `line-height` | `relaxed` (1.75) | `typography.line_heights.relaxed` |

**Content:**
- Line 1: Disclaimer (dados simulados)
- Line 2: Fontes (CNES, e-SUS AB, DATASUS)
- Line 3: Version info

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Cards Grid | Chart Height | Table Behavior | Header |
|------------|-------|------------|--------------|----------------|--------|
| Default | <640px | 1 col | 250px | Horizontal scroll | Stack logo + nav |
| sm | ≥640px | 2 col | 300px | Horizontal scroll | Horizontal |
| md | ≥768px | 2 col | 350px | Full width | Horizontal |
| lg | ≥1024px | 4 col | 400px | Full width | Horizontal |
| xl | ≥1280px | 4 col | 400px | Full width | Horizontal |
| 2xl | ≥1536px | 4 col | 400px | Full width | Horizontal |

### Grid Classes (Tailwind):
```tsx
// Indicator Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  {cards.map(card => <IndicatorCard key={card.id} {...card} />)}
</div>

// Page Layout
<div className="min-h-screen flex flex-col">
  <Header />
  <main id="main-content" className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
    <FilterBar />
    <IndicatorGrid />
    <TrendChartSection />
    <RankingTableSection />
  </main>
  <Footer />
</div>
```

---

## 6. Layout Wireframes (ASCII Art)

### 6.1 Dashboard (`/`)

```
┌──────────────────────────────────────────────────────────────────┐
│ 🏥 Painel SUS                                          64px      │
│        Dashboard  Indicadores  Sobre                             │
├──────────────────────────────────────────────────────────────────┤
│ [UBS: Todas as UBS ▾]  [Período: Último mês ▾]        [Limpar]  │  56px
├────────────┬────────────┬────────────┬───────────────────────────┤
│ 💉 Vacinal │ 🤰 Pré-Nat │ ❤️ Hiper   │ 🩸 Diabetes              │
│░░░░░░░░░░░░│░░░░░░░░░░░░│░░░░░░░░░░░░│░░░░░░░░░░░░░░░░░░░░░░░░░│  tinted bg
│   94.2%    │   58.1%    │   42.3%    │    48.7%                 │  140px
│ Meta: 95%  │ Meta: 60%  │ Meta: 50%  │  Meta: 50%               │  (min)
│ ↑ alta     │ → estável  │ ↓ queda    │  → estável               │
├────────────┴────────────┴────────────┴───────────────────────────┤
│                     📈 Evolução dos Indicadores (12 meses)       │
│    100│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ meta
│     80│      ██    ██                                            │
│     60│██████  ██  ██  ████████████████████████████████████████  │
│     40│────────────────────────────────────────────────────────  │
│     20│                                                          │
│       └─jul─ago─set─out─nov─dez─jan─fev─mar─abr─mai─jun         │  300px
├──────────────────────────────────────────────────────────────────┤
│  🏆 Ranking das UBS                                              │
│  #  │ UBS              │ Equipe   │ Score │ Status              │
│  1  │ UBS Vila Nova    │ eSF 001  │  92   │ 🟢                  │
│  2  │ UBS Jardim Paul. │ eSF 003  │  87   │ 🟢                  │  15 rows
│  ...│ ...              │ ...      │ ...   │ ...                 │  48px each
│  15 │ UBS Cidade Nova  │ eSF 012  │  54   │ 🔴                  │
└──────────────────────────────────────────────────────────────────┘
│ Dados simulados para fins de demonstração. Fontes: CNES,         │  80px
│ e-SUS AB, DATASUS. Protótipo v1.0 — Saúde Itapira                │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 UBS Detail (`/ubs/[id]`)

```
┌──────────────────────────────────────────────────────────────────┐
│ 🏥 Painel SUS                                          64px      │
│        Dashboard  Indicadores  Sobre                             │
├──────────────────────────────────────────────────────────────────┤
│ ← Voltar ao Dashboard                                            │  48px
├──────────────────────────────────────────────────────────────────┤
│ 📍 UBS Vila Nova                                                 │
│ CNES: 123456 | Equipe: eSF 001 | Cadastrados: 3.200             │  80px
│ Endereço: Rua das Flores, 123 - Vila Nova                       │
├────────────────────────┬─────────────────────────────────────────┤
│                        │        🕸️ Radar Comparativo             │
│   Indicadores          │                                         │
│   ┌────────────────┐   │         Vacinal                         │
│   │ Vacinal  97% 🟢│   │        /    \                          │
│   │ Pré-Nat  62% 🟢│   │   Hiper ──── Diabetes                  │
│   │ Hiper    45% 🟡│   │        \    /                          │
│   │ Diabetes 51% 🟢│   │         Pré-Natal                      │
│   └────────────────┘   │                                         │  350px
├────────────────────────┴─────────────────────────────────────────┤
│  📊 Histórico Mensal                                             │
│  Mês     │ Vacinal │ Pré-Nat │ Hiper  │ Diabetes               │
│  jul/25  │  95 🟢  │  58 🟡  │  44 🟡 │  50 🟢                │
│  ago/25  │  93 🟡  │  60 🟢  │  42 🟡 │  48 🟡                │  12 rows
│  ...     │  ...    │  ...    │  ...   │  ...                  │  48px each
│  jun/26  │  97 🟢  │  63 🟢  │  47 🟡 │  52 🟢                │
└──────────────────────────────────────────────────────────────────┘
│ Footer                                                           │  80px
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Accessibility Checklist (WCAG 2.1 AA)

### 7.1 Color Contrast
| Element | Requirement | Implementation |
|---------|-------------|----------------|
| Body text (zinc-900 on white) | ≥ 4.5:1 | ✅ 12.6:1 |
| Secondary text (zinc-600 on white) | ≥ 4.5:1 | ✅ 7.1:1 |
| Meta labels (zinc-500 on white) | ≥ 4.5:1 | ✅ 4.5:1 |
| Semaphore icons (emerald-600/amber-600/red-600 on white) | ≥ 3:1 | ✅ 4.2:1 / 3.8:1 / 5.1:1 |
| Focus ring (primary on white) | ≥ 3:1 | ✅ 8.4:1 |
| Links (primary on white) | ≥ 4.5:1 | ✅ 8.4:1 |

### 7.2 Focus Management
| Element | Focus Style |
|---------|-------------|
| Interactive elements (buttons, links, inputs) | `ring-2 ring-primary ring-offset-2` |
| Table rows (clickable) | `ring-2 ring-primary ring-offset-2 bg-zinc-50` |
| Skip link | Visible on focus only (`sr-only focus:not-sr-only`) |
| Focus order | Logical: Header → Filters → Cards → Chart → Table → Footer |

### 7.3 Touch Targets
| Element | Minimum Size |
|---------|--------------|
| Buttons, links, selects | 44×44px |
| Table rows | 48px height |
| Chart tooltips | 280×120px min |

### 7.4 Semantic HTML
| Pattern | Implementation |
|---------|----------------|
| Page structure | `<header>`, `<main id="main-content">`, `<footer>` |
| Navigation | `<nav aria-label="Navegação principal">` |
| Tables | `<table>`, `<caption>`, `<thead>`, `<tbody>`, `scope="col/row"` |
| Forms | `<label htmlFor>`, `<select id>`, `aria-label` when no visual label |
| Charts | `role="img"` + `aria-label` + `aria-describedby` |
| Cards | `role="article"` + `aria-label` |
| Status badges | `aria-label` with full status text |

### 7.5 ARIA & Screen Readers
| Component | ARIA Attributes |
|-----------|-----------------|
| IndicatorCard | `role="article"`, `aria-label="Indicador: valor, meta, tendência"` |
| FilterBar Selects | `aria-label="Filtrar por UBS/Período"` |
| TrendChart | `role="img"`, `aria-label="Gráfico de evolução..."`, `aria-describedby="chart-desc"` |
| RankingTable | `role="grid"`, `<caption>`, `scope`, `tabindex="0"` on rows |
| RadarChart | `role="img"`, `aria-label="Gráfico radar..."` |
| Header Nav | `aria-current="page"` on active link |
| Footer | `role="contentinfo"` |

### 7.6 Keyboard Navigation
- [ ] Tab reaches all interactive elements
- [ ] Shift+Tab reverses order
- [ ] Enter/Space activates buttons and links
- [ ] Arrow keys navigate within components (selects, tables)
- [ ] Escape closes dropdowns/modals
- [ ] Skip link works (focus moves to main)

---

## 8. Animation & Transitions

| Trigger | Animation | Duration | Easing | Notes |
|---------|-----------|----------|--------|-------|
| Card hover | `shadow-sm → shadow-md` | 200ms | ease | `transition-shadow duration-200` |
| Card focus | `ring-2 ring-primary ring-offset-2` | 150ms | ease | Instant visual feedback |
| Filter change | None (instant) | 0ms | — | Data integrity: no loading spinners |
| Page navigation | None (SPA) | 0ms | — | Next.js App Router handles |
| Chart tooltip show | Fade in + scale | 150ms | ease-out | Recharts default |
| Chart tooltip hide | Fade out | 100ms | ease-in | Recharts default |
| Chart line draw | Stroke dash offset | 800ms | ease-out | Initial mount only |
| Badge appear | Scale 0→1 | 150ms | ease-out | On card render |
| Table row hover | `bg-zinc-50` | 150ms | ease | `transition-colors` |

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 9. Implementation Notes for Coder

### 9.1 Tailwind Config Extensions
```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#004B87',
        'primary-hover': '#003d6f',
        'primary-light': '#e8f1fa',
        sus: {
          verde: {
            bg: '#ecfdf5',
            border: '#10B981',
            text: '#047857',
            icon: '#059669',
          },
          amarelo: {
            bg: '#fffbeb',
            border: '#F59E0B',
            text: '#b45309',
            icon: '#d97706',
          },
          vermelho: {
            bg: '#fef2f2',
            border: '#EF4444',
            text: '#b91c1c',
            icon: '#dc2626',
          },
        },
      },
      fontFamily: {
        sans: ['Geist Sans', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
}
```

### 9.2 CSS Variables (globals.css)
```css
:root {
  --color-primary: #004B87;
  --color-primary-hover: #003d6f;
  --color-success-bg: #ecfdf5;
  --color-success-border: #10B981;
  --color-success-text: #047857;
  --color-warning-bg: #fffbeb;
  --color-warning-border: #F59E0B;
  --color-warning-text: #b45309;
  --color-error-bg: #fef2f2;
  --color-error-border: #EF4444;
  --color-error-text: #b91c1c;
}
```

### 9.3 Component Class Patterns
```tsx
// IndicatorCard - tinted background with semaphore border
<div className={`border-l-4 ${
  status === 'verde' ? 'border-sus-verde-border bg-sus-verde-bg' :
  status === 'amarelo' ? 'border-sus-amarelo-border bg-sus-amarelo-bg' :
  'border-sus-vermelho-border bg-sus-vermelho-bg'
} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow min-h-[140px]`}>

// Badge variants (trend badges use same colors)
const badgeVariants = {
  verde: 'bg-sus-verde-bg text-sus-verde-text',
  amarelo: 'bg-sus-amarelo-bg text-sus-amarelo-text',
  vermelho: 'bg-sus-vermelho-bg text-sus-vermelho-text',
}

// TrendChart - BarChart with meta reference line
<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
  <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={v => `${v}%`} domain={[0, 120]} />
  <Tooltip content={<CustomTooltip />} />
  <ReferenceLine y={meta} stroke="#a1a1aa" strokeDasharray="5 5" strokeWidth={1} />
  <Bar dataKey="valor" fill="#004B87" radius={[4, 4, 0, 0]} />
</BarChart>
```

---

## 10. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-05 | @designer | Initial design system from PRD/SPEC |

---

*End of DESIGN_SYSTEM.md*