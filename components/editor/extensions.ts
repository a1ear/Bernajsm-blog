import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

/**
 * The SAME extension list is used to edit (Tiptap in the browser) and to
 * render (generateHTML on the server) post bodies. Content is stored as
 * ProseMirror JSON, not raw HTML — rendering re-serializes it through this
 * schema, so there is no contentEditable-to-raw-HTML injection surface.
 */
export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
  }),
];
