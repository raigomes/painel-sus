# Decisões de Produto — Layout Review (2026-08-06)

> **Contexto:** Revisão do `.pen` vs `DESIGN_SYSTEM.md` por @designer e @reviewer.
> 3 bloqueios críticos identificados, todos resolvidos pelo @owner.

---

## DEC-01: Família Tipográfica

**Status:** DECIDIDO  
**Decisão:** Manter **Geist Sans** como fonte de implementação. O `.pen` usa `Inter` como placeholder do wireframe (limitação do Pencil).

**Raciocínio:**
- O DESIGN_SYSTEM §2.1 foi criado com Geist Sans antes do .pen
- Inter no .pen é incidental (fonte padrão do Pencil)
- Geist Sans é mais alinhada com a identidade visual do projeto (modern, clean)
- O Coder DEVE implementar Geist Sans; números devem usar Geist Mono com `tabular-nums`

**Documentos afetados:**
- `DESIGN_SYSTEM.md` §2.1 — nota de wireframe adicionada
- `TASKS.md` — DASH-01 atualizado com referência a Geist Mono

---

## DEC-02: TrendChart — BarChart (não LineChart)

**Status:** DECIDIDO  
**Decisão:** TrendChart será implementado como **BarChart** (Recharts `<BarChart>` + `<Bar>` + `<ReferenceLine>`).

**Raciocínio:**
- O .pen mostra 12 barras verticais (jul/25 a jun/26) — visual claro e legível
- Pencil não renderiza line charts de forma confiável (limitação técnica)
- Barras são mais apropriadas para dados discretos mensais de saúde (comparação visual direta)
- A meta pode ser representada como `<ReferenceLine>` tracejada (zinc-400)
- Barras com topo arredondado (`radius={[4,4,0,0]}`) + fill primary (#004B87)

**Documentos afetados:**
- `DESIGN_SYSTEM.md` §4.3 — reescrito de LineChart para BarChart
- `DESIGN_SYSTEM.md` §6.1 — wireframe ASCII atualizado com barras
- `SPEC.md` §5.2 — descrição do TrendChart atualizada
- `TASKS.md` DASH-03 — acceptance criteria atualizados

---

## DEC-03: IndicatorCard — Fundo Tinted (não white)

**Status:** DECIDIDO  
**Decisão:** IndicatorCards usarão **fundo tinted** (cor semáforo clara) em vez de fundo branco.

**Raciocínio:**
- O .pen mostra cards com `$color.successBg` (#ecfdf5), `$color.warningBg` (#fffbeb), `$color.errorBg` (#fef2f2)
- Cores são muito claras → contraste ≥ 12:1 com zinc-900 (muito acima do mínimo 4.5:1)
- Reconhecimento visual imediato do status sem precisar olhar a borda esquerda
- Padrão comum em dashboards de saúde (Google Health, Epic, etc.)
- A borda esquerda 4px continua presente como reforço visual adicional

**Documentos afetados:**
- `DESIGN_SYSTEM.md` §4.1 — anatomia e tabela de props atualizadas
- `DESIGN_SYSTEM.md` §9.3 — classes Tailwind atualizadas (bg-sus-verde-bg etc.)
- `DESIGN_SYSTEM.md` §6.1 — wireframe com tinted bg
- `TASKS.md` DASH-01 — acceptance criteria atualizados

---

## Issues Moderados Registrados

| Issue | Status | Ação necessária |
|-------|--------|-----------------|
| Badge "estável" pg3 usa warningBg em vez de zinc-100 | Documentado | Coder implementa zinc-100/zinc-700 para "estável" |
| Dados amostrais divergentes entre pg1 e pg3 | Documentado | Coder usa dados consistentes do mock |
| Footer com texto pessoal (raigomes.dev) no .pen | Documentado | Coder implementa sem texto pessoal |
| Nav gap 24px (pen) vs 8px (spec antigo) | Atualizado | DESIGN_SYSTEM §4.6 agora diz gap-6 (24px) |
| Table header zinc-100 vs zinc-50 | Atualizado | DESIGN_SYSTEM §4.4 agora diz zinc-100 |
| Altura dos charts abaixo do spec | Atualizado | DESIGN_SYSTEM §4.3 agora diz 300px desktop |

---

## Próximos Passos

1. ✅ DESIGN_SYSTEM.md atualizado com todas as decisões
2. ✅ SPEC.md atualizado (TrendChart → BarChart)
3. ✅ TASKS.md atualizado (DASH-01, DASH-03, DASH-04, LAYOUT-03)
4. ⏳ @designer pode precisar de fixes pontuais no .pen (badge pg3, footer)
5. ✅ **@coder PODE INICIAR IMPLEMENTAÇÃO**
