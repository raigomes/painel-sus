import Link from "next/link";
import { notFound } from "next/navigation";
import { ubsList } from "@/data/ubs";
import { indicatorsList } from "@/data/indicators";
import { historyData } from "@/data/history";
import { UBSInfoCard } from "@/components/ubs/ubs-info-card";
import { RadarChartInner as RadarChart } from "@/components/ubs/radar-chart-client";
import { HistoryTable } from "@/components/ubs/history-table";
import type { RadarDataPoint } from "@/lib/types";

interface UBSPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: UBSPageProps) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);

  if (!Number.isFinite(id) || id <= 0 || !Number.isInteger(id)) {
    return { title: "UBS não encontrada — Painel SUS" };
  }

  const ubs = ubsList.find((u) => u.id === id);

  if (!ubs) {
    return { title: "UBS não encontrada — Painel SUS" };
  }

  return {
    title: `${ubs.nome} — Painel SUS`,
    description: `Detalhes da ${ubs.nome} (CNES ${ubs.codigo}) no Painel SUS.`,
  };
}

export default async function UBSPage({ params }: UBSPageProps) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);

  if (!Number.isFinite(id) || id <= 0 || !Number.isInteger(id)) {
    notFound();
  }

  const ubs = ubsList.find((u) => u.id === id);

  if (!ubs) {
    notFound();
  }

  // Dados filtrados por esta UBS
  const ubsRecords = historyData.filter((r) => r.ubsId === ubs.id);

  // Radar: último mês disponível — 4 eixos com valor e meta
  const allMonths = [...new Set(ubsRecords.map((r) => r.mes))].sort();
  const latestMonth = allMonths[allMonths.length - 1] ?? "";

  const radarData: RadarDataPoint[] = indicatorsList.map((indicator) => {
    const record = ubsRecords.find(
      (r) => r.indicatorId === indicator.id && r.mes === latestMonth,
    );
    return {
      indicador: indicator.nome,
      valor: record?.valor ?? 0,
      meta: indicator.meta,
    };
  });

  // Tabela: 12 meses completos
  const tableRecords = [...ubsRecords].sort((a, b) =>
    a.mes.localeCompare(b.mes),
  );

  return (
    <div className="mx-auto w-full max-w-[1280px] bg-zinc-50 px-4 sm:px-8 py-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-zinc-600">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link
              href="/"
              className="font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-400 select-none" role="separator">
            &gt;
          </li>
          <li>
            <span className="font-medium text-zinc-700">UBS</span>
          </li>
          <li aria-hidden="true" className="text-zinc-400 select-none" role="separator">
            &gt;
          </li>
          <li aria-current="page" className="font-medium text-zinc-900">
            {ubs.nome}
          </li>
        </ol>
      </nav>
      <UBSInfoCard ubs={ubs} />
      <div className="mt-6 flex flex-col gap-6">
        <RadarChart data={radarData} ubsName={ubs.nome} />
        <HistoryTable records={tableRecords} indicators={indicatorsList} />
      </div>
    </div>
  );
}
