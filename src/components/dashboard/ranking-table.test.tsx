import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RankingTable } from "./ranking-table";
import { STATUS_CLASSES } from "@/lib/constants";
import type { IndicatorStatus, RankingRow, UBS } from "@/lib/types";

const makeUbs = (id: number, nome: string): UBS => ({
  id,
  nome,
  codigo: `61000${id}`,
  equipe: `eSF ${id}`,
  cadastrados: 2000,
  endereco: "Rua da Saúde, 1",
});

const rows: RankingRow[] = [
  { posicao: 1, ubs: makeUbs(2, "UBS Segunda"), pontuacao: 98, status: "verde" },
  { posicao: 2, ubs: makeUbs(1, "UBS Primeira"), pontuacao: 87.25, status: "amarelo" },
  { posicao: 3, ubs: makeUbs(3, "UBS Terceira"), pontuacao: 72.6, status: "vermelho" },
];

describe("RankingTable", () => {
  it("renderiza caption, cinco headers com scope e linhas na ordem recebida", () => {
    render(<RankingTable rows={rows} />);
    const table = screen.getByRole("table");
    const caption = within(table).getByText(
      "Ranking das 15 UBS por pontuação composta. O filtro de UBS não altera este ranking.",
    );
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveClass("sr-only");
    expect(within(table).getAllByRole("columnheader")).toHaveLength(5);
    within(table).getAllByRole("columnheader").forEach((header) => expect(header).toHaveAttribute("scope", "col"));
    expect(within(table).getAllByRole("row").slice(1).map((row) => within(row).getAllByRole("cell")[1].textContent)).toEqual([
      "UBS Segunda",
      "UBS Primeira",
      "UBS Terceira",
    ]);
  });

  it("usa overflow horizontal e preserva link, score e ordem em toda linha", () => {
    const { container } = render(<RankingTable rows={rows} />);
    expect(container.firstElementChild).toHaveClass("overflow-x-auto");

    const table = screen.getByRole("table");
    const bodyRows = within(table).getAllByRole("row").slice(1);
    expect(bodyRows).toHaveLength(rows.length);

    bodyRows.forEach((row, index) => {
      const current = rows[index];
      expect(within(row).getByRole("link")).toHaveAttribute("href", `/ubs/${current.ubs.id}`);
      const score = within(row).getAllByRole("cell")[3];
      expect(score).toHaveTextContent(current.pontuacao.toFixed(1));
      expect(score).toHaveClass("tabular-nums");
      expect(within(row).getAllByRole("cell")[1]).toHaveTextContent(current.ubs.nome);
    });
  });

  it.each([
    ["verde", "Verde", "lucide-circle-check"],
    ["amarelo", "Amarelo", "lucide-triangle-alert"],
    ["vermelho", "Vermelho", "lucide-circle-x"],
  ] as const)("comunica o estado %s com texto, ícone e classes semânticas", (status, label, iconClass) => {
    const row = rows.find((item) => item.status === status) as RankingRow;
    render(<RankingTable rows={[row]} />);

    const stateCell = within(screen.getAllByRole("row")[1]).getAllByRole("cell")[4];
    const state = within(stateCell).getByText(label).parentElement;
    expect(state).not.toBeNull();
    expect(state).toHaveClass(
      STATUS_CLASSES[status as IndicatorStatus].background,
      STATUS_CLASSES[status as IndicatorStatus].border,
      STATUS_CLASSES[status as IndicatorStatus].text,
    );
    const icon = (state as HTMLElement).querySelector("svg");
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass(iconClass, STATUS_CLASSES[status as IndicatorStatus].icon);
  });
});
