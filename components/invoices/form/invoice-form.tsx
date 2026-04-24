'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup } from '@/components/common/field-group'
import {
  invoiceInputSchema,
  invoiceStatuses,
  type Invoice,
  type InvoiceInput
} from '@/types/invoice'
import type { Client } from '@/types/client'
import { createInvoice, editInvoice } from '@/actions/invoices'

interface Props {
  initialData?: Invoice | null
  clients: Client[]
  onSuccess: () => void
}

function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

export function InvoiceForm({ initialData, clients, onSuccess }: Props) {
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
      amount: initialData?.amount || '',
      status: initialData?.status || 'draft',
      issuedDate: toDateInput(initialData?.issuedDate) || toDateInput(new Date()),
      dueDate: toDateInput(initialData?.dueDate),
      notes: initialData?.notes || ''
    }
  })

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

        <FieldGroup
          label="Amount"
          error={errors.amount?.message}
          required
        >
          <Input
            type="number"
            step="0.01"
            min="0"
            {...register('amount')}
          />
        </FieldGroup>

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

        <div className="sm:col-span-2">
          <FieldGroup
            label="Notes"
            error={errors.notes?.message}
          >
            <Textarea {...register('notes')} />
          </FieldGroup>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
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
