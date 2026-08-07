import { useMutation } from "@apollo/client";
import {
  ChevronRight,
  FileText,
  Folder,
  FolderPlus,
  MoreHorizontal,
  PanelLeftClose,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { type DragEvent, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { FormDialog } from "@/components/FormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/classnames";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import {
  formatNoteFileLabel,
  NOTE_ENTITY_NAME_MESSAGE,
  NOTE_ENTITY_NAME_REGEX,
  normalizeNoteTitle,
} from "@/utils/note-entity-name";
import { MESSAGE_MAP } from "@/utils/validation";

import {
  CREATE_FOLDER_MUTATION,
  CREATE_NOTE_MUTATION,
  DELETE_FOLDER_MUTATION,
  DELETE_NOTE_MUTATION,
  UPDATE_FOLDER_MUTATION,
  UPDATE_NOTE_MUTATION,
} from "./notes-query";

export type FolderNode = {
  id: string;
  name: string;
  parentId?: string | null;
  noteCount: number;
  children: FolderNode[];
};

export type NoteListItem = {
  id: string;
  title: string;
  folderId?: string | null;
};

const folderNameField = z
  .string(MESSAGE_MAP.REQUIRED("Name"))
  .trim()
  .min(1, MESSAGE_MAP.MIN("name", 1))
  .max(100, MESSAGE_MAP.MAX("name", 100))
  .regex(NOTE_ENTITY_NAME_REGEX, NOTE_ENTITY_NAME_MESSAGE);

const noteTitleField = z
  .string(MESSAGE_MAP.REQUIRED("File name"))
  .trim()
  .min(1, MESSAGE_MAP.MIN("title", 1))
  .max(200, MESSAGE_MAP.MAX("title", 200))
  .regex(NOTE_ENTITY_NAME_REGEX, NOTE_ENTITY_NAME_MESSAGE);

const CreateFolderSchema = z.object({ name: folderNameField });
const CreateNoteSchema = z.object({ title: noteTitleField });
const RenameFolderSchema = z.object({ name: folderNameField });
const RenameNoteSchema = z.object({ title: noteTitleField });

const NAME_HELPER_TEXT = "No spaces. Use letters, numbers, - and _.";

type NotesSidebarProps = {
  folders: FolderNode[];
  notes: NoteListItem[];
  activeNoteId?: string | null;
  onSelectNote: (noteId: string) => void;
  onClearActiveNote: () => void;
  onCollapse: () => void;
};

type DeleteTarget =
  | { type: "note"; id: string; label: string }
  | { type: "folder"; id: string; label: string; affectedNoteIds: string[] };

type DragItem = { type: "note" | "folder"; id: string };

type ExplorerDragProps = {
  draggingItem: DragItem | null;
  dragOverId: string | "root" | null;
  onDragStartItem: (item: DragItem, event: DragEvent) => void;
  onDragOverTarget: (targetId: string | "root", event: DragEvent) => void;
  onDropOnFolder: (targetFolderId: string | null, event: DragEvent) => void;
  onDragEndItem: () => void;
  canDropOnFolder: (folderId: string) => boolean;
};

function collectFolderIds(folder: FolderNode): string[] {
  return [folder.id, ...folder.children.flatMap(collectFolderIds)];
}

function indentStyle(depth: number, extra = 4) {
  return { paddingLeft: `${depth * 16 + extra}px` };
}

function RowActionsMenu({
  onNewFile,
  onNewSubfolder,
  onRename,
  onDelete,
  align = "end",
}: {
  onNewFile?: () => void;
  onNewSubfolder?: () => void;
  onRename: () => void;
  onDelete: () => void;
  align?: "start" | "end";
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 shrink-0"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {onNewFile ? (
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onNewFile();
            }}
          >
            <Plus className="size-3.5" />
            New file
          </DropdownMenuItem>
        ) : null}
        {onNewSubfolder ? (
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onNewSubfolder();
            }}
          >
            <FolderPlus className="size-3.5" />
            New subfolder
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onRename();
          }}
        >
          <Pencil className="size-3.5" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="size-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FolderContextActions({
  onNewFile,
  onNewSubfolder,
  onRename,
  onDelete,
}: {
  onNewFile: () => void;
  onNewSubfolder: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <ContextMenuContent>
      <ContextMenuItem onSelect={onNewFile}>
        <Plus className="size-3.5" />
        New file
      </ContextMenuItem>
      <ContextMenuItem onSelect={onNewSubfolder}>
        <FolderPlus className="size-3.5" />
        New subfolder
      </ContextMenuItem>
      <ContextMenuItem onSelect={onRename}>
        <Pencil className="size-3.5" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem variant="destructive" onSelect={onDelete}>
        <Trash2 className="size-3.5" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
}

