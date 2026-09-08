import { historyData } from "@/data/history";
import { indicatorsList } from "@/data/indicators";
import { ubsList } from "@/data/ubs";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1280px] bg-zinc-50 px-4 sm:px-8 py-6">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold leading-tight text-zinc-900">
          Painel SUS
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-500">
          Acompanhe os indicadores do Previne Brasil da Saúde Itapira no período de julho de 2025 a junho de 2026.
        </p>
      </header>
      <DashboardClient
        ubs={ubsList}
        indicators={indicatorsList}
        history={historyData}
        className="space-y-6"
      />
    </div>
  );
}
