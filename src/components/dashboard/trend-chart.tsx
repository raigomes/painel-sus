'use client';

import type { ReactNode } from 'react';

import type { TrendPoint } from '@/lib/types';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type TrendChartProps = {
  data: TrendPoint[];
  indicatorName: string;
  indicatorFilter?: ReactNode;
};

type TooltipPayload = {
  payload: TrendPoint;
};

type TrendTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
};

const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatMonth(month: string): string {
  const [year, monthNumber] = month.split('-');
  const monthIndex = Number(monthNumber) - 1;

  if (!year || monthIndex < 0 || monthIndex > 11) {
    return month;
  }

  return `${monthNames[monthIndex]}/${year.slice(-2)}`;
}

function formatPercent(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}

function TrendTooltip({ active, payload }: TrendTooltipProps) {
  const point = payload?.[0]?.payload;

  if (!active || !point) {
    return null;
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-lg" role="status">
      <p className="font-semibold text-zinc-900">{formatMonth(point.mes)}</p>
      <p className="text-zinc-700">Valor: {formatPercent(point.valor)}</p>
      <p className="text-zinc-600">Meta: {formatPercent(point.meta)}</p>
    </div>
  );
}

export function TrendChart({ data, indicatorName, indicatorFilter }: TrendChartProps) {
  const latestPoint = data[data.length - 1];
  const meta = latestPoint?.meta ?? 0;
  const chartLabel = `Gráfico de evolução da ${indicatorName}. ${data.length} ${data.length === 1 ? 'mês' : 'meses'} com valor atual ${latestPoint ? formatPercent(latestPoint.valor) : 'indisponível'} e meta ${formatPercent(meta)}.`;
  const descriptionId = 'trend-chart-description';

  return (
    <section aria-labelledby="trend-chart-title" className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 id="trend-chart-title" className="text-lg font-semibold text-zinc-800">
        Evolução histórica
      </h2>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        {indicatorFilter}
        <p className="min-w-0 flex-1 pb-2 text-sm text-zinc-600">
          Série {indicatorName}; meta {formatPercent(meta)}; janela ativa: {data.length} {data.length === 1 ? 'ponto' : 'pontos'}.
        </p>
      </div>
      <p id={descriptionId} className="sr-only">
        {indicatorName}: {data.length > 0 ? data.map((point) => `${formatMonth(point.mes)} ${formatPercent(point.valor)}`).join(', ') : 'sem dados'}.
        Meta: {formatPercent(meta)}.
      </p>
      <div
        role="img"
        aria-label={chartLabel}
        aria-describedby={descriptionId}
        className="mt-4 h-[250px] w-full sm:h-[280px] md:h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis
              dataKey="mes"
              tickFormatter={formatMonth}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#71717a', fontSize: 12 }}
            />
            <YAxis
              domain={[0, 120]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip content={<TrendTooltip />} />
            <ReferenceLine y={meta} stroke="#a1a1aa" strokeDasharray="5 5" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#004B87"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center gap-5 text-sm text-zinc-700" aria-label="Legenda do gráfico">
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 bg-primary" aria-hidden="true" />Valor</span>
        <span className="inline-flex items-center gap-2"><span className="w-5 border-t border-dashed border-zinc-400" aria-hidden="true" />Meta</span>
      </div>
      <ul className="sr-only" aria-label={`Dados mensais de ${indicatorName}`}>
        {data.map((point) => (
          <li key={`${point.mes}-${point.valor}`}>
            {formatMonth(point.mes)}: valor {formatPercent(point.valor)}, meta {formatPercent(point.meta)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export type { TrendChartProps };
