import { indicatorsList } from "@/data/indicators";
import { ubsList } from "@/data/ubs";
import type { HistoryRecord, Indicator } from "@/lib/types";

const months = [
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

const indicatorBases: Record<Indicator["id"], number> = {
  "cobertura-vacinal": 0.9,
  "pre-natal": 0.86,
  hipertensao: 0.84,
  diabetes: 0.82,
};

const indicatorOrder: Indicator["id"][] = indicatorsList.map(({ id }) => id);

const deterministicOffset = (ubsId: number, indicatorIndex: number): number =>
  (((ubsId * 17 + indicatorIndex * 29) % 9) - 4) / 100;

const createHistory = (): HistoryRecord[] =>
  ubsList.flatMap((ubs) =>
    indicatorOrder.flatMap((indicatorId, indicatorIndex) => {
      const indicator = indicatorsList.find(({ id }) => id === indicatorId);
      if (!indicator) {
        throw new Error(`Indicador não encontrado: ${indicatorId}`);
      }

      const base = indicatorBases[indicatorId] + deterministicOffset(ubs.id, indicatorIndex);
      return months.map((mes, monthIndex) => ({
        ubsId: ubs.id,
        indicatorId,
        mes,
        valor: Number((indicator.meta * (base + monthIndex * 0.008)).toFixed(2)),
      }));
    }),
  );

export const historyData: HistoryRecord[] = createHistory();
