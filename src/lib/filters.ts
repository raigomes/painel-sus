import { ubsList } from "@/data/ubs";
import { META_THRESHOLDS, PERIOD_MONTHS } from "./constants";
import type {
  HistoryRecord,
  Indicator,
  IndicatorStatus,
  PeriodFilter,
  RankingRow,
  Trend,
  UBS,
} from "./types";

const RANKING_INDICATOR_IDS: readonly Indicator["id"][] = [
  "cobertura-vacinal",
  "pre-natal",
  "hipertensao",
  "diabetes",
];

function getIndicatorAverages(ubsId: number, records: HistoryRecord[]): Map<Indicator["id"], number> {
  const valuesByIndicator = new Map<Indicator["id"], number[]>();

  for (const record of records) {
    if (record.ubsId !== ubsId) {
      continue;
    }

    const values = valuesByIndicator.get(record.indicatorId) ?? [];
    values.push(record.valor);
    valuesByIndicator.set(record.indicatorId, values);
  }

  return new Map(
    [...valuesByIndicator].map(([indicatorId, values]) => [
      indicatorId,
      values.reduce((total, value) => total + value, 0) / values.length,
    ]),
  );
}

function hasAllRankingIndicators(ubsId: number, records: HistoryRecord[]): boolean {
  const averages = getIndicatorAverages(ubsId, records);
  return RANKING_INDICATOR_IDS.every((indicatorId) => averages.has(indicatorId));
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

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

export function aggregateByIndicator(
  records: HistoryRecord[],
  indicatorId: Indicator["id"],
  ubs: UBS[],
): number {
  const valuesByUbs = new Map<number, number[]>();

  for (const record of records) {
    if (record.indicatorId !== indicatorId) {
      continue;
    }

    const values = valuesByUbs.get(record.ubsId) ?? [];
    values.push(record.valor);
    valuesByUbs.set(record.ubsId, values);
  }

  let weightedTotal = 0;
  let populationTotal = 0;

  for (const unit of ubs) {
    const values = valuesByUbs.get(unit.id);
    if (!values) {
      continue;
    }

    const temporalAverage = values.reduce((total, value) => total + value, 0) / values.length;
    weightedTotal += temporalAverage * unit.cadastrados;
    populationTotal += unit.cadastrados;
  }

  if (populationTotal === 0) {
    return 0;
  }

  return Math.round((weightedTotal / populationTotal) * 10) / 10;
}

export function calculateUBSScore(
  ubsId: number,
  records: HistoryRecord[],
  indicators: Indicator[],
): number {
  const averages = getIndicatorAverages(ubsId, records);
  const authorizedIndicators = RANKING_INDICATOR_IDS.map((indicatorId) =>
    indicators.find((indicator) => indicator.id === indicatorId),
  );

  if (authorizedIndicators.some((indicator) => indicator === undefined)) {
    return 0;
  }

  const completeIndicators = authorizedIndicators as Indicator[];
  if (!RANKING_INDICATOR_IDS.every((indicatorId) => averages.has(indicatorId))) {
    return 0;
  }

  const total = completeIndicators.reduce((score, indicator) => {
    const average = averages.get(indicator.id) ?? 0;
    const parcela = Math.min(Math.max((average / indicator.meta) * 100, 0), 100);
    return score + parcela * 0.25;
  }, 0);

  return roundToOneDecimal(total);
}

export function calculateRanking(
  ubs: UBS[],
  records: HistoryRecord[],
  indicators: Indicator[],
): RankingRow[] {
  const completeUbs = ubs.filter((unit) => hasAllRankingIndicators(unit.id, records));

  return completeUbs
    .map((unit) => {
      const pontuacao = calculateUBSScore(unit.id, records, indicators);
      return {
        ubs: unit,
        pontuacao,
        status: getIndicatorStatus(pontuacao, 100),
      };
    })
    .sort((left, right) =>
      right.pontuacao - left.pontuacao || left.ubs.nome.localeCompare(right.ubs.nome, "pt-BR"),
    )
    .map((row, index) => ({ ...row, posicao: index + 1 }));
}

export function getTrend(
  records: HistoryRecord[],
  indicatorId: Indicator["id"],
  ubsId: number | null,
  months = 3,
): Trend {
  if (!Number.isInteger(months) || months <= 0) {
    return "estavel";
  }

  const selected = records.filter(
    (record) => record.indicatorId === indicatorId && (ubsId === null || record.ubsId === ubsId),
  );
  const validMonths = [...new Set(selected.map((record) => record.mes))].sort();
  if (validMonths.length < months * 2) {
    return "estavel";
  }

  const recentMonths = validMonths.slice(-months);
  const previousMonths = validMonths.slice(-(months * 2), -months);
  const averageForMonth = (month: string): number => {
    const monthly = selected.filter((record) => record.mes === month);
    if (ubsId !== null) {
      return monthly.reduce((total, record) => total + record.valor, 0) / monthly.length;
    }

    let weightedTotal = 0;
    let populationTotal = 0;
    for (const unit of ubsList) {
      const values = monthly.filter((record) => record.ubsId === unit.id).map((record) => record.valor);
      if (values.length > 0) {
        weightedTotal += (values.reduce((total, value) => total + value, 0) / values.length) * unit.cadastrados;
        populationTotal += unit.cadastrados;
      }
    }
    return populationTotal === 0 ? 0 : weightedTotal / populationTotal;
  };
  const average = (monthsToAverage: string[]): number =>
    monthsToAverage.reduce((total, month) => total + averageForMonth(month), 0) / monthsToAverage.length;
  const recentAverage = average(recentMonths);
  const previousAverage = average(previousMonths);

  if (previousAverage === 0) {
    return recentAverage === 0 ? "estavel" : "alta";
  }

  const variation = (recentAverage - previousAverage) / Math.abs(previousAverage);
  if (variation > 0.05) {
    return "alta";
  }
  if (variation < -0.05) {
    return "queda";
  }
  return "estavel";
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
