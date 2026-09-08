'use client';

import { useMemo, useState } from 'react';

import { IndicatorFilter } from '@/components/filters/indicator-filter';
import { PeriodFilter } from '@/components/filters/period-filter';
import { UBSFilter } from '@/components/filters/ubs-filter';
import { EmptyState } from '@/components/dashboard/empty-state';
import { IndicatorGrid } from '@/components/dashboard/indicator-grid';
import { RankingTable } from '@/components/dashboard/ranking-table';
import { TrendChartInner as TrendChart } from '@/components/dashboard/trend-chart';
import { useFilters } from '@/hooks/use-filters';
import {
  aggregateByIndicator,
  calculateRanking,
  filterByPeriod,
  getIndicatorStatus,
  getTrend,
} from '@/lib/filters';
import type {
  HistoryRecord,
  Indicator,
  IndicatorDisplay,
  TrendPoint,
  UBS,
} from '@/lib/types';

export interface DashboardClientProps {
  ubs: UBS[];
  indicators: Indicator[];
  history: HistoryRecord[];
  className?: string;
}

const INITIAL_INDICATOR: Indicator['id'] = 'cobertura-vacinal';

export function DashboardClient({ ubs, indicators, history, className }: DashboardClientProps) {
  const { filters, setUbsId, setPeriod, resetFilters } = useFilters();
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<Indicator['id']>(INITIAL_INDICATOR);
  const [periodTouched, setPeriodTouched] = useState(false);

  const handlePeriodChange = (period: Parameters<typeof setPeriod>[0]): void => {
    setPeriod(period);
    setPeriodTouched(true);
  };

  const handleReset = (): void => {
    resetFilters();
    setPeriodTouched(false);
  };

  const periodRecords = useMemo(
    () => filterByPeriod(history, filters.period),
    [history, filters.period],
  );
  const trendPeriodRecords = useMemo(
    () => filterByPeriod(history, periodTouched ? filters.period : 'ultimo-ano'),
    [history, filters.period, periodTouched],
  );
  const visibleRecords = useMemo(
    () => periodRecords.filter((record) => filters.ubsId === null || record.ubsId === filters.ubsId),
    [periodRecords, filters.ubsId],
  );
  const ranking = useMemo(
    () => calculateRanking(ubs, periodRecords, indicators),
    [ubs, periodRecords, indicators],
  );

  const cards = useMemo<IndicatorDisplay[]>(() => indicators.map((indicator) => {
    const value = filters.ubsId === null
      ? aggregateByIndicator(visibleRecords, indicator.id, ubs)
      : aggregateByIndicator(visibleRecords, indicator.id, ubs.filter((unit) => unit.id === filters.ubsId));
    return {
      indicator,
      valorAtual: value,
      status: getIndicatorStatus(value, indicator.meta),
      tendencia: getTrend(periodRecords, indicator.id, filters.ubsId),
      percentualMeta: (value / indicator.meta) * 100,
    };
  }), [indicators, filters.ubsId, visibleRecords, ubs, periodRecords]);

  const selectedIndicator = indicators.find((indicator) => indicator.id === selectedIndicatorId) ?? indicators[0];
  const trendVisibleRecords = useMemo(
    () => trendPeriodRecords.filter((record) => filters.ubsId === null || record.ubsId === filters.ubsId),
    [trendPeriodRecords, filters.ubsId],
  );
  const trendPoints = useMemo<TrendPoint[]>(() => {
    if (!selectedIndicator) return [];
    const months = [...new Set(trendVisibleRecords.map((record) => record.mes))].sort();
    return months.map((mes) => {
      const monthRecords = trendVisibleRecords.filter(
        (record) => record.mes === mes && record.indicatorId === selectedIndicator.id,
      );
      const value = filters.ubsId === null
        ? aggregateByIndicator(monthRecords, selectedIndicator.id, ubs)
        : aggregateByIndicator(
          monthRecords,
          selectedIndicator.id,
          ubs.filter((unit) => unit.id === filters.ubsId),
        );
      return { mes, valor: value, meta: selectedIndicator.meta };
    });
  }, [trendVisibleRecords, selectedIndicator, filters.ubsId, ubs]);

  const showEmpty = visibleRecords.length === 0;
  const hasNonDefaultFilters = filters.ubsId !== null || filters.period !== 'ultimo-mes' || periodTouched;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-4 border-b border-zinc-200 bg-white px-6 py-4">
        <UBSFilter ubs={ubs} value={filters.ubsId} onChange={setUbsId} />
        <PeriodFilter value={filters.period} onChange={handlePeriodChange} />
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasNonDefaultFilters || showEmpty}
          aria-label="Limpar filtros"
          className="min-h-11 rounded-md px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Limpar
        </button>
      </div>

      {showEmpty ? (
        <EmptyState onClear={handleReset} />
      ) : (
        <>
          <IndicatorGrid items={cards} />
          {selectedIndicator && (
            <TrendChart
              data={trendPoints}
              indicatorName={selectedIndicator.nome}
              indicatorFilter={(
                <IndicatorFilter
                  indicators={indicators}
                  value={selectedIndicator.id}
                  onChange={setSelectedIndicatorId}
                />
              )}
            />
          )}
          <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-zinc-800">Ranking municipal das UBS</h2>
              <p className="text-sm text-zinc-600">
                Comparação municipal — 15 UBS na janela selecionada. O filtro de UBS não altera este ranking.
              </p>
            </div>
            <RankingTable rows={ranking} />
          </section>
        </>
      )}
    </div>
  );
}