function NoteContextActions({ onRename, onDelete }: { onRename: () => void; onDelete: () => void }) {
  return (
    <ContextMenuContent>
      <ContextMenuItem onSelect={onRename}>
        <Pencil className="size-3.5" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem variant="destructive" onSelect={onDelete}>
        <Trash2 className="size-3.5" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
}

function NoteRow({
  note,
  isActive,
  depth,
  onSelect,
  onRename,
  onDelete,
  draggingItem,
  dragOverId,
  onDragStartItem,
  onDragOverTarget,
  onDropOnFolder,
  onDragEndItem,
}: {
  note: NoteListItem;
  isActive: boolean;
  depth: number;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
} & ExplorerDragProps) {
  const isDragging = draggingItem?.type === "note" && draggingItem.id === note.id;
  const isDropTarget = dragOverId === note.id;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          draggable
          onDragStart={(event) => onDragStartItem({ type: "note", id: note.id }, event)}
          onDragEnd={onDragEndItem}
          onDragOver={(event) => {
            if (!draggingItem) return;
            onDragOverTarget(note.id, event);
          }}
          onDrop={(event) => onDropOnFolder(note.folderId ?? null, event)}
          className={cn(
            "group/row flex w-full cursor-grab items-center gap-1.5 rounded-sm px-1 py-0.5 text-sm transition-colors active:cursor-grabbing",
            isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted/70",
            isDragging && "opacity-50",
            isDropTarget && "bg-primary/[0.08] ring-1 ring-inset ring-primary/20",
          )}
          style={indentStyle(depth)}
        >
          <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-1.5 text-left">
            <FileText className="size-3 shrink-0 text-muted-foreground/70" />
            <span className="truncate text-muted-foreground">{formatNoteFileLabel(note.title)}</span>
          </button>
          <RowActionsMenu onRename={onRename} onDelete={onDelete} />
        </div>
      </ContextMenuTrigger>
      <NoteContextActions onRename={onRename} onDelete={onDelete} />
    </ContextMenu>
  );
}

