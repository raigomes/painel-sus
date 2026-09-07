import { historyData } from "@/data/history";
import { indicatorsList } from "@/data/indicators";
import { ubsList } from "@/data/ubs";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 md:space-y-8 lg:px-8 xl:py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl">
          Painel SUS
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-zinc-600">
          Acompanhe os indicadores do Previne Brasil da Saúde Itapira no período de julho de 2025 a junho de 2026.
        </p>
      </header>
      <DashboardClient ubs={ubsList} indicators={indicatorsList} history={historyData} />
    </div>
  );
}
