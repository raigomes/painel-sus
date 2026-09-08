'use client';

import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';

import { TrendChartInner as TrendChart } from '@/components/dashboard/trend-chart';
import { STATUS_CLASSES } from '@/lib/constants';
import type {
  HistoryRecord,
  Indicator,
  IndicatorStatus,
  TrendPoint,
  UBS,
} from '@/lib/types';
import { aggregateByIndicator, filterByPeriod, getIndicatorStatus } from '@/lib/filters';

interface IndicatorDetailProps {
  indicator: Indicator;
  history: HistoryRecord[];
  ubs: UBS[];
}

const STATUS_LABELS: Record<IndicatorStatus, string> = {
  verde: 'Verde',
  amarelo: 'Amarelo',
  vermelho: 'Vermelho',
};

const STATUS_ICONS: Record<IndicatorStatus, typeof CircleCheck> = {
  verde: CircleCheck,
  amarelo: TriangleAlert,
  vermelho: CircleX,
};

function formatPercent(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}

function buildComparisonRows(
  history: HistoryRecord[],
  indicatorId: Indicator['id'],
  ubs: UBS[],
  meta: number,
): Array<{ ubs: UBS; valor: number; status: IndicatorStatus }> {
  const ubsMap = new Map<number, UBS>(ubs.map((u) => [u.id, u]));
  const latestByUbs = new Map<number, string>();

  for (const record of history) {
    if (record.indicatorId !== indicatorId) continue;
    const current = latestByUbs.get(record.ubsId);
    if (!current || record.mes > current) {
      latestByUbs.set(record.ubsId, record.mes);
    }
  }

  const rows: Array<{ ubs: UBS; valor: number; status: IndicatorStatus }> = [];

  for (const [ubsId, latestMes] of latestByUbs) {
    const unit = ubsMap.get(ubsId);
    if (!unit) continue;

    const record = history.find(
      (r) => r.ubsId === ubsId && r.indicatorId === indicatorId && r.mes === latestMes,
    );
    if (!record) continue;

    rows.push({
      ubs: unit,
      valor: record.valor,
      status: getIndicatorStatus(record.valor, meta),
    });
  }

  rows.sort((a, b) => a.ubs.nome.localeCompare(b.ubs.nome, 'pt-BR'));
  return rows;
}

export function IndicatorDetail({ indicator, history, ubs }: IndicatorDetailProps) {
  const periodHistory = filterByPeriod(history, 'ultimo-ano');

  const trendData: TrendPoint[] = (() => {
    const months = [...new Set(periodHistory.filter((r) => r.indicatorId === indicator.id).map((r) => r.mes))].sort();
    return months.map((mes) => {
      const monthRecords = periodHistory.filter((r) => r.indicatorId === indicator.id && r.mes === mes);
      const avg = aggregateByIndicator(monthRecords, indicator.id, ubs);
      return { mes, valor: avg, meta: indicator.meta };
    });
  })();

  const comparisonRows = buildComparisonRows(history, indicator.id, ubs, indicator.meta);

  return (
    <div className="space-y-6 pb-2">
      {/* Indicator metadata */}
      <section aria-labelledby={`detail-meta-${indicator.id}`}>
        <h3 id={`detail-meta-${indicator.id}`} className="text-base font-semibold text-zinc-800">
          {indicator.nome}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          {indicator.descricao}
        </p>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-600">
          <div className="flex gap-1.5">
            <dt className="font-medium text-zinc-700">Meta:</dt>
            <dd className="tabular-nums">{formatPercent(indicator.meta)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="font-medium text-zinc-700">Unidade:</dt>
            <dd>{indicator.unidade}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="font-medium text-zinc-700">Fonte:</dt>
            <dd>{indicator.fonte}</dd>
          </div>
        </dl>
      </section>

      {/* Consolidated trend chart */}
      <TrendChart data={trendData} indicatorName={indicator.nome} />

      {/* UBS comparison table */}
      <section aria-labelledby={`detail-table-${indicator.id}`}>
        <h4 id={`detail-table-${indicator.id}`} className="text-base font-semibold text-zinc-800">
          Comparação entre UBS — último mês disponível
        </h4>
        <p className="mt-1 text-sm text-zinc-500">
          Valores consolidados para a janela de 12 meses; tabela exibe o último mês registrado de cada unidade.
        </p>
        <div className="mt-3 w-full overflow-x-auto">
          <table
            aria-label={`Comparação de ${indicator.nome} entre as 15 UBS`}
            className="min-w-[560px] w-full border-collapse text-sm"
          >
            <caption className="sr-only">
              Comparação de {indicator.nome} entre as 15 UBS no último mês disponível
            </caption>
            <thead>
              <tr className="bg-zinc-100 text-left text-zinc-700">
                <th className="px-4 py-3 font-semibold" scope="col">UBS</th>
                <th className="px-4 py-3 font-semibold" scope="col">Equipe</th>
                <th className="px-4 py-3 font-semibold" scope="col">Valor</th>
                <th className="px-4 py-3 font-semibold" scope="col">Meta</th>
                <th className="px-4 py-3 font-semibold" scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => {
                const StatusIcon = STATUS_ICONS[row.status];
                const statusLabel = STATUS_LABELS[row.status];
                const statusClasses = STATUS_CLASSES[row.status];

                return (
                  <tr
                    className="h-12 border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                    key={row.ubs.id}
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">{row.ubs.nome}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.ubs.equipe}</td>
                    <td className="px-4 py-3 font-mono font-bold tabular-nums text-zinc-900">
                      {formatPercent(row.valor)}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-zinc-600">
                      {formatPercent(indicator.meta)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusClasses.background} ${statusClasses.border} ${statusClasses.text}`}
                      >
                        <StatusIcon aria-hidden="true" className={`size-4 ${statusClasses.icon}`} />
                        <span>{statusLabel}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {comparisonRows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-zinc-500" colSpan={5}>
                    Nenhum registro encontrado para este indicador.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
