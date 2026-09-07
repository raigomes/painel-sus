import { describe, expect, it } from "vitest";
import type { HistoryRecord, PeriodFilter } from "./types";
import { filterByPeriod, getIndicatorStatus } from "./filters";

describe("getIndicatorStatus", () => {
  it("retorna amarelo exatamente em 80% da meta", () => {
    expect(getIndicatorStatus(80, 100)).toBe("amarelo");
  });

  it("retorna vermelho imediatamente abaixo de 80%", () => {
    expect(getIndicatorStatus(79.99, 100)).toBe("vermelho");
  });

  it("retorna amarelo imediatamente abaixo de 100%", () => {
    expect(getIndicatorStatus(99.99, 100)).toBe("amarelo");
  });

  it("retorna verde exatamente em 100% da meta", () => {
    expect(getIndicatorStatus(100, 100)).toBe("verde");
  });

  it("retorna verde acima da meta", () => {
    expect(getIndicatorStatus(100.01, 100)).toBe("verde");
  });

  it.each([0, -1])("lança erro para meta %s", (meta) => {
    expect(() => getIndicatorStatus(50, meta)).toThrow();
  });

  it.each([
    [Number.NaN, 100],
    [Number.POSITIVE_INFINITY, 100],
    [Number.NEGATIVE_INFINITY, 100],
    [50, Number.NaN],
    [50, Number.POSITIVE_INFINITY],
    [50, Number.NEGATIVE_INFINITY],
  ])("lança erro para entradas não finitas: %s/%s", (valor, meta) => {
    expect(() => getIndicatorStatus(valor, meta)).toThrow();
  });
});

describe("filterByPeriod", () => {
  const records: HistoryRecord[] = [
    { ubsId: 1, indicatorId: "diabetes", mes: "2025-12", valor: 12 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2026-02", valor: 14 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2025-07", valor: 7 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2026-01", valor: 13 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2026-06", valor: 18 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2025-08", valor: 8 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2026-05", valor: 17 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2025-09", valor: 9 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2025-10", valor: 10 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2025-11", valor: 11 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2026-03", valor: 15 },
    { ubsId: 1, indicatorId: "diabetes", mes: "2026-04", valor: 16 },
  ];

  it.each<[PeriodFilter, string[]]>([
    ["ultimo-mes", ["2026-06"]],
    ["ultimo-trimestre", ["2026-04", "2026-05", "2026-06"]],
    ["ultimo-semestre", ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"]],
    ["ultimo-ano", records.map(({ mes }) => mes).sort()],
  ])("retorna a janela %s", (period, months) => {
    expect(filterByPeriod(records, period).map(({ mes }) => mes)).toEqual(months);
  });

  it("ancora em janeiro, inclui novembro e dezembro do ano anterior e preserva a entrada", () => {
    const input: HistoryRecord[] = [
      { ubsId: 1, indicatorId: "diabetes", mes: "2024-12", valor: 12 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2024-09", valor: 14 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2025-01", valor: 13 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2024-11", valor: 11 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2024-10", valor: 10 },
    ];
    const inputArraySnapshot = input.slice();
    const inputObjectsSnapshot = input.map((record) => ({ ...record }));

    const result = filterByPeriod(input, "ultimo-trimestre");

    expect(result.map(({ mes }) => mes)).toEqual(["2024-11", "2024-12", "2025-01"]);
    expect(result).toEqual([
      input[3],
      input[0],
      input[2],
    ]);
    expect(result[0]).toBe(input[3]);
    expect(result[1]).toBe(input[0]);
    expect(result[2]).toBe(input[2]);
    expect(input).toEqual(inputArraySnapshot);
    expect(input.map((record) => ({ ...record }))).toEqual(inputObjectsSnapshot);
  });

  it("ordena a janela sem reordenar nem alterar os objetos de entrada", () => {
    const input = records.slice();
    const inputArraySnapshot = input.slice();
    const inputObjectsSnapshot = input.map((record) => ({ ...record }));

    const result = filterByPeriod(input, "ultimo-trimestre");

    expect(result.map(({ mes }) => mes)).toEqual(["2026-04", "2026-05", "2026-06"]);
    expect(input).toEqual(inputArraySnapshot);
    expect(input.map((record) => ({ ...record }))).toEqual(inputObjectsSnapshot);
    expect(result).toEqual([input[11], input[6], input[4]]);
    expect(result.every((record) => input.includes(record))).toBe(true);
  });

  it("exclui meses fora da janela e retorna vazio para entrada vazia", () => {
    expect(filterByPeriod(records, "ultimo-mes")).not.toContainEqual(
      expect.objectContaining({ mes: "2026-05" }),
    );
    expect(filterByPeriod([], "ultimo-ano")).toEqual([]);
  });
});
