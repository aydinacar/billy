'use client'

import { type Control, type FieldErrors, type UseFormRegister, useFieldArray, useWatch } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ItemsTotal } from './items-total'
import type { InvoiceInput } from '@/types/invoice'

const emptyItem = { description: '', quantity: '1', unitPrice: '' }

interface Props {
  control: Control<InvoiceInput>
  register: UseFormRegister<InvoiceInput>
  errors: FieldErrors<InvoiceInput>
  currency?: string
}

export function InvoiceItemsField({ control, register, errors, currency = 'USD' }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>
          Line Items<span className="text-destructive ml-1">*</span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ ...emptyItem })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add item
        </Button>
      </div>

      <div className="rounded-md border divide-y">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-3 grid grid-cols-12 gap-2 items-start"
          >
            <div className="col-span-12 sm:col-span-6">
              <Input
                placeholder="Description"
                {...register(`items.${index}.description`)}
              />
              {errors.items?.[index]?.description && (
                <p className="text-sm text-destructive mt-1">{errors.items[index]?.description?.message}</p>
              )}
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Qty"
                {...register(`items.${index}.quantity`)}
              />
              {errors.items?.[index]?.quantity && (
                <p className="text-sm text-destructive mt-1">{errors.items[index]?.quantity?.message}</p>
              )}
            </div>
            <div className="col-span-6 sm:col-span-3">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Unit price"
                {...register(`items.${index}.unitPrice`)}
              />
              {errors.items?.[index]?.unitPrice && (
                <p className="text-sm text-destructive mt-1">{errors.items[index]?.unitPrice?.message}</p>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {errors.items?.message && <p className="text-sm text-destructive">{errors.items.message}</p>}

      <ItemsTotal
        control={control}
        currency={currency}
      />
    </div>
  )
}
