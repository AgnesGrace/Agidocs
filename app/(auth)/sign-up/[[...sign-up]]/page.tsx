import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-zinc-800">
      <SignUp />
    </div>
  )
}
