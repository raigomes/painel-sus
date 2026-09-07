import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";

import { getIndicatorStatus } from "@/lib/filters";
import type {
  HistoryRecord,
  Indicator,
  IndicatorStatus,
} from "@/lib/types";

export interface HistoryTableProps {
  records: HistoryRecord[];
  indicators: Indicator[];
}

const STATUS_LABELS: Record<IndicatorStatus, string> = {
  verde: "Verde",
  amarelo: "Amarelo",
  vermelho: "Vermelho",
};

const STATUS_ICONS: Record<IndicatorStatus, typeof CircleCheck> = {
  verde: CircleCheck,
  amarelo: TriangleAlert,
  vermelho: CircleX,
};

const STATUS_CLASSES: Record<
  IndicatorStatus,
  { bg: string; border: string; text: string; icon: string }
> = {
  verde: {
    bg: "bg-emerald-50",
    border: "border-emerald-500",
    text: "text-emerald-700",
    icon: "text-emerald-600",
  },
  amarelo: {
    bg: "bg-amber-50",
    border: "border-amber-500",
    text: "text-amber-700",
    icon: "text-amber-600",
  },
  vermelho: {
    bg: "bg-red-50",
    border: "border-red-500",
    text: "text-red-700",
    icon: "text-red-600",
  },
};

function formatMonthBR(mes: string): string {
  const [year, month] = mes.split("-").map(Number);
  const monthNames = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  return `${monthNames[month - 1]}/${String(year).slice(-2)}`;
}

function StatusBadge({ status }: { status: IndicatorStatus }) {
  const label = STATUS_LABELS[status];
  const Icon = STATUS_ICONS[status];
  const classes = STATUS_CLASSES[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${classes.bg} ${classes.border} ${classes.text}`}
    >
      <Icon aria-hidden="true" className={`size-3.5 ${classes.icon}`} />
      <span>{label}</span>
    </span>
  );
}

export function HistoryTable({ records, indicators }: HistoryTableProps) {
  const uniqueMonths = [...new Set(records.map((r) => r.mes))].sort();

  const activeIndicators = indicators.filter((ind) =>
    records.some((r) => r.indicatorId === ind.id),
  );

  const recordMap = new Map<string, HistoryRecord>();
  for (const record of records) {
    recordMap.set(`${record.mes}-${record.indicatorId}`, record);
  }

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
      <h2 className="text-lg font-semibold text-zinc-900">
        Histórico mensal
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table
          aria-label="Histórico mensal por indicadores"
          className="min-w-[600px] w-full border-collapse text-sm"
        >
          <caption className="sr-only">
            Histórico mensal dos indicadores.{" "}
            {uniqueMonths.length > 0
              ? `${uniqueMonths.length} meses de ${formatMonthBR(uniqueMonths[0] ?? "")} a ${formatMonthBR(uniqueMonths[uniqueMonths.length - 1] ?? "")}.`
              : "Nenhum registro disponível."}
          </caption>
          <thead>
            <tr className="h-10 border-b border-zinc-200 bg-zinc-100 text-left">
              <th
                className="px-4 py-3 font-semibold text-zinc-700"
                scope="col"
              >
                Mês
              </th>
              {activeIndicators.map((indicator) => (
                <th
                  className="px-4 py-3 font-semibold text-zinc-700"
                  key={indicator.id}
                  scope="col"
                >
                  {indicator.nome}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueMonths.map((mes, rowIndex) => (
              <tr
                className={`h-12 border-b border-zinc-100 transition-colors hover:bg-zinc-50 ${rowIndex % 2 === 1 ? "bg-zinc-50" : "bg-white"}`}
                key={mes}
              >
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {formatMonthBR(mes)}
                </td>
                {activeIndicators.map((indicator) => {
                  const record = recordMap.get(
                    `${mes}-${indicator.id}`,
                  );
                  if (!record) {
                    return (
                      <td
                        className="px-4 py-3 text-center text-zinc-400"
                        key={indicator.id}
                      >
                        —
                      </td>
                    );
                  }

                  const status = getIndicatorStatus(
                    record.valor,
                    indicator.meta,
                  );

                  return (
                    <td className="px-4 py-3" key={indicator.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold tabular-nums text-zinc-900">
                          {record.valor}
                        </span>
                        <StatusBadge status={status} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="sr-only" aria-label="Dados do histórico mensal">
        {uniqueMonths.map((mes) => (
          <li key={mes}>
            {formatMonthBR(mes)}:{""}
            {activeIndicators.map((indicator) => {
              const record = recordMap.get(`${mes}-${indicator.id}`);
              return record
                ? ` ${indicator.nome} ${record.valor}% (meta ${indicator.meta}%)`
                : "";
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
