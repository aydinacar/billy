import { redirect } from 'next/navigation'

import { PageHeader } from '@/components/common/page-header'
import { BusinessProfileForm } from '@/components/settings/business-profile-form'
import { getBusinessProfile } from '@/actions/business-profile'

export default async function SettingsPage() {
  const profile = await getBusinessProfile()
  if (!profile) redirect('/sign-in')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Business profile shown on invoices and the public payment page."
      />
      <BusinessProfileForm initialData={profile} />
    </div>
  )
}
