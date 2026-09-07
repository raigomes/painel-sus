import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CircleCheck,
  CircleX,
  TriangleAlert,
} from "lucide-react";

import { STATUS_CLASSES } from "@/lib/constants";
import type { IndicatorDisplay, IndicatorStatus, Trend } from "@/lib/types";

export interface IndicatorCardProps {
  display: IndicatorDisplay;
}

const STATUS_LABELS: Record<IndicatorStatus, string> = {
  verde: "Dentro ou acima da meta",
  amarelo: "Próximo da meta",
  vermelho: "Abaixo da meta",
};

const TREND_LABELS: Record<Trend, string> = {
  alta: "alta",
  estavel: "estável",
  queda: "queda",
};

const TREND_CLASSES: Record<Trend, string> = {
  alta: "bg-emerald-50 text-emerald-700",
  estavel: "bg-zinc-100 text-zinc-700",
  queda: "bg-red-50 text-red-700",
};

const STATUS_ICONS: Record<IndicatorStatus, typeof CircleCheck> = {
  verde: CircleCheck,
  amarelo: TriangleAlert,
  vermelho: CircleX,
};

const TREND_ICONS: Record<Trend, typeof ArrowUp> = {
  alta: ArrowUp,
  estavel: ArrowRight,
  queda: ArrowDown,
};

function formatMeasure(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

export function IndicatorCard({ display }: IndicatorCardProps) {
  const { indicator, valorAtual, status, tendencia } = display;
  const StatusIcon = STATUS_ICONS[status];
  const TrendIcon = TREND_ICONS[tendencia];
  const statusLabel = STATUS_LABELS[status];
  const trendLabel = TREND_LABELS[tendencia];

  return (
    <article
      aria-label={`${indicator.nome}: ${formatMeasure(valorAtual)}%, meta ${formatMeasure(indicator.meta)}%, tendência ${trendLabel}`}
      className={`h-[245px] overflow-hidden rounded-lg border-l-4 p-6 shadow-sm transition-shadow duration-200 hover:shadow-md ${STATUS_CLASSES[status].background} ${STATUS_CLASSES[status].border}`}
      role="article"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <StatusIcon
            aria-hidden="true"
            className={`size-5 shrink-0 ${STATUS_CLASSES[status].icon}`}
          />
          <h2 className="text-sm font-medium text-zinc-900">{indicator.nome}</h2>
        </div>

        <span className="font-mono text-3xl font-bold tabular-nums text-zinc-900">
          {formatMeasure(valorAtual)}%
        </span>

        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <span>
            Meta: <span className="tabular-nums">{formatMeasure(indicator.meta)}%</span>
          </span>
          <span
            aria-label={`Tendência ${trendLabel}`}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${TREND_CLASSES[tendencia]}`}
          >
            <TrendIcon aria-hidden="true" className="size-3" />
            <span>{trendLabel}</span>
          </span>
        </div>

        {/* Status text: accessible to screen readers but visually hidden to prevent card misalignment */}
        <div className={`sr-only flex items-center gap-1 text-sm font-medium ${STATUS_CLASSES[status].text}`}>
          <span>{statusLabel}</span>
        </div>

        {/* Unit: accessible for screen readers, not shown in card anatomy per pg1 */}
        <span className="sr-only">{indicator.unidade}</span>
      </div>
    </article>
  );
}
