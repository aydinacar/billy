'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup } from '@/components/common/field-group'
import { businessProfileSchema, type BusinessProfileInput, type UserRow } from '@/types/business-profile'
import { updateBusinessProfile } from '@/actions/business-profile'

interface Props {
  initialData: UserRow
}

export function BusinessProfileForm({ initialData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<BusinessProfileInput>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      businessName: initialData.businessName ?? '',
      businessEmail: initialData.businessEmail ?? '',
      businessPhone: initialData.businessPhone ?? '',
      businessAddress: initialData.businessAddress ?? '',
      businessTaxNumber: initialData.businessTaxNumber ?? ''
    }
  })

  async function onSubmit(data: BusinessProfileInput) {
    try {
      await updateBusinessProfile(data)
      toast.success('Business profile updated')
    } catch (error) {
      console.error('Error updating business profile:', error)
      toast.error('Failed to update business profile')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup
          label="Business Name"
          error={errors.businessName?.message}
        >
          <Input
            {...register('businessName')}
            placeholder="e.g. Acme LLC"
          />
        </FieldGroup>

        <FieldGroup
          label="Business Email"
          error={errors.businessEmail?.message}
        >
          <Input
            type="email"
            {...register('businessEmail')}
            placeholder="billing@acme.com"
          />
        </FieldGroup>

        <FieldGroup
          label="Phone"
          error={errors.businessPhone?.message}
        >
          <Input
            {...register('businessPhone')}
            placeholder="+1 555 123 4567"
          />
        </FieldGroup>

        <FieldGroup
          label="Tax Number"
          error={errors.businessTaxNumber?.message}
        >
          <Input
            {...register('businessTaxNumber')}
            placeholder="TR1234567890"
          />
        </FieldGroup>

        <div className="sm:col-span-2">
          <FieldGroup
            label="Address"
            error={errors.businessAddress?.message}
          >
            <Textarea
              {...register('businessAddress')}
              rows={3}
              placeholder="Street, City, Postal Code, Country"
            />
          </FieldGroup>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
        >
          Save changes
        </Button>
      </div>
    </form>
  )
}
