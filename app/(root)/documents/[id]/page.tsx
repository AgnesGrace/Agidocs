import { TextEditor } from "@/components/editor/text-editor"
import Header from "@/components/header/header"
import { Button } from "@/components/ui/button"

import { Show, SignInButton, UserButton } from "@clerk/nextjs"

export default function Document() {
  return (
    <div>
      <Header>
        <nav className="flex items-center gap-4">
          <h3>untitled</h3>
          <Button>Share now</Button>
          <Show when="signed-out">
            <SignInButton />
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </Header>
      <TextEditor />
    </div>
  )
}
