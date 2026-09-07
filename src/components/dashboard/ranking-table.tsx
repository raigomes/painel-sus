import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import Link from "next/link";

import { STATUS_CLASSES } from "@/lib/constants";
import type { IndicatorStatus, RankingRow } from "@/lib/types";

export interface RankingTableProps {
  rows: RankingRow[];
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

export function RankingTable({ rows }: RankingTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        aria-label="Ranking municipal das 15 UBS por desempenho"
        className="min-w-[600px] w-full border-collapse text-sm"
      >
        <caption className="sr-only">
          Ranking das 15 UBS por pontuação composta. O filtro de UBS não altera este ranking.
        </caption>
        <thead>
          <tr className="bg-zinc-100 text-left text-zinc-700">
            <th className="px-4 py-3 font-semibold" scope="col">Posição</th>
            <th className="px-4 py-3 font-semibold" scope="col">UBS</th>
            <th className="px-4 py-3 font-semibold" scope="col">Equipe</th>
            <th className="px-4 py-3 font-semibold" scope="col">Pontuação</th>
            <th className="px-4 py-3 font-semibold" scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const StatusIcon = STATUS_ICONS[row.status];
            const statusLabel = STATUS_LABELS[row.status];

            return (
              <tr className="h-12 border-b border-zinc-100 transition-colors hover:bg-zinc-50" key={row.ubs.id}>
                <td className="px-4 py-3 font-mono font-medium tabular-nums text-zinc-900">{row.posicao}</td>
                <td className="px-4 py-3 font-medium text-zinc-900">
                  <Link
                    className="rounded-sm text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    href={`/ubs/${row.ubs.id}`}
                  >
                    {row.ubs.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-600">{row.ubs.equipe}</td>
                <td className="px-4 py-3 font-mono font-bold tabular-nums text-zinc-900">{row.pontuacao.toFixed(1)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[row.status].background} ${STATUS_CLASSES[row.status].border} ${STATUS_CLASSES[row.status].text}`}>
                    <StatusIcon aria-hidden="true" className={`size-4 ${STATUS_CLASSES[row.status].icon}`} />
                    <span>{statusLabel}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
