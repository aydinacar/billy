'use client'

import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup } from '@/components/common/field-group'
import {
  invoiceInputSchema,
  invoiceStatuses,
  type InvoiceInput,
  type InvoiceWithClient
} from '@/types/invoice'
import type { Client } from '@/types/client'
import { createInvoice, editInvoice } from '@/actions/invoices'

interface Props {
  initialData?: InvoiceWithClient | null
  clients: Client[]
  onSuccess: () => void
  onCancel: () => void
}

const emptyItem = { description: '', quantity: '1', unitPrice: '' }

const amountFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

export function InvoiceForm({ initialData, clients, onSuccess, onCancel }: Props) {
  const isEditMode = !!initialData

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceInputSchema),
    defaultValues: {
      clientId: initialData?.clientId || '',
      invoiceNumber: initialData?.invoiceNumber || '',
      status: initialData?.status || 'draft',
      issuedDate: toDateInput(initialData?.issuedDate) || toDateInput(new Date()),
      dueDate: toDateInput(initialData?.dueDate),
      notes: initialData?.notes || '',
      items:
        initialData?.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })) || [emptyItem]
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  async function onSubmit(data: InvoiceInput) {
    const payload = {
      ...data,
      notes: data.notes || undefined
    }
    try {
      if (isEditMode) {
        await editInvoice({ id: initialData.id, ...payload })
      } else {
        await createInvoice(payload)
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving invoice:', error)
      toast.error(isEditMode ? 'Failed to update invoice' : 'Failed to create invoice')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup
          label="Client"
          error={errors.clientId?.message}
          required
        >
          <Controller
            control={control}
            name="clientId"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(c => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FieldGroup>

        <FieldGroup
          label="Invoice Number"
          error={errors.invoiceNumber?.message}
          required
        >
          <Input {...register('invoiceNumber')} />
        </FieldGroup>

        <div className="sm:col-span-2">
          <FieldGroup
            label="Status"
            error={errors.status?.message}
            required
          >
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceStatuses.map(s => (
                      <SelectItem
                        key={s}
                        value={s}
                        className="capitalize"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldGroup>
        </div>

        <FieldGroup
          label="Issue Date"
          error={errors.issuedDate?.message}
          required
        >
          <Input
            type="date"
            {...register('issuedDate')}
          />
        </FieldGroup>

        <FieldGroup
          label="Due Date"
          error={errors.dueDate?.message}
          required
        >
          <Input
            type="date"
            {...register('dueDate')}
          />
        </FieldGroup>
      </div>

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

        <InvoiceTotal control={control} />
      </div>

      <FieldGroup
        label="Notes"
        error={errors.notes?.message}
      >
        <Textarea {...register('notes')} />
      </FieldGroup>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
        >
          {isEditMode ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}

function InvoiceTotal({ control }: { control: ReturnType<typeof useForm<InvoiceInput>>['control'] }) {
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
        <span className="font-medium">{amountFormatter.format(total)}</span>
      </div>
    </div>
  )
}
