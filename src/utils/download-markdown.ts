import { formatNoteFileLabel } from "@/utils/note-entity-name";

export function downloadAsMarkdownFile(title: string, content: string) {
  const filename = formatNoteFileLabel(title);
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
