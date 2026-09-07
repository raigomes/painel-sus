"use client"

import { useId } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Indicator } from "@/lib/types"

export interface IndicatorFilterProps {
  indicators: Indicator[]
  value: Indicator["id"]
  onChange(value: Indicator["id"]): void
}

export function IndicatorFilter({ indicators, value, onChange }: IndicatorFilterProps) {
  const labelId = useId()

  const handleChange = (nextValue: string | null) => {
    if (nextValue !== null && indicators.some((indicator) => indicator.id === nextValue)) {
      onChange(nextValue as Indicator["id"])
    }
  }

  return (
<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
       <label htmlFor={labelId} className="shrink-0 text-sm font-medium text-zinc-700">
         Indicador do gráfico
       </label>
       <Select value={value} onValueChange={handleChange}>
         <SelectTrigger id={labelId} className="h-11 min-h-11 w-full sm:w-[260px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {indicators.map((indicator) => (
            <SelectItem key={indicator.id} value={indicator.id}>
              {indicator.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
