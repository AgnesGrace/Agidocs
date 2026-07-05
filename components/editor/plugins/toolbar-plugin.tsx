"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical"
import { $setBlocksType } from "@lexical/selection"
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text"
import { $createParagraphNode } from "lexical"
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list"
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link"
import {} from "@lexical/link"

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  TextQuote,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCallback, useEffect, useState } from "react"

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [blockType, setBlockType] = useState("paragraph")

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
      setIsStrikethrough(selection.hasFormat("strikethrough"))
      setIsCode(selection.hasFormat("code"))

      const anchorNode = selection.anchor.getNode()
      const parentNode = anchorNode.getParent()
      const isLinkSelection = $isLinkNode(anchorNode) || $isLinkNode(parentNode)

      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      const type = element.getType()
      setBlockType(type)
    }
  }, [])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar()
        return false
      },
      1
    )
  }, [editor, updateToolbar])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateToolbar())
    })
  }, [editor, updateToolbar])

  const formatBlock = (value: string | null) => {
    if (!value) return

    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        if (value === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode())
        } else if (value === "h1" || value === "h2" || value === "h3") {
          $setBlocksType(selection, () =>
            $createHeadingNode(value as HeadingTagType)
          )
        } else if (value === "quote") {
          $setBlocksType(selection, () => $createQuoteNode())
        } else if (value === "bullet") {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        } else if (value === "number") {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      }
    })
  }

  const toggleLink = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        const parentNode = anchorNode.getParent()
        const hasLinkActive = $isLinkNode(anchorNode) || $isLinkNode(parentNode)

        if (hasLinkActive) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
        } else {
          const inputUrl = prompt("Enter the URL:")
          if (!inputUrl) return

          const trimmedUrl = inputUrl.trim()
          const hasProtocol = /^https?:\/\//i.test(trimmedUrl)
          const validatedUrl = hasProtocol
            ? trimmedUrl
            : `https://${trimmedUrl}`

          editor.dispatchCommand(TOGGLE_LINK_COMMAND, validatedUrl)
        }
      }
    })
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-lg border-b bg-muted/40 p-1.5 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Typography Selector */}
      <Select value={blockType} onValueChange={formatBlock}>
        <SelectTrigger className="h-8 w-[130px] text-xs font-medium">
          <SelectValue placeholder="Normal Text" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="paragraph"
            className="flex items-center gap-2 text-xs"
          >
            <Type className="mr-1 inline h-3 w-3" /> Normal
          </SelectItem>
          <SelectItem value="h1" className="text-xs font-bold">
            <Heading1 className="mr-1 inline h-3 w-3" /> Heading 1
          </SelectItem>
          <SelectItem value="h2" className="text-xs font-semibold">
            <Heading2 className="mr-1 inline h-3 w-3" /> Heading 2
          </SelectItem>
          <SelectItem value="h3" className="text-xs font-medium">
            <Heading3 className="mr-1 inline h-3 w-3" /> Heading 3
          </SelectItem>
          <SelectItem value="quote" className="text-xs italic">
            <TextQuote className="mr-1 inline h-3 w-3" /> Quote
          </SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant={isBold ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={isItalic ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={isUnderline ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant={isStrikethrough ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant={isCode ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={toggleLink}
      >
        <Link className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant={blockType === "bullet" ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => formatBlock("bullet")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={blockType === "number" ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => formatBlock("number")}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </div>
  )
}
