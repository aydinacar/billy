'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ClientDto } from '@/types/client'
import { createClient, editClient } from '@/actions/clients'
const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50),
  email: z.email('Invalid email'),
  taxNumber: z.string().max(50).optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal(''))
})

type FormInput = z.infer<typeof schema>

interface ClientFormProps {
  initialData?: ClientDto | null
  onSuccess: () => void
}

export function ClientForm({ initialData, onSuccess }: ClientFormProps) {
  const isEditMode = !!initialData

  async function onSubmit(data: FormInput) {
    try {
      if (isEditMode) {
        await editClient({ id: initialData.id, ...data })
      } else {
        await createClient(data)
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving client:', error)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      taxNumber: initialData?.taxNumber || '',
      address: initialData?.address || ''
    }
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup
          label="Name"
          error={errors.name?.message}
          required
        >
          <Input
            {...register('name')}
            autoFocus
          />
        </FieldGroup>

        <FieldGroup
          label="Email"
          error={errors.email?.message}
          required
        >
          <Input
            type="email"
            {...register('email')}
          />
        </FieldGroup>

        <FieldGroup
          label="Tax Number"
          error={errors.taxNumber?.message}
          required
        >
          <Input {...register('taxNumber')} />
        </FieldGroup>

        <FieldGroup
          label="Address"
          error={errors.address?.message}
        >
          <Textarea {...register('address')} />
        </FieldGroup>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit">{isEditMode ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}

interface FieldGroupProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function FieldGroup({ label, error, required, children }: FieldGroupProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
