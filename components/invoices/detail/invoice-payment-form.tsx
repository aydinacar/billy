'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup } from '@/components/common/field-group'
import { paymentInputSchema, type PaymentInput } from '@/types/payment'
import { paymentMethods } from '@/constants/payment'
import { toDateInput } from '@/utils/date'
import { recordPayment } from '@/actions/payments'

interface Props {
  invoiceId: string
  amountDue: number
  onSuccess: () => void
  onCancel: () => void
}

export function InvoicePaymentForm({ invoiceId, amountDue, onSuccess, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentInputSchema),
    defaultValues: {
      invoiceId,
      amount: amountDue > 0 ? amountDue.toFixed(2) : '',
      paymentDate: toDateInput(new Date()),
      paymentMethod: 'Bank Transfer'
    }
  })

  async function onSubmit(data: PaymentInput) {
    try {
      await recordPayment({
        ...data,
        paymentMethod: data.paymentMethod || undefined
      })
      onSuccess()
    } catch (error) {
      console.error('Error recording payment:', error)
      toast.error('Failed to record payment')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          label="Payment Date"
          error={errors.paymentDate?.message}
          required
        >
          <Input
            type="date"
            {...register('paymentDate')}
          />
        </FieldGroup>

        <div className="sm:col-span-2">
          <FieldGroup
            label="Method"
            error={errors.paymentMethod?.message}
          >
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem
                        key={method}
                        value={method}
                      >
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldGroup>
        </div>
      </div>

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
          Record payment
        </Button>
      </div>
    </form>
  )
}
