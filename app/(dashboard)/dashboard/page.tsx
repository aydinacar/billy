export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        This is your dashboard where you can manage your invoices, clients, and payments.
      </p>
    </div>
  )
}
