/** Minimal ProseMirror JSON node shape — enough to walk text content. */
type ProseMirrorNode = {
  type?: string;
  text?: string;
  content?: ProseMirrorNode[];
};

/** Flattens Tiptap/ProseMirror JSON into plain text, for excerpts and reading-time estimates. */
export function extractPlainText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as ProseMirrorNode;

  let text = n.text ?? "";
  if (n.content) {
    for (const child of n.content) {
      text += (text ? " " : "") + extractPlainText(child);
    }
  }
  return text.trim();
}

const WORDS_PER_MINUTE = 200;

export function estimateReadingMinutes(bodyJson: unknown): number {
  const words = extractPlainText(bodyJson).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function deriveExcerpt(bodyJson: unknown, maxLength = 180): string {
  const text = extractPlainText(bodyJson);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
