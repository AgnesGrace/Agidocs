import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      <SignIn />
    </div>
  )
}
