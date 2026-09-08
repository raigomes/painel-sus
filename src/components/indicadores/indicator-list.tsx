'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { IndicatorDetail } from '@/components/indicadores/indicator-detail';
import type { HistoryRecord, Indicator, UBS } from '@/lib/types';

const INDICATOR_ICONS: Record<Indicator['id'], string> = {
  'cobertura-vacinal': '💉',
  'pre-natal': '🤰',
  hipertensao: '❤️',
  diabetes: '🩸',
};

export interface IndicatorListProps {
  indicators: Indicator[];
  history: HistoryRecord[];
  ubs: UBS[];
}

export function IndicatorList({ indicators, history, ubs }: IndicatorListProps) {
  const [openId, setOpenId] = useState<Indicator['id'] | null>(null);

  function handleToggle(id: Indicator['id']) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-3">
      {indicators.map((indicator) => {
        const isOpen = openId === indicator.id;
        const buttonId = `btn-${indicator.id}`;
        const panelId = `panel-${indicator.id}`;

        return (
          <div key={indicator.id} className="w-full">
            <button
              type="button"
              id={buttonId}
              onClick={() => handleToggle(indicator.id)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-light"
                aria-hidden="true"
              >
                <span className="text-base leading-none">{INDICATOR_ICONS[indicator.id]}</span>
              </span>

              <div className="min-w-0 flex-1">
                <span className="block truncate text-base font-semibold text-zinc-900">
                  {indicator.nome}
                </span>
                <span className="block text-sm text-zinc-500">
                  Meta: {indicator.meta.toLocaleString('pt-BR')}% — {indicator.unidade}
                </span>
              </div>

              <ChevronDown
                className={`size-5 shrink-0 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={`btn-${indicator.id}`}
                className="mt-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <IndicatorDetail
                  indicator={indicator}
                  history={history}
                  ubs={ubs}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
