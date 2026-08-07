import { useQuery } from "@apollo/client";
import { PanelLeft } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import { ErrorAlert } from "@/components/ErrorAlert";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/classnames";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import { NoteEditor } from "./NoteEditor";
import { type FolderNode, type NoteListItem, NotesSidebar } from "./NotesSidebar";
import { GET_FOLDERS_QUERY, GET_NOTES_QUERY } from "./notes-query";

const EXPLORER_WIDTH_CLASS = "w-64";

export default function NotesPage() {
  const [activeNoteId, setActiveNoteId] = useQueryState("note", parseAsString);
  const [explorerOpen, setExplorerOpen] = useState(true);

  const { data: foldersData, loading: foldersLoading, error: foldersError } = useQuery(GET_FOLDERS_QUERY);

  const {
    data: notesData,
    loading: notesLoading,
    error: notesError,
  } = useQuery(GET_NOTES_QUERY, {
    variables: { all: true },
  });

  const folders = (foldersData?.getFolders?.nodes ?? []) as FolderNode[];
  const notes = (notesData?.getNotes?.nodes ?? []) as NoteListItem[];
  const isInitialLoading = (foldersLoading || notesLoading) && !foldersData && !notesData;
  const queryError = foldersError ?? notesError;

  return (
    <Layout
      breadcrumbs={[{ label: "Notes" }]}
      contentClassName="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-border p-0 max-w-none"
    >
      {queryError ? (
        <div className="p-4">
          <ErrorAlert error={getGraphQLErrorMessage(queryError)} />
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-1 overflow-hidden">
          <div
            className={cn(
              "flex min-h-0 shrink-0 flex-col self-stretch overflow-hidden transition-[width] duration-200 ease-linear",
              explorerOpen ? cn(EXPLORER_WIDTH_CLASS, "border-r border-border") : "w-0",
            )}
          >
            <div className={cn(EXPLORER_WIDTH_CLASS, "flex h-full min-h-0 flex-col overflow-hidden bg-muted/20")}>
              {isInitialLoading ? (
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                  Loading notes…
                </div>
              ) : (
                <NotesSidebar
                  folders={folders}
                  notes={notes}
                  activeNoteId={activeNoteId}
                  onSelectNote={(noteId) => setActiveNoteId(noteId)}
                  onClearActiveNote={() => setActiveNoteId(null)}
                  onCollapse={() => setExplorerOpen(false)}
                />
              )}
            </div>
          </div>

          <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
            {!explorerOpen && !activeNoteId ? (
              <div className="flex h-12 shrink-0 items-center border-b border-border px-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title="Show explorer"
                  onClick={() => setExplorerOpen(true)}
                >
                  <PanelLeft className="size-4" />
                  <span className="sr-only">Show explorer</span>
                </Button>
              </div>
            ) : null}

            {activeNoteId ? (
              <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
                <NoteEditor
                  noteId={activeNoteId}
                  folders={folders}
                  explorerOpen={explorerOpen}
                  onExplorerOpenChange={setExplorerOpen}
                  onDeleted={() => setActiveNoteId(null)}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Layout>
  );
}
