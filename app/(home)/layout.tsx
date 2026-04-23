import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function HomeLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton>
            <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <UserButton />
        </Show>
      </header>
      <main>{children}</main>
    </div>
  )
}
