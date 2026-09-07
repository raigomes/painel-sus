import { META_THRESHOLDS, PERIOD_MONTHS } from "./constants";
import type { HistoryRecord, IndicatorStatus, PeriodFilter } from "./types";

export function getIndicatorStatus(valor: number, meta: number): IndicatorStatus {
  if (!Number.isFinite(valor) || !Number.isFinite(meta) || meta <= 0) {
    throw new Error("Valor e meta devem ser finitos, e a meta deve ser maior que zero");
  }

  const percentualMeta = (valor / meta) * 100;

  if (percentualMeta >= META_THRESHOLDS.verde) {
    return "verde";
  }

  if (percentualMeta >= META_THRESHOLDS.amarelo) {
    return "amarelo";
  }

  return "vermelho";
}

export function filterByPeriod(records: HistoryRecord[], period: PeriodFilter): HistoryRecord[] {
  if (records.length === 0) {
    return [];
  }

  const latestMonth = records.reduce((latest, record) =>
    record.mes > latest ? record.mes : latest,
    records[0].mes,
  );
  const [latestYear, latestMonthNumber] = latestMonth.split("-").map(Number);
  const monthCount = PERIOD_MONTHS[period];
  const latestIndex = latestYear * 12 + latestMonthNumber - 1;
  const firstIndex = latestIndex - monthCount + 1;

  return records
    .filter((record) => {
      const [year, month] = record.mes.split("-").map(Number);
      const index = year * 12 + month - 1;
      return index >= firstIndex && index <= latestIndex;
    })
    .sort((left, right) => left.mes.localeCompare(right.mes));
}