function FolderBranch({
  folder,
  notesByFolderId,
  activeNoteId,
  depth,
  onSelectNote,
  onNewFile,
  onNewSubfolder,
  onRenameFolder,
  onDeleteFolder,
  onRenameNote,
  onDeleteNote,
  draggingItem,
  dragOverId,
  onDragStartItem,
  onDragOverTarget,
  onDropOnFolder,
  onDragEndItem,
  canDropOnFolder,
}: {
  folder: FolderNode;
  notesByFolderId: Map<string | null, NoteListItem[]>;
  activeNoteId?: string | null;
  depth: number;
  onSelectNote: (noteId: string) => void;
  onNewFile: (folderId: string) => void;
  onNewSubfolder: (parentId: string) => void;
  onRenameFolder: (folder: FolderNode) => void;
  onDeleteFolder: (folder: FolderNode) => void;
  onRenameNote: (note: NoteListItem) => void;
  onDeleteNote: (note: NoteListItem) => void;
} & ExplorerDragProps) {
  const folderNotes = notesByFolderId.get(folder.id) ?? [];
  const isDragging = draggingItem?.type === "folder" && draggingItem.id === folder.id;
  const isDropTarget = dragOverId === folder.id;

  return (
    <Collapsible defaultOpen className="group/folder">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            draggable
            onDragStart={(event) => onDragStartItem({ type: "folder", id: folder.id }, event)}
            onDragEnd={onDragEndItem}
            onDragOver={(event) => {
              if (!draggingItem) return;
              if (draggingItem.type === "note" || canDropOnFolder(folder.id)) {
                onDragOverTarget(folder.id, event);
              }
            }}
            onDrop={(event) => onDropOnFolder(folder.id, event)}
            className={cn(
              "group/row flex cursor-grab items-center gap-0.5 rounded-sm py-0.5 hover:bg-muted/70 active:cursor-grabbing",
              isDragging && "opacity-50",
              isDropTarget && "bg-primary/[0.08] ring-1 ring-inset ring-primary/20",
            )}
            style={indentStyle(depth, 0)}
          >
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="icon-xs" className="size-5 shrink-0 p-0">
                <ChevronRight className="size-3.5 transition-transform group-data-[state=open]/folder:rotate-90" />
              </Button>
            </CollapsibleTrigger>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 px-0.5 text-sm font-medium">
              <Folder className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{folder.name}</span>
              {folder.noteCount > 0 ? (
                <span className="text-xs text-muted-foreground tabular-nums">({folder.noteCount})</span>
              ) : null}
            </div>
            <RowActionsMenu
              onNewFile={() => onNewFile(folder.id)}
              onNewSubfolder={() => onNewSubfolder(folder.id)}
              onRename={() => onRenameFolder(folder)}
              onDelete={() => onDeleteFolder(folder)}
            />
          </div>
        </ContextMenuTrigger>
        <FolderContextActions
          onNewFile={() => onNewFile(folder.id)}
          onNewSubfolder={() => onNewSubfolder(folder.id)}
          onRename={() => onRenameFolder(folder)}
          onDelete={() => onDeleteFolder(folder)}
        />
      </ContextMenu>

      <CollapsibleContent className="ml-3 border-l border-border/50 pl-1 space-y-0.5">
        {folder.children.map((child) => (
          <FolderBranch
            key={child.id}
            folder={child}
            notesByFolderId={notesByFolderId}
            activeNoteId={activeNoteId}
            depth={depth + 1}
            onSelectNote={onSelectNote}
            onNewFile={onNewFile}
            onNewSubfolder={onNewSubfolder}
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
            onRenameNote={onRenameNote}
            onDeleteNote={onDeleteNote}
            draggingItem={draggingItem}
            dragOverId={dragOverId}
            onDragStartItem={onDragStartItem}
            onDragOverTarget={onDragOverTarget}
            onDropOnFolder={onDropOnFolder}
            onDragEndItem={onDragEndItem}
            canDropOnFolder={canDropOnFolder}
          />
        ))}
        {folderNotes.map((note) => (
          <NoteRow
            key={note.id}
            note={note}
            depth={depth + 1}
            isActive={activeNoteId === note.id}
            onSelect={() => onSelectNote(note.id)}
            onRename={() => onRenameNote(note)}
            onDelete={() => onDeleteNote(note)}
            draggingItem={draggingItem}
            dragOverId={dragOverId}
            onDragStartItem={onDragStartItem}
            onDragOverTarget={onDragOverTarget}
            onDropOnFolder={onDropOnFolder}
            onDragEndItem={onDragEndItem}
            canDropOnFolder={canDropOnFolder}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function NotesSidebar({
  folders,
  notes,
  activeNoteId,
  onSelectNote,
  onClearActiveNote,
  onCollapse,
}: NotesSidebarProps) {
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [createFolderParentId, setCreateFolderParentId] = useState<string | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [createNoteFolderId, setCreateNoteFolderId] = useState<string | null>(null);
  const [renameFolderTarget, setRenameFolderTarget] = useState<FolderNode | null>(null);
  const [renameNoteTarget, setRenameNoteTarget] = useState<NoteListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [draggingItem, setDraggingItem] = useState<DragItem | null>(null);
  const [dragOverId, setDragOverId] = useState<string | "root" | null>(null);

  const [createFolder, { error: createFolderError }] = useMutation(CREATE_FOLDER_MUTATION, {
    refetchQueries: ["GetFolders"],
  });
  const [createNote, { error: createNoteError }] = useMutation(CREATE_NOTE_MUTATION, {
    refetchQueries: ["GetFolders", "GetNotes"],
  });
  const [updateFolder, { error: updateFolderError }] = useMutation(UPDATE_FOLDER_MUTATION, {
    refetchQueries: ["GetFolders"],
  });
  const [updateNote, { error: updateNoteError }] = useMutation(UPDATE_NOTE_MUTATION, {
    refetchQueries: ["GetNotes", "GetFolders"],
  });
  const [deleteFolder, { loading: deletingFolder }] = useMutation(DELETE_FOLDER_MUTATION, {
    refetchQueries: ["GetFolders", "GetNotes"],
  });
  const [deleteNote, { loading: deletingNote }] = useMutation(DELETE_NOTE_MUTATION, {
    refetchQueries: ["GetFolders", "GetNotes"],
  });

  const notesByFolderId = useMemo(() => {
    const map = new Map<string | null, NoteListItem[]>();
    for (const note of notes) {
      const key = note.folderId ?? null;
      const bucket = map.get(key) ?? [];
      bucket.push(note);
      map.set(key, bucket);
    }
    return map;
  }, [notes]);

  const rootNotes = notesByFolderId.get(null) ?? [];

  const folderById = useMemo(() => {
    const map = new Map<string, FolderNode>();
    const walk = (folder: FolderNode) => {
      map.set(folder.id, folder);
      folder.children.forEach(walk);
    };
    folders.forEach(walk);
    return map;
  }, [folders]);

  const isValidFolderDrop = useCallback(
    (draggedFolderId: string, targetFolderId: string | null) => {
      if (targetFolderId === null) return true;
      if (targetFolderId === draggedFolderId) return false;
      const dragged = folderById.get(draggedFolderId);
      if (!dragged) return false;
      return !collectFolderIds(dragged).includes(targetFolderId);
    },
    [folderById],
  );

  const canDropOnFolder = useCallback(
    (folderId: string) => {
      if (!draggingItem) return false;
      if (draggingItem.type === "note") return true;
      return isValidFolderDrop(draggingItem.id, folderId);
    },
    [draggingItem, isValidFolderDrop],
  );

  const performDrop = useCallback(
    (item: DragItem, targetFolderId: string | null) => {
      if (item.type === "note") {
        const note = notes.find((n) => n.id === item.id);
        if (!note || (note.folderId ?? null) === targetFolderId) return;
        void updateNote({ variables: { id: item.id, folderId: targetFolderId } }).catch((err) => {
          toast.error(getGraphQLErrorMessage(err as Error) || "Failed to move file");
        });
        return;
      }

      const folder = folderById.get(item.id);
      if (!folder || (folder.parentId ?? null) === targetFolderId) return;
      if (!isValidFolderDrop(item.id, targetFolderId)) {
        toast.error("Can't move a folder into itself or one of its subfolders");
        return;
      }
      void updateFolder({ variables: { id: item.id, parentId: targetFolderId } }).catch((err) => {
        toast.error(getGraphQLErrorMessage(err as Error) || "Failed to move folder");
      });
    },
    [notes, folderById, isValidFolderDrop, updateNote, updateFolder],
  );

  const handleDragStartItem = useCallback((item: DragItem, event: DragEvent) => {
    event.dataTransfer.setData("text/plain", item.id);
    event.dataTransfer.effectAllowed = "move";
    setDraggingItem(item);
  }, []);

  const handleDragOverTarget = useCallback((targetId: string | "root", event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    setDragOverId(targetId);
  }, []);

  const handleDropOnFolder = useCallback(
    (targetFolderId: string | null, event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (draggingItem) {
        performDrop(draggingItem, targetFolderId);
      }
      setDraggingItem(null);
      setDragOverId(null);
    },
    [draggingItem, performDrop],
  );

  const handleDragEndItem = useCallback(() => {
    setDraggingItem(null);
    setDragOverId(null);
  }, []);

  const explorerDragProps: ExplorerDragProps = {
    draggingItem,
    dragOverId,
    onDragStartItem: handleDragStartItem,
    onDragOverTarget: handleDragOverTarget,
    onDropOnFolder: handleDropOnFolder,
    onDragEndItem: handleDragEndItem,
    canDropOnFolder,
  };

  const openRootFolderDialog = () => {
    setCreateFolderParentId(null);
    setFolderDialogOpen(true);
  };

  const openSubfolderDialog = (parentId: string) => {
    setCreateFolderParentId(parentId);
    setFolderDialogOpen(true);
  };

  const openNewFileDialog = (folderId: string) => {
    setCreateNoteFolderId(folderId);
    setNoteDialogOpen(true);
  };

  const handleDeleteFolderRequest = (folder: FolderNode) => {
    const folderIds = new Set(collectFolderIds(folder));
    const affectedNoteIds = notes.filter((note) => note.folderId != null && folderIds.has(note.folderId)).map((n) => n.id);
    setDeleteTarget({ type: "folder", id: folder.id, label: folder.name, affectedNoteIds });
  };

  const handleDeleteNoteRequest = (note: NoteListItem) => {
    setDeleteTarget({ type: "note", id: note.id, label: formatNoteFileLabel(note.title) });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "folder") {
        await deleteFolder({ variables: { id: deleteTarget.id } });
        if (activeNoteId && deleteTarget.affectedNoteIds.includes(activeNoteId)) {
          onClearActiveNote();
        }
        toast.success("Folder moved to trash");
      } else {
        await deleteNote({ variables: { id: deleteTarget.id } });
        if (activeNoteId === deleteTarget.id) {
          onClearActiveNote();
        }
        toast.success("File moved to trash");
      }
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getGraphQLErrorMessage(err as Error) || "Failed to delete");
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-muted/20">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-muted/20 px-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground">Explorer</span>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button type="button" variant="ghost" size="icon-xs" title="New folder" onClick={openRootFolderDialog}>
            <FolderPlus className="size-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" title="Hide explorer" onClick={onCollapse}>
            <PanelLeftClose className="size-3.5" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto p-1.5 space-y-0.5",
          dragOverId === "root" && "bg-primary/[0.03] ring-1 ring-inset ring-primary/20",
        )}
        onDragOver={(event) => {
          if (!draggingItem) return;
          handleDragOverTarget("root", event);
        }}
        onDrop={(event) => handleDropOnFolder(null, event)}
      >
        {rootNotes.map((note) => (
          <NoteRow
            key={note.id}
            note={note}
            depth={0}
            isActive={activeNoteId === note.id}
            onSelect={() => onSelectNote(note.id)}
            onRename={() => setRenameNoteTarget(note)}
            onDelete={() => handleDeleteNoteRequest(note)}
            {...explorerDragProps}
          />
        ))}

        {folders.map((folder) => (
          <FolderBranch
            key={folder.id}
            folder={folder}
            notesByFolderId={notesByFolderId}
            activeNoteId={activeNoteId}
            depth={0}
            onSelectNote={onSelectNote}
            onNewFile={openNewFileDialog}
            onNewSubfolder={openSubfolderDialog}
            onRenameFolder={setRenameFolderTarget}
            onDeleteFolder={handleDeleteFolderRequest}
            onRenameNote={setRenameNoteTarget}
            onDeleteNote={handleDeleteNoteRequest}
            {...explorerDragProps}
          />
        ))}
      </div>

      <FormDialog
        open={folderDialogOpen}
        onOpenChange={(open) => {
          setFolderDialogOpen(open);
          if (!open) setCreateFolderParentId(null);
        }}
        title={createFolderParentId ? "New subfolder" : "New folder"}
        description={
          createFolderParentId ? "Create a folder inside the selected folder." : "Create a folder at the root level."
        }
        schema={CreateFolderSchema}
        error={createFolderError}
        submitLabel="Create folder"
        onSubmit={async (formData) => {
          try {
            await createFolder({
              variables: {
                name: formData.name,
                parentId: createFolderParentId,
              },
            });
            toast.success("Folder created");
            setFolderDialogOpen(false);
            setCreateFolderParentId(null);
          } catch (err) {
            toast.error(getGraphQLErrorMessage(err as Error) || "Failed to create folder");
          }
        }}
      >
        {({ FormInput }) => (
          <FormInput fieldName="name" label="Name" type="text" required colSpan="full" helperText={NAME_HELPER_TEXT} />
        )}
      </FormDialog>

      <FormDialog
        open={noteDialogOpen}
        onOpenChange={(open) => {
          setNoteDialogOpen(open);
          if (!open) setCreateNoteFolderId(null);
        }}
        title="New file"
        description="Create a markdown file inside this folder. The .md extension is added automatically."
        schema={CreateNoteSchema}
        error={createNoteError}
        submitLabel="Create file"
        onSubmit={async (formData) => {
          if (!createNoteFolderId) return;
          try {
            const result = await createNote({
              variables: {
                title: normalizeNoteTitle(formData.title),
                folderId: createNoteFolderId,
              },
            });
            const createdId = result.data?.createNote?.id;
            if (createdId) onSelectNote(createdId);
            toast.success("File created");
            setNoteDialogOpen(false);
            setCreateNoteFolderId(null);
          } catch (err) {
            toast.error(getGraphQLErrorMessage(err as Error) || "Failed to create file");
          }
        }}
      >
        {({ FormInput }) => (
          <FormInput fieldName="title" label="File name" type="text" required colSpan="full" helperText={NAME_HELPER_TEXT} />
        )}
      </FormDialog>

      {renameFolderTarget ? (
        <FormDialog
          open
          onOpenChange={(open) => {
            if (!open) setRenameFolderTarget(null);
          }}
          title="Rename folder"
          schema={RenameFolderSchema}
          error={updateFolderError}
          submitLabel="Save"
          defaultValues={{ name: renameFolderTarget.name }}
          onSubmit={async (formData) => {
            try {
              await updateFolder({ variables: { id: renameFolderTarget.id, name: formData.name } });
              toast.success("Folder renamed");
              setRenameFolderTarget(null);
            } catch (err) {
              toast.error(getGraphQLErrorMessage(err as Error) || "Failed to rename folder");
            }
          }}
        >
          {({ FormInput }) => (
            <FormInput fieldName="name" label="Name" type="text" required colSpan="full" helperText={NAME_HELPER_TEXT} />
          )}
        </FormDialog>
      ) : null}

      {renameNoteTarget ? (
        <FormDialog
          open
          onOpenChange={(open) => {
            if (!open) setRenameNoteTarget(null);
          }}
          title="Rename file"
          schema={RenameNoteSchema}
          error={updateNoteError}
          submitLabel="Save"
          defaultValues={{ title: renameNoteTarget.title }}
          onSubmit={async (formData) => {
            try {
              await updateNote({
                variables: { id: renameNoteTarget.id, title: normalizeNoteTitle(formData.title) },
              });
              toast.success("File renamed");
              setRenameNoteTarget(null);
            } catch (err) {
              toast.error(getGraphQLErrorMessage(err as Error) || "Failed to rename file");
            }
          }}
        >
          {({ FormInput }) => (
            <FormInput
              fieldName="title"
              label="File name"
              type="text"
              required
              colSpan="full"
              helperText={NAME_HELPER_TEXT}
            />
          )}
        </FormDialog>
      ) : null}

      <AlertDialog open={deleteTarget != null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === "folder" ? "folder" : "file"}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "folder"
                ? `"${deleteTarget.label}" and all files inside it will be moved to Trash.`
                : `"${deleteTarget?.label}" will be moved to Trash.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingFolder || deletingNote}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingFolder || deletingNote}
              onClick={() => void handleConfirmDelete()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
