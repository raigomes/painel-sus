import type { UBS } from "@/lib/types";

export interface UBSInfoCardProps {
  ubs: UBS;
}

export function UBSInfoCard({ ubs }: UBSInfoCardProps) {
  const formattedRegistered = new Intl.NumberFormat("pt-BR").format(ubs.cadastrados);

  return (
    <article className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold leading-snug text-zinc-900 md:text-2xl">
          {ubs.nome}
        </h1>

        <dl className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="font-medium text-zinc-800">CNES</dt>
            <dd>{ubs.codigo}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-800">Equipe</dt>
            <dd>{ubs.equipe}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-800">Cadastrados</dt>
            <dd className="tabular-nums">{formattedRegistered}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="font-medium text-zinc-800">Endereço</dt>
            <dd>{ubs.endereco}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
