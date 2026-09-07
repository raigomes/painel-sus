import { describe, expect, it } from "vitest";
import type { HistoryRecord, Indicator, PeriodFilter, UBS } from "./types";
import { aggregateByIndicator, calculateRanking, calculateUBSScore, filterByPeriod, getIndicatorStatus, getTrend } from "./filters";

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

describe("aggregateByIndicator", () => {
  const ubs: UBS[] = [
    { id: 1, nome: "UBS Um", codigo: "610001", equipe: "eSF Um", cadastrados: 1000, endereco: "Rua Um" },
    { id: 2, nome: "UBS Dois", codigo: "610002", equipe: "eSF Dois", cadastrados: 3000, endereco: "Rua Dois" },
    { id: 3, nome: "UBS Três", codigo: "610003", equipe: "eSF Três", cadastrados: 2000, endereco: "Rua Três" },
  ];

  it("calcula médias temporais por UBS e consolida ponderando pela população", () => {
    const records: HistoryRecord[] = [
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-01", valor: 10 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-02", valor: 30 },
      { ubsId: 2, indicatorId: "diabetes", mes: "2026-01", valor: 70 },
      { ubsId: 2, indicatorId: "diabetes", mes: "2026-02", valor: 90 },
      { ubsId: 3, indicatorId: "pre-natal", mes: "2026-01", valor: 100 },
      { ubsId: 99, indicatorId: "diabetes", mes: "2026-01", valor: 100 },
    ];

    expect(aggregateByIndicator(records, "diabetes", ubs)).toBe(65);
    expect(aggregateByIndicator(records, "diabetes", ubs)).not.toBe(50);
  });

  it("exclui UBS sem registros e IDs desconhecidos", () => {
    const records: HistoryRecord[] = [
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-01", valor: 40 },
      { ubsId: 99, indicatorId: "diabetes", mes: "2026-01", valor: 1000 },
    ];

    expect(aggregateByIndicator(records, "diabetes", ubs)).toBe(40);
  });

  it("retorna zero sem registros do indicador", () => {
    expect(aggregateByIndicator([], "diabetes", ubs)).toBe(0);
  });

  it("arredonda o resultado para uma casa decimal sem mutar entradas", () => {
    const records: HistoryRecord[] = [
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-01", valor: 10 },
      { ubsId: 2, indicatorId: "diabetes", mes: "2026-01", valor: 11 },
    ];
    const snapshot = records.map((record) => ({ ...record }));

    expect(aggregateByIndicator(records, "diabetes", ubs)).toBe(10.8);
    expect(records).toEqual(snapshot);
  });
});

