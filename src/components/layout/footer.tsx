export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-zinc-200 bg-zinc-50 py-6 text-center text-sm leading-[1.75] text-zinc-600"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-y-1 break-words px-4 sm:px-8">
        <p className="w-full">Dados simulados para fins de demonstração. Para saber mais sobre o meu trabalho, visite <a className="underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" href="https://raigomes.dev">raigomes.dev</a></p>
        <p className="w-full">Fontes: CNES, e-SUS AB, DATASUS.</p>
        <p className="w-full">Protótipo v1.0 — Saúde Itapira</p>
      </div>
    </footer>
  );
}
