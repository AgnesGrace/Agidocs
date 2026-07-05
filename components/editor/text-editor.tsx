"use client"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"

import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListNode, ListItemNode } from "@lexical/list"
import { CodeNode } from "@lexical/code"
import { LinkNode, AutoLinkNode } from "@lexical/link"
import { TRANSFORMERS } from "@lexical/markdown"

import { editorTheme } from "../editor-theme"
import { ToolbarPlugin } from "./plugins/toolbar-plugin"
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin"
import { LinkPreviewPlugin } from "./plugins/link-preview-plugin"

const URL_MATCHER =
  /((https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}))/

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text)
    if (match === null) return null
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
    }
  },
]

export function TextEditor() {
  const initialConfig = {
    namespace: "GoogleDocsPlayground",
    theme: editorTheme,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      LinkNode,
      AutoLinkNode,
    ],
    onError: (error: Error) => console.error("Lexical Runtime Error:", error),
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-xl border bg-background shadow-md">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <LinkPreviewPlugin />

        <div className="relative min-h-[350px] flex-1 overflow-y-auto p-4 focus-within:ring-0">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[350px] resize-none text-foreground outline-none" />
            }
            placeholder={
              <div className="pointer-events-none absolute top-4 left-4 text-sm text-muted-foreground/60 select-none">
                Type text, use markdown syntax like # Heading or * list items...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin matchers={MATCHERS} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </LexicalComposer>
    </div>
  )
}
