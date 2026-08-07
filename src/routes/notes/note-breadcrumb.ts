import type { FolderNode } from "./NotesSidebar";

export function getNoteFolderPath(folderId: string | null | undefined, folders: FolderNode[]): string[] {
  const byId = new Map<string, FolderNode>();

  const walk = (nodes: FolderNode[]) => {
    for (const folder of nodes) {
      byId.set(folder.id, folder);
      if (folder.children.length > 0) walk(folder.children);
    }
  };

  walk(folders);

  const path: string[] = [];
  let currentId = folderId ?? null;

  while (currentId) {
    const folder = byId.get(currentId);
    if (!folder) break;
    path.unshift(folder.name);
    currentId = folder.parentId ?? null;
  }

  return path;
}
