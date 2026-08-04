import { useMutation, useQuery } from "@apollo/client";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";

import { ErrorAlert } from "@/components/ErrorAlert";
import { FormDialog } from "@/components/FormDialog";
import Layout from "@/components/Layout";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ProgressWithLabel } from "@/components/ProgressWithLabel";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightSummary } from "@/components/WeightSummary";
import { useTaskCapabilities } from "@/hooks/useTaskCapabilities";
import { cn } from "@/utils/classnames";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { MESSAGE_MAP, VALIDATION_RULES } from "@/utils/validation";

import { PROJECT_DETAIL_QUERY } from "../../project-detail-query";
import { TaskComments } from "./TaskComments";
import { TaskContextPanel } from "./TaskContextPanel";
import { TaskFiles } from "./TaskFiles";
import { formatElapsed, TaskTime, useElapsedSeconds } from "./TaskTime";
import {
  ACTIVE_TIMER_QUERY,
  CREATE_SUBTASK_MUTATION,
  DELETE_TASK_WORKSPACE_MUTATION,
  START_TIMER_MUTATION,
  STOP_TIMER_MUTATION,
  TASK_WORKSPACE_QUERY,
  UPDATE_SUBTASK_MUTATION,
  UPDATE_TASK_WORKSPACE_MUTATION,
} from "./task-detail-query";

type SubtaskItem = { id: string; title: string; weight: number; isComplete: boolean };

