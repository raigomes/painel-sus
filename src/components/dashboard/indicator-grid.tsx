import { IndicatorCard } from "@/components/dashboard/indicator-card";
import type { IndicatorDisplay } from "@/lib/types";

export interface IndicatorGridProps {
  items: IndicatorDisplay[];
}

export function IndicatorGrid({ items }: IndicatorGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {items.map((item) => (
        <IndicatorCard key={item.indicator.id} display={item} />
      ))}
    </div>
  );
}