describe("calculateUBSScore e calculateRanking", () => {
  const indicators: Indicator[] = [
    { id: "cobertura-vacinal", nome: "Vacinal", descricao: "", meta: 100, unidade: "%", fonte: "" },
    { id: "pre-natal", nome: "Pré-natal", descricao: "", meta: 100, unidade: "%", fonte: "" },
    { id: "hipertensao", nome: "Hipertensão", descricao: "", meta: 100, unidade: "%", fonte: "" },
    { id: "diabetes", nome: "Diabetes", descricao: "", meta: 100, unidade: "%", fonte: "" },
  ];
  const unit = (id: number, nome: string): UBS => ({ id, nome, codigo: `61000${id}`, equipe: "eSF", cadastrados: 1000, endereco: "Rua" });
  const recordsFor = (ubsId: number, values: number[]): HistoryRecord[] =>
    indicators.map((indicator, index): HistoryRecord => ({ ubsId, indicatorId: indicator.id, mes: "2026-01", valor: values[index] }));

  it("aplica médias temporais, quatro pesos iguais, teto e piso", () => {
    const records: HistoryRecord[] = [
      ...recordsFor(1, [150, -20, 50, 100]),
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-02", valor: 0 },
    ];
    expect(calculateUBSScore(1, records, indicators)).toBe(50);
  });

  it("retorna zero para score isolado incompleto, escolha determinística necessária à exclusão do ranking", () => {
    expect(calculateUBSScore(1, recordsFor(1, [100, 100, 100, 100]).slice(0, 3), indicators)).toBe(0);
  });

  it("arredonda score fracionário para uma casa decimal", () => {
    expect(calculateUBSScore(1, recordsFor(1, [33, 66, 98, 100]), indicators)).toBe(74.3);
  });

  it("desempata pontuações iguais por nome em locale pt-BR e atribui posições", () => {
    const units = [unit(1, "UBS Zulu"), unit(2, "UBS Águia"), unit(3, "UBS Açaí")];
    const records = [
      ...recordsFor(1, [80, 80, 80, 80]),
      ...recordsFor(2, [80, 80, 80, 80]),
      ...recordsFor(3, [80, 80, 80, 80]),
    ];

    const ranking = calculateRanking(units, records, indicators);

    expect(ranking.map(({ ubs, posicao, pontuacao }) => [ubs.nome, posicao, pontuacao])).toEqual([
      ["UBS Açaí", 1, 80],
      ["UBS Águia", 2, 80],
      ["UBS Zulu", 3, 80],
    ]);
  });

  it("exclui incompletas, ordena, desempata em pt-BR, posiciona e calcula status", () => {
    const units = [unit(1, "UBS Zeta"), unit(2, "UBS Açaí"), unit(3, "UBS Incompleta")];
    const records = [...recordsFor(1, [100, 100, 100, 100]), ...recordsFor(2, [80, 80, 80, 80]), ...recordsFor(3, [100, 100, 100, 0])];
    const ranking = calculateRanking(units, records, indicators);
    expect(ranking.map(({ ubs, posicao, pontuacao, status }) => [ubs.nome, posicao, pontuacao, status])).toEqual([
      ["UBS Zeta", 1, 100, "verde"],
      ["UBS Açaí", 2, 80, "amarelo"],
      ["UBS Incompleta", 3, 75, "vermelho"],
    ]);
  });

  it("não permite indicador extra alterar os quatro pesos autorizados", () => {
    const extra: Indicator = { id: "diabetes", nome: "Extra", descricao: "", meta: 1, unidade: "%", fonte: "" };
    expect(calculateUBSScore(1, recordsFor(1, [100, 100, 100, 100]), [...indicators, extra])).toBe(100);
  });
});

describe("getTrend", () => {
  const recordsFor = (values: number[]): HistoryRecord[] => values.map((valor, index) => ({
    ubsId: 1,
    indicatorId: "diabetes",
    mes: `2026-${String(index + 1).padStart(2, "0")}`,
    valor,
  }));

  it.each([
    [[100, 100, 100, 106, 106, 106], "alta"],
    [[100, 100, 100, 94, 94, 94], "queda"],
    [[100, 100, 100, 105, 105, 105], "estavel"],
  ])("classifica a tendência padrão", (values, expected) => {
    expect(getTrend(recordsFor(values), "diabetes", 1)).toBe(expected);
  });

  it("respeita months e retorna estável com histórico insuficiente", () => {
    expect(getTrend(recordsFor([100, 100, 110, 110]), "diabetes", 1, 2)).toBe("alta");
    expect(getTrend(recordsFor([100, 100, 110]), "diabetes", 1, 2)).toBe("estavel");
  });

  it("filtra a UBS e trata média anterior zero determinísticamente", () => {
    const records: HistoryRecord[] = [
      ...recordsFor([0, 0, 0, 10, 10, 10]),
      ...recordsFor([100, 100, 100, 100, 100, 100]).map((record) => ({ ...record, ubsId: 2 })),
    ];
    const snapshot = records.map((record) => ({ ...record }));
    expect(getTrend(records, "diabetes", 1)).toBe("alta");
    expect(getTrend(records, "diabetes", 1, 3)).toBe("alta");
    expect(records).toEqual(snapshot);
  });

  it("consolida o município ponderando cadastrados, diferente da média simples", () => {
    const records: HistoryRecord[] = [
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-01", valor: 0 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-02", valor: 0 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-03", valor: 0 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-04", valor: 100 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-05", valor: 100 },
      { ubsId: 1, indicatorId: "diabetes", mes: "2026-06", valor: 100 },
      { ubsId: 2, indicatorId: "diabetes", mes: "2026-01", valor: 100 },
      { ubsId: 2, indicatorId: "diabetes", mes: "2026-02", valor: 100 },
      { ubsId: 2, indicatorId: "diabetes", mes: "2026-03", valor: 100 },
      { ubsId: 2, indicatorId: "diabetes", mes: "2026-04", valor: 0 },
      { ubsId: 2, indicatorId: "diabetes", mes: "2026-05", valor: 0 },
      { ubsId: 2, indicatorId: "diabetes", mes: "2026-06", valor: 0 },
    ];
    expect(getTrend(records, "diabetes", null)).toBe("alta");
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
