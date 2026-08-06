import { Archive, Code, File, FileText, Image, Link as LinkIcon, type LucideIcon, Music, Sheet, Video } from "lucide-react";

function normalizeExtension(fileTypeOrExt: string): string {
  const value = fileTypeOrExt.toLowerCase().trim();

  if (value === "link") {
    return "link";
  }

  if (value.includes("/")) {
    const [category, subtype] = value.split("/");
    if (category === "image") return "image";
    if (category === "video") return "video";
    if (category === "audio") return "audio";
    if (subtype) return subtype.replace(/^\./, "");
  }

  if (value.includes(".")) {
    return value.split(".").pop()?.replace(/^\./, "") ?? value;
  }

  return value.replace(/^\./, "");
}

export function fileTypeIcon(fileTypeOrExt: string | null | undefined): LucideIcon {
  const ext = normalizeExtension(fileTypeOrExt ?? "");

  if (ext === "link") return LinkIcon;
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif", "ico", "image"].includes(ext)) return Image;
  if (["pdf", "doc", "docx", "txt", "md", "rtf"].includes(ext)) return FileText;
  if (["xls", "xlsx", "csv", "ods"].includes(ext)) return Sheet;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return Archive;
  if (["mp4", "mov", "avi", "webm", "mkv", "video"].includes(ext)) return Video;
  if (["mp3", "wav", "ogg", "flac", "aac", "audio"].includes(ext)) return Music;
  if (
    [
      "js",
      "ts",
      "tsx",
      "jsx",
      "py",
      "rb",
      "go",
      "java",
      "c",
      "cpp",
      "cs",
      "php",
      "html",
      "css",
      "json",
      "xml",
      "yaml",
      "yml",
    ].includes(ext)
  ) {
    return Code;
  }

  return File;
}
