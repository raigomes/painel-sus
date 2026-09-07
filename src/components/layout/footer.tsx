export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm leading-relaxed text-zinc-500 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <p className="w-full">Dados simulados para fins de demonstração.</p>
        <p className="w-full">Fontes: CNES, e-SUS AB e DATASUS.</p>
        <p className="w-full">Protótipo v1.0 — Saúde Itapira</p>
      </div>
    </footer>
  );
}
