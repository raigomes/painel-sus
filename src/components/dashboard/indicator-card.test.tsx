import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { STATUS_CLASSES } from "@/lib/constants";
import { IndicatorCard } from "./indicator-card";
import type { IndicatorDisplay } from "@/lib/types";

const baseDisplay: IndicatorDisplay = {
  indicator: {
    id: "cobertura-vacinal",
    nome: "Cobertura Vacinal",
    descricao: "Cobertura vacinal",
    meta: 95,
    unidade: "Crianças menores de um ano",
    fonte: "CNES / e-SUS AB",
  },
  valorAtual: 94.2,
  status: "amarelo",
  tendencia: "estavel",
  percentualMeta: 99.2,
};

describe("IndicatorCard", () => {
  it.each([
    ["verde", "Dentro ou acima da meta"],
    ["amarelo", "Próximo da meta"],
    ["vermelho", "Abaixo da meta"],
  ] as const)("exibe o estado %s com texto e classes completas", (status, label) => {
    render(<IndicatorCard display={{ ...baseDisplay, status }} />);

    const article = screen.getByRole("article");
    const classes = STATUS_CLASSES[status];

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(article).toHaveClass("border-l-4", classes.background, classes.border);
    expect(article.querySelector(`div.${classes.text}`)).toHaveTextContent(label);
  });

  it.each([
    ["cobertura-vacinal", "Cobertura Vacinal", "💉"],
    ["pre-natal", "Pré-natal", "🤰"],
    ["hipertensao", "Hipertensão", "❤️"],
    ["diabetes", "Diabetes", "🩸"],
  ] as const)("exibe o símbolo correto para %s", (id, name, symbol) => {
    render(
      <IndicatorCard
        display={{
          ...baseDisplay,
          indicator: { ...baseDisplay.indicator, id, nome: name },
        }}
      />,
    );

    const header = screen.getByRole("heading", { name });
    const symbolElement = header.previousElementSibling;
    expect(symbolElement).toHaveTextContent(symbol);
    expect(symbolElement).toHaveAttribute("aria-hidden", "true");
  });

  it("exibe conteúdo e nome acessível", () => {
    render(<IndicatorCard display={baseDisplay} />);

    expect(screen.getByRole("article", { name: /Cobertura Vacinal: 94\.2%, meta 95%, tendência estável/i })).toBeInTheDocument();
    expect(screen.getByText("94.2%" )).toBeInTheDocument();
    expect(screen.getByText("Crianças menores de um ano")).toBeInTheDocument();
    expect(screen.getByText("95%")).toHaveClass("tabular-nums");
  });

  it.each([
    ["alta", "alta", "lucide-arrow-up", "bg-emerald-50", "text-emerald-700"],
    ["estavel", "estável", "lucide-arrow-right", "bg-zinc-100", "text-zinc-700"],
    ["queda", "queda", "lucide-arrow-down", "bg-red-50", "text-red-700"],
  ] as const)("exibe a tendência %s com texto, ícone e classes", (trend, label, iconClass, background, text) => {
    render(<IndicatorCard display={{ ...baseDisplay, tendencia: trend }} />);

    const badge = screen.getByLabelText(`Tendência ${label}`);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(badge).toHaveClass(background, text);
    expect(badge.querySelector(`svg.${iconClass}`)).toBeInTheDocument();
  });

  it.each([
    [94.2, 95, "94.2%", "95%"],
    [94, 95.5, "94%", "95.5%"],
  ] as const)("formata valores inteiros e decimais com números tabulares", (value, meta, formattedValue, formattedMeta) => {
    render(<IndicatorCard display={{ ...baseDisplay, valorAtual: value, indicator: { ...baseDisplay.indicator, meta } }} />);

    expect(screen.getByText(formattedValue)).toHaveClass("tabular-nums");
    const metaNumber = screen.getByText(formattedMeta);
    expect(metaNumber).toHaveClass("tabular-nums");
  });
});
