'use client';

import { useMemo, useState } from 'react';

import { IndicatorFilter } from '@/components/filters/indicator-filter';
import { PeriodFilter } from '@/components/filters/period-filter';
import { UBSFilter } from '@/components/filters/ubs-filter';
import { EmptyState } from '@/components/dashboard/empty-state';
import { IndicatorGrid } from '@/components/dashboard/indicator-grid';
import { RankingTable } from '@/components/dashboard/ranking-table';
import { TrendChart } from '@/components/dashboard/trend-chart';
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
}

const INITIAL_INDICATOR: Indicator['id'] = 'cobertura-vacinal';

export function DashboardClient({ ubs, indicators, history }: DashboardClientProps) {
  const { filters, setUbsId, setPeriod, resetFilters } = useFilters();
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<Indicator['id']>(INITIAL_INDICATOR);

  const periodRecords = useMemo(
    () => filterByPeriod(history, filters.period),
    [history, filters.period],
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
  const trendPoints = useMemo<TrendPoint[]>(() => {
    if (!selectedIndicator) return [];
    const months = [...new Set(visibleRecords.map((record) => record.mes))].sort();
    return months.map((mes) => {
      const monthRecords = visibleRecords.filter(
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
  }, [visibleRecords, selectedIndicator, filters.ubsId, ubs]);

  const showEmpty = visibleRecords.length === 0;
  const hasNonDefaultFilters = filters.ubsId !== null || filters.period !== 'ultimo-mes';

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-wrap items-end gap-4 border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
        <UBSFilter ubs={ubs} value={filters.ubsId} onChange={setUbsId} />
        <PeriodFilter value={filters.period} onChange={setPeriod} />
        {hasNonDefaultFilters && !showEmpty && (
          <button
            type="button"
            onClick={resetFilters}
            aria-label="Limpar filtros"
            className="min-h-11 rounded-md px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {showEmpty ? (
        <EmptyState onClear={resetFilters} />
      ) : (
        <>
          <IndicatorGrid items={cards} />
          <section className="space-y-4">
            {selectedIndicator && (
              <IndicatorFilter
                indicators={indicators}
                value={selectedIndicator.id}
                onChange={setSelectedIndicatorId}
              />
            )}
            {selectedIndicator && (
              <TrendChart data={trendPoints} indicatorName={selectedIndicator.nome} />
            )}
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-zinc-800">Ranking das UBS</h2>
            <RankingTable rows={ranking} />
          </section>
        </>
      )}
    </div>
  );
}
