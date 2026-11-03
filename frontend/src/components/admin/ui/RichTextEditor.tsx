"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none dark:prose-invert",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 dark:border-teal-800",
        className
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50 p-2 dark:border-teal-800 dark:bg-teal-900/40">
        {[
          { label: "B", action: () => editor.chain().focus().toggleBold().run() },
          { label: "I", action: () => editor.chain().focus().toggleItalic().run() },
          { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
          { label: "•", action: () => editor.chain().focus().toggleBulletList().run() },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className="rounded-lg px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-white dark:text-teal-200 dark:hover:bg-teal-800"
          >
            {btn.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
