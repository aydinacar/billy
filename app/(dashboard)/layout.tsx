import { cookies } from 'next/headers'
import { auth, currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

import { Topbar } from '@/components/layout/Topbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { SidebarProvider } from '@/components/layout/sidebar-context'
import { db } from '@/db'
import { usersTable } from '@/db/schema'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId || !user) {
    return null
  }

  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, userId)
  })
  if (!existingUser) {
    await db.insert(usersTable).values({
      clerkId: userId,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName + ' ' + user.lastName
    })
  }

  const cookieStore = await cookies()
  const defaultCollapsed = cookieStore.get('sidebar-collapsed')?.value === 'true'

  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
      <div className="h-screen flex bg-background overflow-hidden">
        <div className="hidden md:flex md:shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