const EditTaskDetailsSchema = z.object({
  title: z
    .string(MESSAGE_MAP.REQUIRED("Title"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Title"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message),
  description: z.string().trim().optional().nullable(),
  weight: z.coerce.number().int().min(1).max(100),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export default function TaskWorkspacePage() {
  const { id: projectId = "", taskId = "" } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("overview"));
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskWeight, setNewSubtaskWeight] = useState("10");
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [startTimerOpen, setStartTimerOpen] = useState(false);

  const { data: projectData } = useQuery(PROJECT_DETAIL_QUERY, {
    variables: { id: projectId },
    skip: !projectId,
  });

  const {
    data: taskData,
    loading: taskLoading,
    error: taskError,
    refetch: refetchTask,
  } = useQuery(TASK_WORKSPACE_QUERY, {
    variables: { id: taskId },
    skip: !taskId,
  });

  const { data: activeTimerData } = useQuery(ACTIVE_TIMER_QUERY);

  const [startTimer, { loading: startingTimer }] = useMutation(START_TIMER_MUTATION, {
    refetchQueries: ["ActiveTimer", "TaskTimeLogs"],
    onCompleted: () => toast.success("Timer started"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to start timer"),
  });

  const [stopTimer, { loading: stoppingTimer }] = useMutation(STOP_TIMER_MUTATION, {
    refetchQueries: ["ActiveTimer", "TaskTimeLogs"],
    onCompleted: () => toast.success("Timer stopped"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to stop timer"),
  });

  const [createSubtask, { loading: creatingSubtask }] = useMutation(CREATE_SUBTASK_MUTATION, {
    onCompleted: () => {
      setNewSubtaskTitle("");
      refetchTask();
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to add subtask"),
  });

  const [updateSubtask] = useMutation(UPDATE_SUBTASK_MUTATION, {
    onCompleted: () => refetchTask(),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to update subtask"),
  });

  const [updateTaskDetails, { loading: updatingDetails, error: updateDetailsError }] = useMutation(
    UPDATE_TASK_WORKSPACE_MUTATION,
    {
      onCompleted: () => {
        toast.success("Task details updated");
        setEditDetailsOpen(false);
        refetchTask();
      },
      onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to update task"),
    },
  );

  const [deleteTask, { loading: deletingTask }] = useMutation(DELETE_TASK_WORKSPACE_MUTATION, {
    refetchQueries: ["ProjectTasks"],
    onCompleted: () => {
      toast.success("Task deleted");
      navigate(`/projects/${projectId}?tab=board`);
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to delete task"),
  });

  const project = projectData?.getProject;
  const task = taskData?.getTask;
  const capabilities = useTaskCapabilities(projectId, task ?? null);
  const activeTimer = activeTimerData?.getActiveTimer;

  const timerOnThisTask = activeTimer?.taskId === taskId;
  const timerOnOtherTask = activeTimer && activeTimer.taskId !== taskId;
  const elapsedSeconds = useElapsedSeconds(activeTimer?.startedAt, timerOnThisTask);

  const subtitle = useMemo(() => {
    if (!task) return undefined;
    return `${task.status.replace(/_/g, " ")} · ${task.priority} · ${task.progress}% complete`;
  }, [task]);

  const subtaskWeights = (task?.subtasks ?? []).map((s: SubtaskItem) => s.weight);

  const headerActions = (
    <div className="flex flex-wrap items-center gap-2">
      {capabilities.canDelete ? (
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete task</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this task?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The task and its data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="-mx-0 -mb-0 border-0 bg-transparent p-0 pt-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deletingTask}
                onClick={() => deleteTask({ variables: { id: taskId } })}
              >
                Delete task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
      {capabilities.canEditTask ? (
        timerOnThisTask ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tabular-nums text-primary">{formatElapsed(elapsedSeconds)}</span>
            <Button loading={stoppingTimer} onClick={() => stopTimer()}>
              Stop timer
            </Button>
          </div>
        ) : (
          <AlertDialog open={startTimerOpen} onOpenChange={setStartTimerOpen}>
            <AlertDialogTrigger asChild>
              <Button disabled={Boolean(timerOnOtherTask)}>Start timer</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Start timer?</AlertDialogTitle>
                <AlertDialogDescription>
                  Begin tracking time on this task. You can stop the timer at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="-mx-0 -mb-0 border-0 bg-transparent p-0 pt-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={startingTimer} onClick={() => startTimer({ variables: { taskId } })}>
                  Start timer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      ) : null}
    </div>
  );

  if (!projectId || !taskId) {
    return (
      <Layout title="Task" breadcrumbs={[{ label: "Projects", href: "/projects" }]}>
        <ErrorAlert error="Task not found." />
      </Layout>
    );
  }

  if (taskLoading && !task) {
    return (
      <Layout
        title="Loading…"
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: project?.name ?? "…", href: `/projects/${projectId}` },
        ]}
      >
        <p className="text-sm text-muted-foreground">Loading task…</p>
      </Layout>
    );
  }

  if (taskError || !task) {
    return (
      <Layout title="Task" breadcrumbs={[{ label: "Projects", href: "/projects" }]}>
        <ErrorAlert error={getGraphQLErrorMessage(taskError) || "Unable to load task."} />
      </Layout>
    );
  }

  return (
    <Layout
      title={task.title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Projects", href: "/projects" },
        { label: project?.name ?? "Project", href: `/projects/${projectId}?tab=board` },
        { label: task.title },
      ]}
      onBack={() => navigate(`/projects/${projectId}?tab=board`)}
      headerActions={headerActions}
    >
      <div className="space-y-6 pb-6">
        {timerOnOtherTask && capabilities.canEditTask ? (
          <p className="text-sm text-muted-foreground rounded-md border border-neutral-200 bg-muted/30 px-3 py-2">
            Timer running on <span className="font-medium">{activeTimer.taskTitle}</span>. Stop it before starting here.
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4 min-w-0">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {task.isBlocked ? (
                <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
                  Blocked
                </span>
              ) : null}
            </div>
            <ProgressWithLabel value={task.progress} />

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="time">Time</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
                    {capabilities.canEditTask ? (
                      <FormDialog
                        open={editDetailsOpen}
                        onOpenChange={setEditDetailsOpen}
                        trigger={
                          <Button variant="outline" size="sm">
                            Edit details
                          </Button>
                        }
                        title="Edit task details"
                        description="Update title, description, weight, and priority."
                        schema={EditTaskDetailsSchema}
                        loading={updatingDetails}
                        error={updateDetailsError}
                        submitLabel="Save changes"
                        onSubmit={async (formData) => {
                          await updateTaskDetails({
                            variables: {
                              id: taskId,
                              title: formData.title,
                              description: formData.description,
                              weight: formData.weight,
                              priority: formData.priority,
                            },
                          });
                        }}
                      >
                        {({ FormInput }) => (
                          <>
                            <FormInput
                              type="text"
                              fieldName="title"
                              label="Title"
                              required
                              colSpan="full"
                              defaultValue={task.title}
                            />
                            <FormInput
                              fieldName="description"
                              label="Description"
                              type="textarea"
                              colSpan="full"
                              defaultValue={task.description ?? ""}
                            />
                            <FormInput
                              type="number"
                              fieldName="weight"
                              label="Weight (%)"
                              required
                              colSpan="full"
                              defaultValue={task.weight}
                            />
                            <FormInput
                              fieldName="priority"
                              label="Priority"
                              type="select"
                              colSpan="full"
                              defaultValue={task.priority}
                              options={[
                                { label: "Low", value: "LOW" },
                                { label: "Medium", value: "MEDIUM" },
                                { label: "High", value: "HIGH" },
                                { label: "Urgent", value: "URGENT" },
                              ]}
                            />
                          </>
                        )}
                      </FormDialog>
                    ) : null}
                  </div>
                  <p className="text-sm text-foreground">
                    {task.description?.trim() ? task.description : "No description provided."}
                  </p>
                </div>

                {task.type === "CHECKLIST" ? (
                  <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs space-y-3">
                    <WeightSummary weights={subtaskWeights} label="Remaining subtask weight" />
                    <ul className="space-y-2">
                      {(task.subtasks ?? []).map((subtask: SubtaskItem) => (
                        <li key={subtask.id} className="flex items-center gap-2 rounded-md border border-neutral-200 p-2">
                          <Checkbox
                            checked={subtask.isComplete}
                            disabled={!capabilities.canManageSubtasks}
                            onCheckedChange={(checked) =>
                              updateSubtask({
                                variables: { id: subtask.id, isComplete: checked === true },
                              })
                            }
                          />
                          <span className={cn("flex-1 text-sm", subtask.isComplete && "line-through text-muted-foreground")}>
                            {subtask.title}
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums">{subtask.weight}%</span>
                        </li>
                      ))}
                    </ul>
                    {capabilities.canManageSubtasks ? (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          placeholder="Subtask title"
                          value={newSubtaskTitle}
                          onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        />
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          className="sm:w-24"
                          value={newSubtaskWeight}
                          onChange={(e) => setNewSubtaskWeight(e.target.value)}
                        />
                        <Button
                          loading={creatingSubtask}
                          disabled={!newSubtaskTitle.trim()}
                          onClick={() =>
                            createSubtask({
                              variables: {
                                taskId,
                                title: newSubtaskTitle.trim(),
                                weight: Number(newSubtaskWeight) || 0,
                              },
                            })
                          }
                        >
                          Add subtask
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                {tab === "comments" ? (
                  <TaskComments
                    taskId={taskId}
                    canComment={capabilities.canComment}
                    canEditComment={capabilities.canEditComment}
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="files" className="mt-4">
                {tab === "files" ? (
                  <TaskFiles
                    taskId={taskId}
                    projectId={projectId}
                    canUpload={capabilities.canUploadFiles}
                    canDeleteFile={capabilities.canDeleteFile}
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="time" className="mt-4">
                {tab === "time" ? <TaskTime taskId={taskId} canEdit={capabilities.canEditTask} /> : null}
              </TabsContent>
            </Tabs>
          </div>

          <TaskContextPanel
            taskId={taskId}
            projectId={projectId}
            task={task}
            capabilities={capabilities}
            onUpdated={() => refetchTask()}
          />
        </div>
      </div>
    </Layout>
  );
}
