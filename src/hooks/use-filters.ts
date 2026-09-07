'use client';

import { useState } from "react";
import type { Filters, PeriodFilter } from "@/lib/types";

const INITIAL_FILTERS: Filters = {
  ubsId: null,
  period: "ultimo-mes",
};

export interface UseFiltersResult {
  filters: Filters;
  setUbsId: (ubsId: number | null) => void;
  setPeriod: (period: PeriodFilter) => void;
  resetFilters: () => void;
}

export function useFilters(): UseFiltersResult {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

  const setUbsId = (ubsId: number | null): void => {
    setFilters((current) => ({ ...current, ubsId }));
  };

  const setPeriod = (period: PeriodFilter): void => {
    setFilters((current) => ({ ...current, period }));
  };

  const resetFilters = (): void => {
    setFilters(INITIAL_FILTERS);
  };

  return { filters, setUbsId, setPeriod, resetFilters };
}
