"use client"

import { useId } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PERIOD_LABELS } from "@/lib/constants"
import type { PeriodFilter as PeriodFilterValue } from "@/lib/types"

export interface PeriodFilterProps {
  value: PeriodFilterValue
  onChange(value: PeriodFilterValue): void
}

const periods: PeriodFilterValue[] = [
  "ultimo-mes",
  "ultimo-trimestre",
  "ultimo-semestre",
  "ultimo-ano",
]

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const labelId = useId()
  const selectedLabel = PERIOD_LABELS[value]

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto lg:w-[180px]">
      <label htmlFor={labelId} className="sr-only">
        Período
      </label>
      <Select value={value} onValueChange={(nextValue) => {
        if (nextValue !== null && periods.includes(nextValue as PeriodFilterValue)) {
          onChange(nextValue as PeriodFilterValue)
        }
      }}>
        <SelectTrigger id={labelId} className="min-h-11 w-full lg:w-[180px]">
           <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {periods.map((period) => (
            <SelectItem key={period} value={period}>
              {PERIOD_LABELS[period]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
