import { useMutation, useQuery } from "@apollo/client";
import { AlertTriangle, Link2, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { ErrorAlert } from "@/components/ErrorAlert";
import { FormDialog } from "@/components/FormDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import { PROJECT_TASKS_QUERY } from "../../project-detail-query";
import { ADD_TASK_DEPENDENCY_MUTATION, REMOVE_TASK_DEPENDENCY_MUTATION, TASK_DEPENDENCIES_QUERY } from "./task-detail-query";

type TaskDependenciesProps = {
  taskId: string;
  projectId: string;
  canManage?: boolean;
};

type DependencyItem = {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  taskTitle?: string | null;
  dependsOnTaskTitle?: string | null;
  dependsOnTaskStatus?: string | null;
};

const AddDependencySchema = z.object({
  dependsOnTaskId: z.string().min(1, "Select a task"),
});

export function TaskDependencies({ taskId, projectId, canManage = true }: TaskDependenciesProps) {
  const [addOpen, setAddOpen] = useState(false);

  const { data, loading, error } = useQuery(TASK_DEPENDENCIES_QUERY, {
    variables: { taskId },
    skip: !taskId,
  });

  const { data: tasksData } = useQuery(PROJECT_TASKS_QUERY, {
    variables: { limit: 200, filters: { projectId } },
    skip: !projectId,
  });

  const [addDependency, { loading: adding, error: addError }] = useMutation(ADD_TASK_DEPENDENCY_MUTATION, {
    refetchQueries: ["TaskDependencies"],
    onCompleted: () => {
      toast.success("Dependency added");
      setAddOpen(false);
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to add dependency"),
  });

  const [removeDependency] = useMutation(REMOVE_TASK_DEPENDENCY_MUTATION, {
    refetchQueries: ["TaskDependencies"],
    onCompleted: () => toast.success("Dependency removed"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to remove dependency"),
  });

  const blockedBy = (data?.getTaskDependencies?.blockedBy ?? []) as DependencyItem[];
  const blocks = (data?.getTaskDependencies?.blocks ?? []) as DependencyItem[];
  const isBlocked = data?.getTaskDependencies?.isBlocked ?? false;

  const blockedIds = useMemo(() => new Set(blockedBy.map((d) => d.dependsOnTaskId)), [blockedBy]);

  const taskOptions = useMemo(() => {
    const nodes = tasksData?.getTasks?.nodes ?? [];
    return nodes
      .filter((t: { id: string }) => t.id !== taskId && !blockedIds.has(t.id))
      .map((t: { id: string; title: string }) => ({ label: t.title, value: t.id }));
  }, [tasksData, taskId, blockedIds]);

  if (loading && !data) {
    return <p className="text-sm text-muted-foreground">Loading dependencies…</p>;
  }

  if (error) {
    return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
  }

  return (
    <div className="space-y-4">
      {isBlocked ? (
        <div className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
          <AlertTriangle className="size-4 shrink-0 text-primary mt-0.5" />
          <p>This task is blocked until upstream tasks are done.</p>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Blocked by</p>
        {blockedBy.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upstream dependencies.</p>
        ) : (
          <ul className="space-y-2">
            {blockedBy.map((dep) => (
              <li
                key={dep.id}
                className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-xs"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{dep.dependsOnTaskTitle ?? dep.dependsOnTaskId}</span>
                  {dep.dependsOnTaskStatus ? <StatusBadge status={dep.dependsOnTaskStatus} /> : null}
                </div>
                {canManage ? (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => {
                      if (window.confirm("Remove this dependency?")) {
                        removeDependency({ variables: { id: dep.id } });
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Blocks</p>
        {blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing depends on this task.</p>
        ) : (
          <ul className="space-y-2">
            {blocks.map((dep) => (
              <li
                key={dep.id}
                className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-xs"
              >
                <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{dep.taskTitle ?? dep.taskId}</span>
                {dep.dependsOnTaskStatus ? <StatusBadge status={dep.dependsOnTaskStatus} /> : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {canManage ? (
        <FormDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          trigger={
            <Button size="sm" className="w-full bg-[#111111] text-white hover:bg-[#111111]/90 border-transparent">
              <Plus className="size-4" />
              Add dependency
            </Button>
          }
          title="Add dependency"
          description="This task will be blocked until the selected task is done."
          schema={AddDependencySchema}
          loading={adding}
          error={addError}
          submitLabel="Add dependency"
          onSubmit={async (formData) => {
            await addDependency({
              variables: { taskId, dependsOnTaskId: formData.dependsOnTaskId },
            });
          }}
        >
          {({ FormInput }) => (
            <FormInput
              fieldName="dependsOnTaskId"
              label="Depends on task"
              type="select"
              required
              colSpan="full"
              options={taskOptions}
            />
          )}
        </FormDialog>
      ) : null}
    </div>
  );
}
