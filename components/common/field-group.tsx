import { Label } from '@/components/ui/label'
interface FieldGroupProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FieldGroup({ label, error, required, children }: FieldGroupProps) {
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
