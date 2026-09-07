import { describe, expect, test } from "vitest";

import { historyData } from "@/data/history";
import { indicatorsList } from "@/data/indicators";
import { ubsList } from "@/data/ubs";
import type { Indicator, HistoryRecord } from "../lib/types";

const expectedMonths = [
  "2025-07",
  "2025-08",
  "2025-09",
  "2025-10",
  "2025-11",
  "2025-12",
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04",
  "2026-05",
  "2026-06",
] as const;

const expectedIndicatorIds: Indicator["id"][] = [
  "cobertura-vacinal",
  "pre-natal",
  "hipertensao",
  "diabetes",
];

const unique = <T,>(values: T[]): T[] => [...new Set(values)];

const seriesKey = (record: Pick<HistoryRecord, "ubsId" | "indicatorId">): string =>
  `${record.ubsId}:${record.indicatorId}`;

const populationStandardDeviation = (values: number[]): number => {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length,
  );
};

describe("integridade dos dados locais", () => {
  test("contém 720 registros, 15 UBS, 4 indicadores e referências válidas", () => {
    expect(historyData).toHaveLength(720);
    expect(ubsList).toHaveLength(15);
    expect(indicatorsList).toHaveLength(4);
    expect(unique(ubsList.map(({ id }) => id))).toHaveLength(15);
    expect(unique(indicatorsList.map(({ id }) => id))).toEqual(expectedIndicatorIds);

    const ubsIds = new Set(ubsList.map(({ id }) => id));
    const indicatorIds = new Set(indicatorsList.map(({ id }) => id));
    expect(historyData.every(({ ubsId }) => ubsIds.has(ubsId))).toBe(true);
    expect(historyData.every((record) => indicatorIds.has(record.indicatorId))).toBe(true);
    expect(unique(historyData.map(seriesKey))).toHaveLength(60);
  });

  test("mantém 12 meses únicos e contínuos em cada série", () => {
    const grouped = new Map<string, HistoryRecord[]>();
    historyData.forEach((record) => {
      const key = seriesKey(record);
      const records = grouped.get(key) ?? [];
      records.push(record);
      grouped.set(key, records);
    });

    expect(grouped.size).toBe(60);
    grouped.forEach((records) => {
      expect(records).toHaveLength(12);
      expect(unique(records.map(({ mes }) => mes))).toEqual([...expectedMonths]);
    });
  });

  test("respeita as regras de CNES, cadastrados e referências de indicadores", () => {
    expect(unique(ubsList.map(({ codigo }) => codigo))).toHaveLength(15);
    expect(ubsList.every(({ codigo }) => /^\d{6}$/.test(codigo))).toBe(true);
    expect(ubsList.every(({ cadastrados }) =>
      Number.isInteger(cadastrados) && cadastrados >= 1500 && cadastrados <= 4500,
    )).toBe(true);
    expect(indicatorsList.map(({ meta }) => meta)).toEqual([95, 60, 50, 50]);
    expect(historyData.every(({ valor, indicatorId }) => {
      const indicator = indicatorsList.find(({ id }) => id === indicatorId);
      return indicator !== undefined && Number.isFinite(valor) && valor >= 0 && valor <= indicator.meta * 1.3;
    })).toBe(true);
  });

  test("limita o desvio padrão populacional a 15% da média de cada série", () => {
    const grouped = new Map<string, number[]>();
    historyData.forEach((record) => {
      const values = grouped.get(seriesKey(record)) ?? [];
      values.push(record.valor);
      grouped.set(seriesKey(record), values);
    });

    grouped.forEach((values) => {
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const standardDeviation = populationStandardDeviation(values);
      const allowedDeviation = mean === 0 ? 0 : mean * 0.15;
      expect(standardDeviation).toBeLessThanOrEqual(allowedDeviation + Number.EPSILON);
    });
  });

  test("apresenta tendência de alta em pelo menos 42 das 60 séries", () => {
    const grouped = new Map<string, HistoryRecord[]>();
    historyData.forEach((record) => {
      const records = grouped.get(seriesKey(record)) ?? [];
      records.push(record);
      grouped.set(seriesKey(record), records);
    });

    const increasingSeries = [...grouped.values()].filter((records) => {
      const july = records.find(({ mes }) => mes === "2025-07");
      const june = records.find(({ mes }) => mes === "2026-06");
      return july !== undefined && june !== undefined && june.valor > july.valor;
    });

    expect(increasingSeries.length).toBeGreaterThanOrEqual(42);
    expect(increasingSeries.length).toBeLessThanOrEqual(60);
  });
});
