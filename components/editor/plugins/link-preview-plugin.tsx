"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection } from "lexical"
import { $isLinkNode } from "@lexical/link"
import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

export function LinkPreviewPlugin() {
  const [editor] = useLexicalComposerContext()
  const [linkUrl, setLinkUrl] = useState<string | null>(null)
  const [position, setPosition] = useState<{
    top: number
    left: number
  } | null>(null)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode()
          const parentNode = anchorNode.getParent()

          const linkNode = $isLinkNode(anchorNode)
            ? anchorNode
            : $isLinkNode(parentNode)
              ? parentNode
              : null

          if (linkNode) {
            setLinkUrl(linkNode.getURL())

            const nativeSelection = window.getSelection()
            if (nativeSelection && nativeSelection.rangeCount > 0) {
              const range = nativeSelection.getRangeAt(0)
              const rect = range.getBoundingClientRect()
              setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
              })
            }
          } else {
            setLinkUrl(null)
            setPosition(null)
          }
        }
      })
    })
  }, [editor])

  if (!linkUrl || !position) return null

  return (
    <div
      className="absolute z-50 flex animate-in items-center gap-2 rounded-md border bg-popover p-2 text-xs shadow-md duration-150 fade-in-50"
      style={{ top: position.top, left: position.left }}
    >
      <span className="max-w-[180px] truncate text-muted-foreground">
        {linkUrl}
      </span>
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-medium text-primary hover:underline"
      >
        Open <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}
