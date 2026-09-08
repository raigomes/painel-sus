import type { Metadata } from "next";

import { IndicatorList } from "@/components/indicadores/indicator-list";
import { historyData } from "@/data/history";
import { indicatorsList } from "@/data/indicators";
import { ubsList } from "@/data/ubs";

export const metadata: Metadata = {
  title: "Indicadores - Painel SUS",
};

export default function IndicadoresPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] bg-zinc-50 px-6 py-6">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold leading-tight text-zinc-900">
          Indicadores
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-500">
          Detalhe de cada indicador do Previne Brasil. Selecione um indicador
          para expandir e visualizar a evolução histórica consolidada e a
          comparação entre as 15 UBS no último mês disponível.
        </p>
      </header>
      <IndicatorList
        indicators={indicatorsList}
        history={historyData}
        ubs={ubsList}
      />
    </div>
  );
}
