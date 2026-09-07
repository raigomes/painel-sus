import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFilters } from "./use-filters";

describe("useFilters", () => {
  it("inicia com todas as UBS e último mês", () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.filters).toEqual({ ubsId: null, period: "ultimo-mes" });
  });

  it("altera a UBS preservando o período", () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setPeriod("ultimo-trimestre");
      result.current.setUbsId(7);
    });

    expect(result.current.filters).toEqual({ ubsId: 7, period: "ultimo-trimestre" });
  });

  it("altera o período preservando a UBS", () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setUbsId(3);
      result.current.setPeriod("ultimo-semestre");
    });

    expect(result.current.filters).toEqual({ ubsId: 3, period: "ultimo-semestre" });
  });

  it("preserva cada alteração em uma sequência e restaura o estado inicial", () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setUbsId(12);
    });
    act(() => {
      result.current.setPeriod("ultimo-ano");
    });
    act(() => {
      result.current.setUbsId(null);
    });

    expect(result.current.filters).toEqual({ ubsId: null, period: "ultimo-ano" });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({ ubsId: null, period: "ultimo-mes" });
  });
});
