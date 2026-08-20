"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichEditorProps {
  label?: string;
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichEditor({
  label = "Content",
  value,
  onChange,
  placeholder = "Write your rich formatted content here...",
}: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-medium",
          target: "_blank",
          rel: "noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose max-w-none min-h-[180px] p-3.5 focus:outline-none text-foreground leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Sync value if changed from outside (e.g. initial fetch)
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      if (editor.getHTML() !== value) {
        editor.commands.setContent(value || "");
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="space-y-1.5">
      {label && <Label className="text-xs font-semibold text-foreground">{label}</Label>}

      <div className="rounded-xl border border-border/70 bg-card overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 transition-all">
        {/* WYSIWYG Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-muted/40 border-b border-border/50">
          <Button
            type="button"
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-7 w-7", editor.isActive("bold") && "bg-primary/20 text-primary font-bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-7 w-7", editor.isActive("italic") && "bg-primary/20 text-primary font-bold")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>

          <div className="w-px h-4 bg-border/60 mx-1" />

          <Button
            type="button"
            variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-7 w-7", editor.isActive("heading", { level: 2 }) && "bg-primary/20 text-primary font-bold")}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-7 w-7", editor.isActive("heading", { level: 3 }) && "bg-primary/20 text-primary font-bold")}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </Button>

          <div className="w-px h-4 bg-border/60 mx-1" />

          <Button
            type="button"
            variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-7 w-7", editor.isActive("bulletList") && "bg-primary/20 text-primary font-bold")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-7 w-7", editor.isActive("orderedList") && "bg-primary/20 text-primary font-bold")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-7 w-7", editor.isActive("blockquote") && "bg-primary/20 text-primary font-bold")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-7 w-7", editor.isActive("codeBlock") && "bg-primary/20 text-primary font-bold")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          >
            <Code className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive("link") ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-7 w-7", editor.isActive("link") && "bg-primary/20 text-primary font-bold")}
            onClick={setLink}
            title="Insert Link"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </Button>

          <div className="flex-1" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Visual ContentEditable Area (No raw HTML tags shown!) */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}