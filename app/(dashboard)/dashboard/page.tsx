import { CircleDollarSign, Clock, TriangleAlert } from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { MetricCard } from '@/components/dashboard/metric-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { RevenueTrendChart } from '@/components/dashboard/revenue-trend-chart'
import { LatestInvoicesCard } from '@/components/dashboard/latest-invoices-card'
import { TopClientsCard } from '@/components/dashboard/top-clients-card'
import { getDashboardData } from '@/actions/dashboard'

export default async function DashboardPage() {
  const data = await getDashboardData()

  if (!data.hasInvoices) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Dashboard" description="Your revenue, pending balance, and recent activity." />
        <DashboardEmptyState />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Your revenue, pending balance, and recent activity." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard title="Total Revenue" icon={CircleDollarSign} amounts={data.metrics.totalRevenue} />
        <MetricCard title="Pending" icon={Clock} amounts={data.metrics.pending} />
        <MetricCard title="Overdue" icon={TriangleAlert} amounts={data.metrics.overdue} />
      </div>

      {data.trend && <RevenueTrendChart points={data.trend.points} currency={data.trend.primaryCurrency} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LatestInvoicesCard invoices={data.latestInvoices} />
        {data.topClients && (
          <TopClientsCard clients={data.topClients.clients} currency={data.topClients.primaryCurrency} />
        )}
      </div>
    </div>
  )
}
