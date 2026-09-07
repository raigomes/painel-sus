"use client";

export interface EmptyStateProps {
  onClear(): void;
}

export function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <section
      aria-labelledby="empty-state-title"
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-white p-6 text-center"
    >
      <div className="space-y-2">
        <h2 id="empty-state-title" className="text-xl font-semibold text-zinc-800">
          Nenhum registro encontrado
        </h2>
        <p className="text-base text-zinc-600">
          Não há registros para os filtros selecionados.
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="min-h-11 min-w-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Limpar filtros
      </button>
    </section>
  );
}
