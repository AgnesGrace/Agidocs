import { EditorThemeClasses } from "lexical"

export const editorTheme: EditorThemeClasses = {
  ltr: "text-left",
  rtl: "text-right",
  placeholder:
    "text-muted-foreground absolute top-[52px] left-4 pointer-events-none select-none text-sm",
  paragraph: "relative m-0 mb-2 last:mb-0 text-sm leading-relaxed",
  quote:
    "border-l-4 border-primary pl-4 italic text-muted-foreground my-4 bg-muted/20 py-1 pr-2 rounded-r",
  heading: {
    h1: "scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl mb-4 mt-6 text-foreground",
    h2: "scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-3 mt-5 text-foreground",
    h3: "scroll-m-20 text-xl font-semibold tracking-tight mb-2 mt-4 text-foreground",
  },
  list: {
    nested: {
      listitem: "list-none before:hidden before:content-none",
    },
    ol: "list-decimal pl-6 my-2 space-y-1 text-sm text-foreground",
    ul: "list-disc pl-6 my-2 space-y-1 text-sm text-foreground",
    listitem: "text-sm leading-normal",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-muted font-mono px-1 py-0.5 rounded text-sm text-amber-600 dark:text-amber-400 font-medium",
  },
  code: "bg-muted font-mono block p-4 rounded-md text-sm leading-relaxed overflow-x-auto my-4 border text-foreground border-border",
  link: "text-primary underline underline-offset-4 cursor-pointer hover:text-primary/80 font-medium",
}
