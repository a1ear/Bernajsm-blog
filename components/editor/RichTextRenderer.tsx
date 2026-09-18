import { generateHTML } from "@tiptap/html";

import { editorExtensions } from "./extensions";

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

/** Server-rendered article body from Tiptap/ProseMirror JSON. */
export function RichTextRenderer({ bodyJson }: { bodyJson: unknown }) {
  const doc =
    bodyJson && typeof bodyJson === "object" ? bodyJson : EMPTY_DOC;

  let html: string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html = generateHTML(doc as any, editorExtensions);
  } catch {
    html = "";
  }

  return (
    <div
      className="prose-content max-w-none text-ink [&_a]:text-forest [&_a]:underline [&_a]:decoration-forest/40 [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-forest/30 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-ink-soft [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_img]:my-6 [&_li]:leading-relaxed [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_ul]:list-disc [&_ul]:pl-6 [&>*+*]:mt-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
