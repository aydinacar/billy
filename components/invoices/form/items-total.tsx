import { formatMoney } from '@/utils/money'
import { type Control, useWatch } from 'react-hook-form'
import type { InvoiceInput } from '@/types/invoice'
export function ItemsTotal({ control, currency }: { control: Control<InvoiceInput>; currency: string }) {
  const items = useWatch({ control, name: 'items' }) ?? []
  const total = items.reduce((sum, item) => {
    const q = Number(item?.quantity) || 0
    const p = Number(item?.unitPrice) || 0
    return sum + q * p
  }, 0)

  return (
    <div className="flex justify-end pt-2">
      <div className="text-sm">
        <span className="text-muted-foreground mr-2">Total:</span>
        <span className="font-medium">{formatMoney(total, currency)}</span>
      </div>
    </div>
  )
}
