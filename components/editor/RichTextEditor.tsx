"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useTransition } from "react";

import { editorExtensions } from "./extensions";
import { uploadMediaImage } from "@/app/bjsm-write/(dashboard)/posts/actions";

type RichTextEditorProps = {
  initialContent: unknown;
  onChange: (json: unknown) => void;
};

function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-forest text-warm-white" : "text-ink-soft hover:bg-cream-alt hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const [uploading, startUpload] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: editorExtensions,
    content: (initialContent as never) ?? { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-content min-h-[320px] rounded-b-lg bg-warm-white px-5 py-4 text-ink outline-none [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;

    setUploadError(null);
    startUpload(async () => {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadMediaImage(formData);
      if (!result.ok) {
        setUploadError(result.error);
        return;
      }
      editor.chain().focus().setImage({ src: result.url, alt: file.name }).run();
    });
  }

  if (!editor) {
    return (
      <div className="min-h-[360px] animate-pulse rounded-lg border border-ink/15 bg-cream-alt" />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink/15">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink/10 bg-cream-alt px-2 py-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          label="Heading"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="Subheading"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
        >
          Link
        </ToolbarButton>
        <label className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink">
          {uploading ? "Uploading…" : "Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleImagePick}
          />
        </label>
      </div>
      {uploadError ? (
        <p role="alert" className="border-b border-red-900/15 bg-red-900/5 px-4 py-2 text-xs text-red-900">
          {uploadError}
        </p>
      ) : null}
      <EditorContent editor={editor} />
    </div>
  );
}
