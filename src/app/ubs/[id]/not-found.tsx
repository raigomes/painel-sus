import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[1280px] bg-zinc-50 px-4 sm:px-8 py-16 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">UBS não encontrada</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Verifique o identificador informado ou volte para o painel principal.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  );
}
