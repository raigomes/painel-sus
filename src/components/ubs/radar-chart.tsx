'use client';

import type { RadarDataPoint } from '@/lib/types';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface RadarChartProps {
  data: RadarDataPoint[];
  ubsName: string;
}

type TooltipPayloadItem = {
  name: string;
  value: number;
  color: string;
  payload: RadarDataPoint;
};

type RadarTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
};

function formatPercent(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}

function RadarTooltip({ active, payload }: RadarTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;

  return (
    <div
      className="rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-lg"
      role="status"
    >
      <p className="font-semibold text-zinc-900">{point?.indicador}</p>
      {payload.map((item) => (
        <p key={item.name} className="text-zinc-700">
          {item.name === 'valor' ? '● Valor' : '○ Meta'}:{' '}
          {formatPercent(item.value)}
        </p>
      ))}
    </div>
  );
}

function RadarLegend() {
  return (
    <div
      className="flex flex-col items-end gap-2 text-sm text-zinc-700"
      aria-label="Legenda do gráfico radar"
    >
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full bg-emerald-500"
          aria-hidden="true"
        />
        Valor
      </span>
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full border border-dashed border-zinc-400"
          aria-hidden="true"
        />
        Meta
      </span>
    </div>
  );
}

export function RadarChart({ data, ubsName }: RadarChartProps) {
  const chartLabel = `Gráfico radar comparando 4 indicadores da ${ubsName}. ${data
    .map(
      (d) =>
        `${d.indicador} ${formatPercent(d.valor)} (meta ${formatPercent(d.meta)})`
    )
    .join(', ')}.`;

  const descriptionId = 'radar-chart-description';

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
      <h2 className="text-lg font-semibold text-zinc-800">
        Radar comparativo
      </h2>

      <p id={descriptionId} className="sr-only">
        {chartLabel}
      </p>

      <div
        role="img"
        aria-label={chartLabel}
        aria-describedby={descriptionId}
        className="mt-4 h-[300px] w-full md:h-[350px] lg:h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart
            cx="50%"
            cy="50%"
            outerRadius="70%"
            innerRadius="15%"
            data={data}
            accessibilityLayer
          >
            <PolarGrid gridType="polygon" stroke="#e4e4e7" />
            <PolarAngleAxis
              dataKey="indicador"
              tick={{ fill: '#52525b', fontSize: 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              tick={{ fill: '#71717a', fontSize: 10 }}
              domain={[0, 120]}
              tickCount={5}
            />
            <Radar
              name="Valor"
              dataKey="valor"
              stroke="#10b981"
              strokeWidth={2}
              fill="#a7f3d0"
              fillOpacity={0.3}
              dot={{ r: 4, fill: '#ffffff', stroke: '#10b981', strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Radar
              name="Meta"
              dataKey="meta"
              stroke="#a1a1aa"
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="none"
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip content={<RadarTooltip />} />
            <Legend content={<RadarLegend />} />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      <ul
        className="sr-only"
        aria-label={`Dados do radar da ${ubsName}`}
      >
        {data.map((d) => (
          <li key={d.indicador}>
            {d.indicador}: valor {formatPercent(d.valor)}, meta{' '}
            {formatPercent(d.meta)}
          </li>
        ))}
      </ul>
    </div>
  );
}
