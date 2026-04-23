import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="h-screen w-full flex items-center justify-between">
      <div className="mx-auto w-full max-w-md px-4">
        <SignUp />
      </div>
    </div>
  )
}
