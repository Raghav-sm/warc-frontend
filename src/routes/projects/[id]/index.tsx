import { useMutation, useQuery } from "@apollo/client";
import type { DropResult } from "@hello-pangea/dnd";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";

import { AssigneeStack } from "@/components/AssigneeStack";
import { DataTable } from "@/components/DataTable";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { DetailSheet } from "@/components/DetailSheet";
import { EntityCard } from "@/components/EntityCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { FormDialog } from "@/components/FormDialog";
import { KANBAN_COLUMNS, KanbanBoard } from "@/components/KanbanBoard";
import { KanbanTaskCard } from "@/components/KanbanTaskCard";
import Layout from "@/components/Layout";
import { PageSection } from "@/components/PageSection";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ProgressWithLabel } from "@/components/ProgressWithLabel";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightSummary } from "@/components/WeightSummary";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { cn } from "@/utils/classnames";
import { formatStatus } from "@/utils/format-status";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { MESSAGE_MAP, VALIDATION_RULES } from "@/utils/validation";

import {
  ADD_PROJECT_MEMBER_MUTATION,
  CREATE_SUBTASK_MUTATION,
  CREATE_TASK_MUTATION,
  PROJECT_DETAIL_QUERY,
  PROJECT_MEMBERS_QUERY,
  PROJECT_ROLES_QUERY,
  PROJECT_TASKS_QUERY,
  PROJECT_USERS_QUERY,
  TASK_DETAIL_QUERY,
  UPDATE_SUBTASK_MUTATION,
  UPDATE_TASK_MUTATION,
} from "./project-detail-query";

