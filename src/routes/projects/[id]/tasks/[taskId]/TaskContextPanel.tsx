import { useMutation, useQuery } from "@apollo/client";
import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { FormDialog } from "@/components/FormDialog";
import { Button } from "@/components/ui/button";
import type { TaskCapabilities } from "@/hooks/useTaskCapabilities";
import DatePicker from "@/primitives/date";
import Select from "@/primitives/select";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import { PROJECT_MEMBERS_QUERY } from "../../project-detail-query";
import { TaskDependencies } from "./TaskDependencies";
import {
  ADD_TASK_ASSIGNEE_WORKSPACE_MUTATION,
  REMOVE_TASK_ASSIGNEE_WORKSPACE_MUTATION,
  UPDATE_TASK_WORKSPACE_MUTATION,
} from "./task-detail-query";

const blackActionButtonClass = "bg-[#111111] text-white hover:bg-[#111111]/90 border-transparent";

type AssigneeRow = {
  id: string;
  userId: string;
  user?: { id: string; fullName?: string | null; email?: string | null } | null;
};

type TaskContextPanelProps = {
  taskId: string;
  projectId: string;
  task: {
    status: string;
    dueDate?: string | null;
    isBlocked?: boolean;
    assignees?: AssigneeRow[];
  };
  capabilities: TaskCapabilities;
  onUpdated: () => void;
};

const AddAssigneeSchema = z.object({
  assigneeId: z.string().min(1, "Select a member"),
});

const STATUS_OPTIONS = [
  { value: "TODO", label: "To do" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DONE", label: "Done" },
];

export function TaskContextPanel({ taskId, projectId, task, capabilities, onUpdated }: TaskContextPanelProps) {
  const [addAssigneeOpen, setAddAssigneeOpen] = useState(false);

  const { data: membersData } = useQuery(PROJECT_MEMBERS_QUERY, {
    variables: { projectId },
    skip: !projectId,
  });

  const [updateTask, { loading: updatingTask }] = useMutation(UPDATE_TASK_WORKSPACE_MUTATION, {
    onCompleted: () => {
      onUpdated();
      toast.success("Task updated");
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to update task"),
  });

  const [addAssignee, { loading: addingAssignee, error: addAssigneeError }] = useMutation(
    ADD_TASK_ASSIGNEE_WORKSPACE_MUTATION,
    {
      refetchQueries: ["TaskWorkspace", "ProjectTasks"],
      onCompleted: () => {
        setAddAssigneeOpen(false);
        toast.success("Assignee added");
      },
      onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to add assignee"),
    },
  );

  const [removeAssignee] = useMutation(REMOVE_TASK_ASSIGNEE_WORKSPACE_MUTATION, {
    refetchQueries: ["TaskWorkspace", "ProjectTasks"],
    onCompleted: () => toast.success("Assignee removed"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to remove assignee"),
  });

  const assignedIds = useMemo(() => new Set((task.assignees ?? []).map((entry) => entry.userId)), [task.assignees]);

  const memberOptions = useMemo(() => {
    const nodes = membersData?.getProjectMembers?.nodes ?? [];
    return nodes
      .filter((member: { userId: string }) => !assignedIds.has(member.userId))
      .map((member: { userId: string; fullName?: string | null; email?: string | null }) => ({
        label: member.fullName ?? member.email ?? member.userId,
        value: member.userId,
      }));
  }, [membersData, assignedIds]);

  const statusOptions = useMemo(
    () => (task.isBlocked ? STATUS_OPTIONS.filter((option) => option.value !== "DONE") : STATUS_OPTIONS),
    [task.isBlocked],
  );

  const handleStatusChange = async (nextStatus: string | null) => {
    if (!nextStatus || nextStatus === task.status) return;
    if (nextStatus === "DONE" && task.isBlocked) {
      toast.error("Complete upstream dependencies before marking this task done.");
      return;
    }

    await updateTask({
      variables: {
        id: taskId,
        status: nextStatus,
        progress: nextStatus === "DONE" ? 100 : nextStatus === "TODO" ? 0 : undefined,
      },
    });
  };

  const handleDueDateChange = async (date: Date | null) => {
    await updateTask({
      variables: {
        id: taskId,
        dueDate: date ? date.toISOString() : null,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Assignees</p>
          {capabilities.canAssign ? (
            <FormDialog
              open={addAssigneeOpen}
              onOpenChange={setAddAssigneeOpen}
              trigger={
                <Button size="sm" className={blackActionButtonClass}>
                  <Plus className="size-4" />
                  Add assignee
                </Button>
              }
              title="Add assignee"
              description="Assign a project member to this task."
              schema={AddAssigneeSchema}
              loading={addingAssignee}
              error={addAssigneeError}
              submitLabel="Add assignee"
              onSubmit={async (formData) => {
                await addAssignee({
                  variables: { taskId, assigneeId: formData.assigneeId },
                });
              }}
            >
              {({ FormInput }) => (
                <FormInput
                  fieldName="assigneeId"
                  label="Member"
                  type="select"
                  required
                  colSpan="full"
                  options={memberOptions}
                />
              )}
            </FormDialog>
          ) : null}
        </div>

        {(task.assignees ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No assignees yet.</p>
        ) : (
          <ul className="space-y-2">
            {(task.assignees ?? []).map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm"
              >
                <span className="truncate">{entry.user?.fullName ?? entry.user?.email ?? entry.userId}</span>
                {capabilities.canAssign ? (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      removeAssignee({
                        variables: { taskId, assigneeId: entry.userId },
                      })
                    }
                  >
                    <X className="size-3.5" />
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Due date</p>
        {capabilities.canEditTask ? (
          <DatePicker
            id="task-due-date"
            value={task.dueDate ? new Date(task.dueDate) : null}
            onChange={(date) => handleDueDateChange(date ?? null)}
            onClearSet={null}
            placeholder="No due date"
            readOnly={updatingTask}
          />
        ) : (
          <p className="text-sm">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
        )}
      </div>

      <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
        {capabilities.canChangeStatus ? (
          <div className="space-y-2">
            <Select
              id="task-status"
              value={task.status}
              onChange={handleStatusChange}
              options={statusOptions}
              readOnly={updatingTask}
              searchable={false}
              className="w-full min-w-0"
            />
            {task.isBlocked ? (
              <p className="text-xs text-muted-foreground">Complete blocked-by tasks before marking done.</p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm capitalize">{task.status.replace(/_/g, " ").toLowerCase()}</p>
        )}
      </div>

      <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs">
        <TaskDependencies taskId={taskId} projectId={projectId} canManage={capabilities.canManageDependencies} />
      </div>
    </div>
  );
}
