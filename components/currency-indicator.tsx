"use client"

import { TrendingUp } from "lucide-react"

export function CurrencyIndicator() {
  // Este es un componente simple visual - en producción conectarías con una API real
  const usdToMxn = 17.25

  return (
    <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5 text-xs font-medium justify-center">
      <TrendingUp className="h-3.5 w-3.5 text-primary" />
      <span className="text-foreground/80"> USD/MXN: ${usdToMxn}
      </span>
    </div>
  )
}
