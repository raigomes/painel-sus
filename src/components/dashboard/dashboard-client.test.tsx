import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { historyData } from "@/data/history";
import { indicatorsList } from "@/data/indicators";
import { ubsList } from "@/data/ubs";
import type { HistoryRecord } from "@/lib/types";
import { DashboardClient } from "./dashboard-client";

// Mock next/dynamic para testes
// O dynamic recebe uma função que retorna uma promise e um objeto de opções
vi.mock("next/dynamic", () => ({
  default: vi.fn((factory: () => Promise<{ TrendChartInner: React.ComponentType }>) => {
    // O factory é uma função que retorna uma promise com o módulo
    // Simula o comportamento do dynamic: resolve o componente
    return factory().then((mod) => mod.TrendChartInner);
  }),
}));

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

    expect(screen.getByRole("combobox", { name: "UBS" })).toHaveTextContent("Todas as UBS");
    expect(screen.getByRole("combobox", { name: "Período" })).toHaveTextContent("Último mês");
    expect(screen.getByRole("combobox", { name: "Indicador do gráfico" })).toHaveTextContent("Cobertura Vacinal");
    expect(screen.getByRole("img", { name: /12 meses/ })).toBeInTheDocument();
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

  it("atualiza card, gráfico real com três pontos e pontuações do ranking ao trocar período", () => {
    renderDashboard();
    const initialCard = screen.getByRole("article", { name: /Cobertura Vacinal:/i }).textContent;
    const initialChart = trendRegion().textContent;
    const initialMeta = trendSummary();
    const initialSummary = trendRegion().textContent;
    const initialRanking = rankingSnapshot();

    choose("Período", "Último trimestre");

    expect(screen.getByRole("combobox", { name: "Período" })).toHaveTextContent("Último trimestre");
    expect(screen.getByRole("article", { name: /Cobertura Vacinal:/i }).textContent).not.toBe(initialCard);
    expect(trendRegion()).toHaveTextContent("3 pontos");
    expect(screen.getByRole("img", { name: /3 meses/ })).toBeInTheDocument();
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

    expect(screen.getByRole("combobox", { name: "UBS" })).toHaveTextContent("Todas as UBS");
    expect(screen.getByRole("combobox", { name: "Período" })).toHaveTextContent("Último mês");
    expect(screen.getByRole("article", { name: /Cobertura Vacinal:/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Cobertura Vacinal/ })).toBeInTheDocument();
  });

  it("restaura a janela de 12 pontos ao limpar EmptyState após alterar o período", () => {
    const withoutJardimPaulista = historyData.filter((record) => record.ubsId !== 2);
    renderDashboard(withoutJardimPaulista);

    choose("Período", "Último trimestre");
    choose("UBS", "UBS Jardim Paulista");

    expect(screen.getByRole("heading", { name: "Nenhum registro encontrado" })).toBeInTheDocument();
    fireEvent.click(
      within(screen.getByRole("heading", { name: "Nenhum registro encontrado" }).closest("section") as HTMLElement)
        .getByRole("button", { name: "Limpar filtros" }),
    );

    expect(screen.getByRole("combobox", { name: "UBS" })).toHaveTextContent("Todas as UBS");
    expect(screen.getByRole("combobox", { name: "Período" })).toHaveTextContent("Último mês");
    expect(screen.getByRole("img", { name: /12 meses/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Gráfico de evolução da Cobertura Vacinal/ })).toBeInTheDocument();
  });
});
