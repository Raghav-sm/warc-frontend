import { useMutation, useQuery } from "@apollo/client";
import { Download, FileText, PanelLeft, Save, Trash2 } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ErrorAlert } from "@/components/ErrorAlert";
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadAsMarkdownFile } from "@/utils/download-markdown";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { formatNoteFileLabel } from "@/utils/note-entity-name";

import { MarkdownPreview } from "./MarkdownPreview";
import { NoteMarkdownEditor } from "./NoteMarkdownEditor";
import type { FolderNode } from "./NotesSidebar";
import { getNoteFolderPath } from "./note-breadcrumb";
import { DELETE_NOTE_MUTATION, GET_NOTE_QUERY, UPDATE_NOTE_MUTATION } from "./notes-query";

type NoteEditorProps = {
  noteId: string;
  folders: FolderNode[];
  explorerOpen: boolean;
  onExplorerOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

type EditorMode = "markdown" | "preview";

export function NoteEditor({ noteId, folders, explorerOpen, onExplorerOpenChange, onDeleted }: NoteEditorProps) {
  const [mode, setMode] = useState<EditorMode>("markdown");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data, loading, error } = useQuery(GET_NOTE_QUERY, {
    variables: { id: noteId },
    skip: !noteId,
  });

  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");

  const [updateNote] = useMutation(UPDATE_NOTE_MUTATION, {
    refetchQueries: ["GetNotes", "GetFolders"],
  });

  const [deleteNote, { loading: deleting }] = useMutation(DELETE_NOTE_MUTATION, {
    refetchQueries: ["GetNotes", "GetFolders"],
  });

  useEffect(() => {
    const note = data?.getNote;
    if (!note) return;

    setContent(note.content);
    setSavedContent(note.content);
  }, [data?.getNote?.id, data?.getNote?.content]);

  const note = data?.getNote;
  const folderPath = useMemo(() => getNoteFolderPath(note?.folderId, folders), [note?.folderId, folders]);

  if (loading && !data) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading note…</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorAlert error={getGraphQLErrorMessage(error)} />
      </div>
    );
  }

  const isDirty = content !== savedContent;
  const canSave = isDirty;

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      await updateNote({
        variables: {
          id: noteId,
          content,
        },
      });
      setSavedContent(content);
      toast.success("Saved");
    } catch (err) {
      toast.error(getGraphQLErrorMessage(err as Error) || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote({ variables: { id: noteId } });
      toast.success("Note moved to trash");
      setDeleteOpen(false);
      onDeleted();
    } catch (err) {
      toast.error(getGraphQLErrorMessage(err as Error) || "Failed to delete note");
    }
  };

  const displayTitle = formatNoteFileLabel(note?.title ?? "");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <Tabs
        value={mode}
        onValueChange={(value) => value && setMode(value as EditorMode)}
        className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden"
      >
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          {!explorerOpen ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              title="Show explorer"
              onClick={() => onExplorerOpenChange(true)}
            >
              <PanelLeft className="size-4" />
              <span className="sr-only">Show explorer</span>
            </Button>
          ) : null}
          <Breadcrumb className="min-w-0 flex-1 overflow-x-auto">
            <BreadcrumbList className="flex-nowrap text-xs sm:text-sm">
              {folderPath.map((folderName, index) => (
                <Fragment key={`${index}-${folderName}`}>
                  <BreadcrumbItem>
                    <span className="max-w-[9rem] truncate text-muted-foreground">{folderName}</span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </Fragment>
              ))}
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="flex min-w-0 items-center gap-1.5 font-medium">
                  <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{displayTitle}</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto">
            <TabsList className="h-8 w-auto shrink-0">
              <TabsTrigger value="markdown" className="px-2.5 text-xs">
                Markdown
              </TabsTrigger>
              <TabsTrigger value="preview" className="px-2.5 text-xs">
                Preview
              </TabsTrigger>
            </TabsList>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 px-2.5"
              disabled={!canSave || saving}
              onClick={() => void handleSave()}
            >
              <Save className="size-3.5" />
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 px-2.5"
              onClick={() => downloadAsMarkdownFile(note?.title ?? "", content)}
            >
              <Download className="size-3.5" />
              Export
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-8 shrink-0 px-2.5"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        </div>

        <TabsContent
          value="markdown"
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
        >
          <NoteMarkdownEditor value={content} onChange={setContent} placeholder="Write markdown…" />
        </TabsContent>

        <TabsContent
          value="preview"
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <MarkdownPreview content={content} />
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>"{displayTitle}" will be moved to Trash.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={() => void handleDelete()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
