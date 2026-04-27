'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { formatMoney } from '@/utils/money'
import type { TrendPoint } from '@/actions/dashboard'

interface Props {
  points: TrendPoint[]
  currency: string
}

const config = {
  amount: {
    label: 'Revenue',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig

function formatMonthLabel(key: string) {
  const [year, month] = key.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return date.toLocaleString('en-US', { month: 'short' })
}

export function RevenueTrendChart({ points, currency }: Props) {
  const data = points.map((p) => ({ ...p, label: formatMonthLabel(p.month) }))

  return (
    <div className="rounded-lg border bg-card p-6 flex flex-col gap-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Revenue (last 12 months)</h3>
        <p className="text-xs text-muted-foreground">Paid amounts in {currency}</p>
      </div>
      <ChartContainer config={config} className="h-64 w-full">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={64}
            tickFormatter={(value: number) =>
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value)
            }
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => formatMoney(Number(value), currency)}
                labelFormatter={(label) => label}
              />
            }
          />
          <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
