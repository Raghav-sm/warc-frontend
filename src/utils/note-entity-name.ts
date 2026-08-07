export const NOTE_ENTITY_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export const NOTE_ENTITY_NAME_MESSAGE = "Use only letters, numbers, hyphens, and underscores (no spaces)";

export function normalizeNoteTitle(input: string): string {
  const trimmed = input.trim();
  return trimmed.toLowerCase().endsWith(".md") ? trimmed.slice(0, -3) : trimmed;
}

export function formatNoteFileLabel(title: string): string {
  const base = normalizeNoteTitle(title);
  return base ? `${base}.md` : "untitled.md";
}
