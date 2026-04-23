'use client'

//import { LogOut } from 'lucide-react'
//import { Button } from '@/components/ui/button'
import { UserButton, Show } from '@clerk/nextjs'
export function LogoutButton() {
  //const handleLogout = () => {}

  return (
    // <Button
    //   variant="ghost"
    //   className="w-full justify-start"
    //   onClick={handleLogout}
    // >
    //   <LogOut className="mr-2 h-4 w-4" />
    //   Logout
    // </Button>
    <Show when="signed-in">
      <UserButton />
    </Show>
  )
}
