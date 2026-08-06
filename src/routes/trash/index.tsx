import { useMutation, useQuery } from "@apollo/client";
import { Trash2 } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/DataTable";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import Layout from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { isPlatformAdmin } from "@/utils/permissions";

import {
  GET_TRASHED_PROJECTS_QUERY,
  GET_TRASHED_TASKS_QUERY,
  PERMANENT_DELETE_PROJECT_MUTATION,
  PERMANENT_DELETE_TASK_MUTATION,
  RESTORE_PROJECT_MUTATION,
  RESTORE_TASK_MUTATION,
} from "./trash-query";

type TrashedProjectRow = {
  id: string;
  name: string;
  ownerName?: string | null;
  deletedAt: string;
};

type TrashedTaskRow = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: string;
  deletedAt: string;
};

function TrashedProjectActions({
  row,
  canPermanentDelete,
  onPermanentDelete,
}: {
  row: TrashedProjectRow;
  canPermanentDelete: boolean;
  onPermanentDelete: (row: TrashedProjectRow) => void;
}) {
  const perms = useProjectPermissions(row.id);

  const [restoreProject, { loading: restoring }] = useMutation(RESTORE_PROJECT_MUTATION, {
    refetchQueries: ["TrashedProjects"],
    onCompleted: () => toast.success("Project restored"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to restore project"),
  });

  if (!perms.canEditProject && !(canPermanentDelete && perms.canDeleteProject)) return null;

  return (
    <div className="flex justify-end gap-2">
      {perms.canEditProject ? (
        <Button
          size="sm"
          variant="outline"
          loading={restoring}
          onClick={() => restoreProject({ variables: { id: row.id } })}
        >
          Restore
        </Button>
      ) : null}
      {canPermanentDelete && perms.canDeleteProject ? (
        <Button size="sm" variant="destructive" onClick={() => onPermanentDelete(row)}>
          Delete forever
        </Button>
      ) : null}
    </div>
  );
}

function TrashedTaskActions({
  row,
  canPermanentDelete,
  onPermanentDelete,
}: {
  row: TrashedTaskRow;
  canPermanentDelete: boolean;
  onPermanentDelete: (row: TrashedTaskRow) => void;
}) {
  const perms = useProjectPermissions(row.projectId);
  const canRestore = perms.canEditAnyTask || perms.canEditOwnTask;

  const [restoreTask, { loading: restoring }] = useMutation(RESTORE_TASK_MUTATION, {
    refetchQueries: ["TrashedTasks"],
    onCompleted: () => toast.success("Task restored"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to restore task"),
  });

  if (!canRestore && !(canPermanentDelete && perms.canDeleteTask)) return null;

  return (
    <div className="flex justify-end gap-2">
      {canRestore ? (
        <Button size="sm" variant="outline" loading={restoring} onClick={() => restoreTask({ variables: { id: row.id } })}>
          Restore
        </Button>
      ) : null}
      {canPermanentDelete && perms.canDeleteTask ? (
        <Button size="sm" variant="destructive" onClick={() => onPermanentDelete(row)}>
          Delete forever
        </Button>
      ) : null}
    </div>
  );
}

export default function TrashPage() {
  const { user } = useAuth();
  const canPermanentDelete = isPlatformAdmin(user?.roleCode);
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("projects"));
  const [deleteTarget, setDeleteTarget] = useState<{ type: "project" | "task"; id: string; label: string } | null>(null);

  const {
    data: projectsData,
    loading: loadingProjects,
    error: projectsError,
  } = useQuery(GET_TRASHED_PROJECTS_QUERY, {
    variables: { page: 1, limit: 50 },
    skip: tab !== "projects",
  });

  const {
    data: tasksData,
    loading: loadingTasks,
    error: tasksError,
  } = useQuery(GET_TRASHED_TASKS_QUERY, {
    variables: { page: 1, limit: 50 },
    skip: tab !== "tasks",
  });

  const [permanentDeleteProject, { loading: deletingProject }] = useMutation(PERMANENT_DELETE_PROJECT_MUTATION, {
    refetchQueries: ["TrashedProjects"],
    onCompleted: () => {
      toast.success("Project permanently deleted");
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to delete project"),
  });

  const [permanentDeleteTask, { loading: deletingTask }] = useMutation(PERMANENT_DELETE_TASK_MUTATION, {
    refetchQueries: ["TrashedTasks"],
    onCompleted: () => {
      toast.success("Task permanently deleted");
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to delete task"),
  });

  const projects = (projectsData?.getTrashedProjects?.nodes ?? []) as TrashedProjectRow[];
  const tasks = (tasksData?.getTrashedTasks?.nodes ?? []) as TrashedTaskRow[];

  const projectColumns = [
    { label: "Name", fieldName: "name" },
    { label: "Owner", fieldName: "ownerName" },
    { label: "Deleted", fieldName: "deletedAt", type: "DATETIME" as const },
    {
      label: "Actions",
      fieldName: "id",
      formatter: (_value: unknown, row?: TrashedProjectRow) =>
        row ? (
          <TrashedProjectActions
            row={row}
            canPermanentDelete={canPermanentDelete}
            onPermanentDelete={(item) => setDeleteTarget({ type: "project", id: item.id, label: item.name })}
          />
        ) : null,
    },
  ];

  const taskColumns = [
    { label: "Task", fieldName: "title" },
    { label: "Project", fieldName: "projectName" },
    {
      label: "Status",
      fieldName: "status",
      formatter: (value: unknown) => <StatusBadge status={String(value)} />,
    },
    { label: "Deleted", fieldName: "deletedAt", type: "DATETIME" as const },
    {
      label: "Actions",
      fieldName: "id",
      formatter: (_value: unknown, row?: TrashedTaskRow) =>
        row ? (
          <TrashedTaskActions
            row={row}
            canPermanentDelete={canPermanentDelete}
            onPermanentDelete={(item) => setDeleteTarget({ type: "task", id: item.id, label: item.title })}
          />
        ) : null,
    },
  ];

  const renderProjects = () => {
    if (loadingProjects && !projectsData) return <DataTableSkeleton showIndexColumn columns={projectColumns} />;
    if (projectsError) return <ErrorAlert error={getGraphQLErrorMessage(projectsError)} />;
    if (projects.length === 0) {
      return (
        <EmptyState
          title="No deleted projects"
          description="Soft-deleted projects you belong to will appear here."
          icon={Trash2}
        />
      );
    }
    return <DataTable showIndexColumn data={projects} columns={projectColumns} />;
  };

  const renderTasks = () => {
    if (loadingTasks && !tasksData) return <DataTableSkeleton showIndexColumn columns={taskColumns} />;
    if (tasksError) return <ErrorAlert error={getGraphQLErrorMessage(tasksError)} />;
    if (tasks.length === 0) {
      return (
        <EmptyState
          title="No deleted tasks"
          description="Soft-deleted tasks from active projects will appear here."
          icon={Trash2}
        />
      );
    }
    return <DataTable showIndexColumn data={tasks} columns={taskColumns} />;
  };

  return (
    <Layout title="Trash" subtitle="Restore or permanently delete soft-deleted items" breadcrumbs={[{ label: "Trash" }]}>
      {!canPermanentDelete ? (
        <p className="mb-4 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Permanent deletion is restricted to administrators. Contact an admin to permanently remove items. You can still
          restore items you have permission to edit.
        </p>
      ) : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-4">
          {renderProjects()}
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          {renderTasks()}
        </TabsContent>
      </Tabs>

      {canPermanentDelete ? (
        <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete forever?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget
                  ? `"${deleteTarget.label}" will be permanently removed. This cannot be undone.`
                  : "This cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="-mx-0 -mb-0 border-0 bg-transparent p-0 pt-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deletingProject || deletingTask}
                onClick={() => {
                  if (!deleteTarget) return;
                  if (deleteTarget.type === "project") {
                    permanentDeleteProject({ variables: { id: deleteTarget.id } });
                  } else {
                    permanentDeleteTask({ variables: { id: deleteTarget.id } });
                  }
                }}
              >
                Delete forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </Layout>
  );
}
