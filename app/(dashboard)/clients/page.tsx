import { Client, columns } from '@/components/clients/table/columns'
import { DataTable } from '@/components/clients/table/data-table'
async function getData(): Promise<Client[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    }
    // ...
  ]
}
export default async function ClientsPage() {
  const data = await getData()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold">Clients</h1>
      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  )
}
