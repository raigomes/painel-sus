"use client"

import { useId } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UBS } from "@/lib/types"

export interface UBSFilterProps {
  ubs: UBS[]
  value: number | null
  onChange(value: number | null): void
}

export function UBSFilter({ ubs, value, onChange }: UBSFilterProps) {
  const labelId = useId()
  const selectValue = value === null ? "all" : String(value)
  const selectedLabel = value === null
    ? "Todas as UBS"
    : ubs.find((unit) => unit.id === value)?.nome ?? "Todas as UBS"

  const handleChange = (nextValue: string | null) => {
    if (nextValue === null || nextValue === "all") {
      onChange(null)
      return
    }

    const nextId = Number(nextValue)
    onChange(Number.isSafeInteger(nextId) ? nextId : null)
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto lg:w-[200px]">
      <label htmlFor={labelId} className="sr-only">
        UBS
      </label>
      <Select value={selectValue} onValueChange={handleChange}>
        <SelectTrigger id={labelId} className="min-h-11 w-full lg:w-[200px]">
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as UBS</SelectItem>
          {ubs.map((unit) => (
            <SelectItem key={unit.id} value={String(unit.id)}>
              {unit.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
