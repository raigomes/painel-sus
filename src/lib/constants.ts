import type { IndicatorStatus, PeriodFilter } from "./types";

export const META_THRESHOLDS = {
  verde: 100,
  amarelo: 80,
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

export const STATUS_CLASSES: Record<
  IndicatorStatus,
  {
    background: string;
    border: string;
    text: string;
    icon: string;
  }
> = {
  verde: {
    background: "bg-emerald-50",
    border: "border-emerald-500",
    text: "text-emerald-700",
    icon: "text-emerald-600",
  },
  amarelo: {
    background: "bg-amber-50",
    border: "border-amber-500",
    text: "text-amber-700",
    icon: "text-amber-600",
  },
  vermelho: {
    background: "bg-red-50",
    border: "border-red-500",
    text: "text-red-700",
    icon: "text-red-600",
  },
};
