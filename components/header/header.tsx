import { PageHeaderProps } from "@/types"
import Link from "next/link"

export default function Header({ children }: PageHeaderProps) {
  return (
    <header className="bg-dark-100 flex min-h-[96px] w-full min-w-full flex-nowrap items-center justify-between gap-2 px-4">
      <Link href="/">Agidoc</Link>
      {children}
    </header>
  )
}
