import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { historyData } from "@/data/history";
import { indicatorsList } from "@/data/indicators";
import { ubsList } from "@/data/ubs";
import type { HistoryRecord } from "@/lib/types";
import { DashboardClient } from "./dashboard-client";

function renderDashboard(history: HistoryRecord[] = historyData) {
  return render(<DashboardClient ubs={ubsList} indicators={indicatorsList} history={history} />);
}

function choose(label: string, option: string) {
  fireEvent.click(screen.getByRole("combobox", { name: label }));
  const optionElement = screen.getByRole("option", { name: option });
  fireEvent.pointerDown(optionElement);
  fireEvent.pointerUp(optionElement);
  fireEvent.click(optionElement);
}

function trendRegion() {
  return screen.getByRole("img", { name: /Gráfico de evolução/i }).closest("section") as HTMLElement;
}

function trendSummary() {
  const text = within(trendRegion()).getByText(/Meta:/).textContent ?? "";
  return text.match(/Meta: [^.]+\./)?.[0] ?? text;
}

function rankingSnapshot() {
  return within(screen.getByRole("table", { name: /ranking municipal/i }))
    .getAllByRole("row")
    .slice(1)
    .map((row) => ({
      content: row.textContent,
      link: within(row).getByRole("link").getAttribute("href"),
      score: within(row).getAllByRole("cell")[3]?.textContent,
    }));
}

describe("DashboardClient", () => {
  it("inicia com os filtros e indicador padrão visíveis", () => {
    renderDashboard();

    expect(screen.getByRole("combobox", { name: "UBS" })).toHaveTextContent("all");
    expect(screen.getByRole("combobox", { name: "Período" })).toHaveTextContent("ultimo-mes");
    expect(screen.getByRole("combobox", { name: "Indicador do gráfico" })).toHaveTextContent("cobertura-vacinal");
    expect(screen.getByRole("article", { name: /Cobertura Vacinal:/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Cobertura Vacinal/ })).toBeInTheDocument();
  });

  it("troca indicador e altera nome, série, meta e resumo sem alterar cards ou ranking", () => {
    renderDashboard();
    const initialCards = screen.getAllByRole("article").map((card) => card.textContent);
    const initialRanking = rankingSnapshot();
    const initialData = trendRegion().textContent;
    const initialMeta = trendSummary();
    const initialSummary = trendRegion().textContent;

    choose("Indicador do gráfico", "Diabetes");

    expect(screen.getByRole("img", { name: /Gráfico de evolução da Diabetes/ })).toBeInTheDocument();
    expect(trendRegion()).toHaveTextContent("Meta: 50%");
    expect(trendRegion().textContent).not.toBe(initialData);
    expect(trendSummary()).not.toBe(initialMeta);
    expect(trendRegion().textContent).not.toBe(initialSummary);
    expect(screen.getAllByRole("article").map((card) => card.textContent)).toEqual(initialCards);
    expect(rankingSnapshot()).toEqual(initialRanking);
  });

  it("mantém conteúdo, links e scores do ranking ao selecionar uma UBS, enquanto card e gráfico mudam", () => {
    renderDashboard();
    const initialRanking = rankingSnapshot();
    const initialCard = screen.getByRole("article", { name: /Cobertura Vacinal:/i }).textContent;
    const initialChart = trendRegion().textContent;

    choose("UBS", "UBS Centro");

    expect(rankingSnapshot()).toHaveLength(15);
    expect(rankingSnapshot()).toEqual(initialRanking);
    expect(screen.getByRole("article", { name: /Cobertura Vacinal:/i }).textContent).not.toBe(initialCard);
    expect(trendRegion().textContent).not.toBe(initialChart);
  });

  it("atualiza card, série/meta/resumo do gráfico e pontuações do ranking ao trocar período", () => {
    renderDashboard();
    const initialCard = screen.getByRole("article", { name: /Cobertura Vacinal:/i }).textContent;
    const initialChart = trendRegion().textContent;
    const initialMeta = trendSummary();
    const initialSummary = trendRegion().textContent;
    const initialRanking = rankingSnapshot();

    choose("Período", "Último trimestre");

    expect(screen.getByRole("combobox", { name: "Período" })).toHaveTextContent("ultimo-trimestre");
    expect(screen.getByRole("article", { name: /Cobertura Vacinal:/i }).textContent).not.toBe(initialCard);
    expect(trendRegion().textContent).not.toBe(initialChart);
    expect(trendSummary()).toBe(initialMeta);
    expect(trendRegion().textContent).not.toBe(initialSummary);
    expect(rankingSnapshot().map(({ score }) => score)).not.toEqual(initialRanking.map(({ score }) => score));
  });

  it("renderiza EmptyState com fixture sem registros e seu botão restaura os dados", () => {
    const latestVilaNova = historyData.filter((record) => record.ubsId === 1 && record.mes === "2026-06");
    renderDashboard(latestVilaNova);

    choose("UBS", "UBS Jardim Paulista");

    expect(screen.getByRole("heading", { name: "Nenhum registro encontrado" })).toBeInTheDocument();
    const clearButton = within(screen.getByRole("heading", { name: "Nenhum registro encontrado" }).closest("section") as HTMLElement)
      .getByRole("button", { name: "Limpar filtros" });
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);

    expect(screen.getByRole("combobox", { name: "UBS" })).toHaveTextContent("all");
    expect(screen.getByRole("combobox", { name: "Período" })).toHaveTextContent("ultimo-mes");
    expect(screen.getByRole("article", { name: /Cobertura Vacinal:/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Cobertura Vacinal/ })).toBeInTheDocument();
  });
});