const CreateTaskSchema = z.object({
  title: z
    .string(MESSAGE_MAP.REQUIRED("Title"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Title"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message),
  description: z.string().trim().optional().nullable(),
  weight: z.coerce.number().int().min(1).max(100),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

const AddMemberSchema = z.object({
  memberUserId: z.string(MESSAGE_MAP.REQUIRED("User")).min(1, MESSAGE_MAP.REQUIRED("User")),
  roleId: z.string(MESSAGE_MAP.REQUIRED("Role")).min(1, MESSAGE_MAP.REQUIRED("Role")),
});

type BoardTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  progress: number;
  weight: number;
  assignees: TaskAssigneeRow[];
};

type ProjectRoleOption = { id: string; code: string; name: string };
type UserOption = { id: string; fullName?: string | null; email?: string | null };
type SubtaskItem = { id: string; title: string; weight: number; isComplete: boolean };
type TaskAssigneeRow = { user?: { fullName?: string | null; email?: string | null } | null };

const PROJECT_ROLE_CODES = new Set(["MANAGER", "DEV", "VIEWER"]);

export default function ProjectDetailPage() {
  const { id: projectId = "" } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("board"));
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskWeight, setNewSubtaskWeight] = useState("10");

  const permissions = useProjectPermissions(projectId);

  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useQuery(PROJECT_DETAIL_QUERY, {
    variables: { id: projectId },
    skip: !projectId,
  });

  const project = projectData?.getProject;

  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery(PROJECT_TASKS_QUERY, {
    variables: { limit: 100, filters: { projectId } },
    skip: !projectId,
  });

  const {
    data: membersData,
    loading: membersLoading,
    error: membersError,
    refetch: refetchMembers,
  } = useQuery(PROJECT_MEMBERS_QUERY, {
    variables: { projectId },
    skip: !projectId,
  });

  const { data: taskDetailData, refetch: refetchTaskDetail } = useQuery(TASK_DETAIL_QUERY, {
    variables: { id: selectedTaskId ?? "" },
    skip: !selectedTaskId,
  });

  const { data: rolesData } = useQuery(PROJECT_ROLES_QUERY, { variables: { limit: 50 } });
  const { data: usersData } = useQuery(PROJECT_USERS_QUERY, { variables: { limit: 50 } });

  const projectRoles = useMemo(
    () =>
      (rolesData?.getRoles?.nodes ?? ([] as ProjectRoleOption[])).filter((role: ProjectRoleOption) =>
        PROJECT_ROLE_CODES.has(role.code),
      ),
    [rolesData],
  );

  const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to update task"),
    onCompleted: () => refetchTasks(),
  });

  const [createTask, { loading: creatingTask, error: createTaskError }] = useMutation(CREATE_TASK_MUTATION, {
    refetchQueries: ["ProjectTasks", "ProjectDetail"],
    onCompleted: () => {
      toast.success("Task created");
      setCreateTaskOpen(false);
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to create task"),
  });

  const [addMember, { loading: addingMember, error: addMemberError }] = useMutation(ADD_PROJECT_MEMBER_MUTATION, {
    refetchQueries: ["ProjectMembers", "ProjectDetail"],
    onCompleted: () => {
      toast.success("Member added");
      setAddMemberOpen(false);
      refetchMembers();
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to add member"),
  });

  const [createSubtask, { loading: creatingSubtask }] = useMutation(CREATE_SUBTASK_MUTATION, {
    onCompleted: () => {
      setNewSubtaskTitle("");
      refetchTaskDetail();
      refetchTasks();
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to add subtask"),
  });

  const [updateSubtask] = useMutation(UPDATE_SUBTASK_MUTATION, {
    onCompleted: () => {
      refetchTaskDetail();
      refetchTasks();
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to update subtask"),
  });

  const tasks: BoardTask[] = tasksData?.getTasks?.nodes ?? [];
  const members = membersData?.getProjectMembers?.nodes ?? [];
  const selectedTask = taskDetailData?.getTask;

  const isInitialLoading = (projectLoading || tasksLoading) && !project && !tasksData;
  const hasError = projectError || tasksError;

  const memberColumns = [
    { label: "Name", fieldName: "fullName" },
    { label: "Email", fieldName: "email" },
    { label: "Role", fieldName: "roleName" },
    { label: "Joined", fieldName: "joinedAt", type: "DATETIME" as const },
  ];

  const handleDragEnd = async (result: DropResult, item: BoardTask | undefined) => {
    if (!item || !result.destination) return;
    const nextStatus = result.destination.droppableId;
    if (nextStatus === item.status || !permissions.canChangeTaskStatus) return;

    await updateTask({
      variables: {
        id: item.id,
        status: nextStatus,
        progress: nextStatus === "DONE" ? 100 : nextStatus === "TODO" ? 0 : item.progress,
      },
    });
  };

  const subtaskWeights = (selectedTask?.subtasks ?? ([] as SubtaskItem[])).map((subtask: SubtaskItem) => subtask.weight);

  const renderBoard = () => {
    if (tasksLoading && !tasksData) {
      return <div className="text-sm text-muted-foreground">Loading board…</div>;
    }
    if (tasksError) {
      return <ErrorAlert error={getGraphQLErrorMessage(tasksError)} />;
    }

    return (
      <KanbanBoard
        columns={KANBAN_COLUMNS}
        items={tasks}
        onDragEnd={handleDragEnd}
        renderCard={(task, dragHandleProps, isDragging) => (
          <KanbanTaskCard
            title={task.title}
            priority={task.priority}
            progress={task.progress}
            weight={task.weight}
            assignees={(task.assignees ?? []).map((entry) => ({
              fullName: entry.user?.fullName ?? entry.user?.email,
            }))}
            dragHandleProps={permissions.canChangeTaskStatus ? dragHandleProps : null}
            isDragging={isDragging}
            onClick={() => setSelectedTaskId(task.id)}
          />
        )}
      />
    );
  };

  const renderSettings = () => {
    if (membersLoading && !membersData) {
      return <DataTableSkeleton showIndexColumn columns={memberColumns} />;
    }
    if (membersError) {
      return <ErrorAlert error={getGraphQLErrorMessage(membersError)} />;
    }

    return <DataTable showIndexColumn data={members} columns={memberColumns} />;
  };

  if (!projectId) {
    return (
      <Layout title="Project" breadcrumbs={[{ label: "Projects", href: "/projects" }]}>
        <ErrorAlert error="Project not found." />
      </Layout>
    );
  }

  if (isInitialLoading) {
    return (
      <Layout title="Project" breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "…" }]}>
        <div className="space-y-4">
          <EntityCard title="Loading project…" className="animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (hasError || !project) {
    return (
      <Layout title="Project" breadcrumbs={[{ label: "Projects", href: "/projects" }]}>
        <ErrorAlert error={getGraphQLErrorMessage(projectError) || "Unable to load project."} />
      </Layout>
    );
  }

  return (
    <Layout
      title={project.name}
      subtitle={project.description ?? undefined}
      breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: project.name }]}
    >
      <div className="space-y-6 pb-6">
        <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Progress</p>
              <p className="text-sm text-muted-foreground mt-1">
                {project.memberCount} members
                {project.myRoleName ? ` · Your role: ${project.myRoleName}` : null}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">{formatStatus(project.status.toLowerCase())}</div>
          </div>
          <ProgressWithLabel value={project.progressPercent} />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="board" className="mt-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <WeightSummary weights={tasks.map((task) => task.weight)} label="Remaining project task weight" />
              {permissions.canCreateTask ? (
                <FormDialog
                  open={createTaskOpen}
                  onOpenChange={setCreateTaskOpen}
                  trigger={<Button>Create task</Button>}
                  title="Create task"
                  description="Add a weighted task to this project board."
                  schema={CreateTaskSchema}
                  loading={creatingTask}
                  error={createTaskError}
                  submitLabel="Create task"
                  onSubmit={async (formData) => {
                    await createTask({
                      variables: {
                        projectId,
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
                      <FormInput type="text" fieldName="title" label="Title" required colSpan="full" />
                      <FormInput fieldName="description" label="Description" type="textarea" colSpan="full" />
                      <FormInput
                        type="number"
                        fieldName="weight"
                        label="Weight (%)"
                        required
                        colSpan="full"
                        defaultValue={10}
                      />
                      <FormInput
                        fieldName="priority"
                        label="Priority"
                        type="select"
                        colSpan="full"
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
            {renderBoard()}
          </TabsContent>
          <TabsContent value="settings" className="mt-4 space-y-4">
            <PageSection
              title="Members"
              action={
                permissions.canInviteMember ? (
                  <FormDialog
                    open={addMemberOpen}
                    onOpenChange={setAddMemberOpen}
                    trigger={<Button variant="outline">Add member</Button>}
                    title="Add project member"
                    description="Invite a user and assign their project role."
                    schema={AddMemberSchema}
                    loading={addingMember}
                    error={addMemberError}
                    submitLabel="Add member"
                    onSubmit={async (formData) => {
                      await addMember({
                        variables: {
                          projectId,
                          memberUserId: formData.memberUserId,
                          roleId: formData.roleId,
                        },
                      });
                    }}
                  >
                    {({ FormInput }) => (
                      <>
                        <FormInput
                          fieldName="memberUserId"
                          label="User"
                          type="select"
                          required
                          colSpan="full"
                          options={(usersData?.getUsers?.nodes ?? ([] as UserOption[])).map((user: UserOption) => ({
                            label: user.fullName ?? user.email ?? user.id,
                            value: user.id,
                          }))}
                        />
                        <FormInput
                          fieldName="roleId"
                          label="Project role"
                          type="select"
                          required
                          colSpan="full"
                          options={projectRoles.map((role: ProjectRoleOption) => ({
                            label: role.name,
                            value: role.id,
                          }))}
                        />
                      </>
                    )}
                  </FormDialog>
                ) : null
              }
            >
              {renderSettings()}
            </PageSection>
          </TabsContent>
        </Tabs>
      </div>

      <DetailSheet
        open={Boolean(selectedTaskId)}
        onOpenChange={(open) => {
          if (!open) setSelectedTaskId(null);
        }}
        title={selectedTask?.title ?? "Task"}
        description={selectedTask?.description ?? undefined}
      >
        {selectedTask ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={selectedTask.status} />
              <PriorityBadge priority={selectedTask.priority} />
            </div>
            <ProgressWithLabel value={selectedTask.progress} />
            <AssigneeStack
              assignees={(selectedTask.assignees ?? ([] as TaskAssigneeRow[])).map((entry: TaskAssigneeRow) => ({
                fullName: entry.user?.fullName ?? entry.user?.email,
              }))}
            />
            {selectedTask.type === "CHECKLIST" ? (
              <div className="space-y-3">
                <WeightSummary weights={subtaskWeights} label="Remaining subtask weight" />
                <ul className="space-y-2">
                  {(selectedTask.subtasks ?? ([] as SubtaskItem[])).map((subtask: SubtaskItem) => (
                    <li key={subtask.id} className="flex items-center gap-2 rounded-md border border-neutral-200 p-2">
                      <Checkbox
                        checked={subtask.isComplete}
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
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="Subtask title"
                    value={newSubtaskTitle}
                    onChange={(event) => setNewSubtaskTitle(event.target.value)}
                  />
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    className="sm:w-24"
                    value={newSubtaskWeight}
                    onChange={(event) => setNewSubtaskWeight(event.target.value)}
                  />
                  <Button
                    loading={creatingSubtask}
                    disabled={!newSubtaskTitle.trim()}
                    onClick={() =>
                      createSubtask({
                        variables: {
                          taskId: selectedTask.id,
                          title: newSubtaskTitle.trim(),
                          weight: Number(newSubtaskWeight) || 0,
                        },
                      })
                    }
                  >
                    Add subtask
                  </Button>
                </div>
              </div>
            ) : null}
            <Button variant="outline" className="w-full" onClick={() => navigate(`/projects/${projectId}?tab=board`)}>
              Close
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading task…</p>
        )}
      </DetailSheet>
    </Layout>
  );
}
