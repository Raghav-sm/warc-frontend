import { useNavigate } from "react-router";

import { DataTable } from "@/components/DataTable";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";

type ProjectRiskTask = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  isOverdue: boolean;
  isBlocked: boolean;
  assigneeNames: string[];
  reason: string;
};

type ProjectRiskTasksTableProps = {
  tasks: ProjectRiskTask[];
};

export function ProjectRiskTasksTable({ tasks }: ProjectRiskTasksTableProps) {
  const navigate = useNavigate();

  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No overdue or blocked tasks on your projects.</p>;
  }

  const columns = [
    { label: "Task", fieldName: "title" },
    { label: "Project", fieldName: "projectName" },
    {
      label: "Assignees",
      fieldName: "assigneeNames",
      formatter: (value: unknown) => (Array.isArray(value) ? value.join(", ") : "—"),
    },
    {
      label: "Status",
      fieldName: "status",
      formatter: (value: unknown) => <StatusBadge status={String(value)} />,
    },
    {
      label: "Priority",
      fieldName: "priority",
      formatter: (value: unknown) => <PriorityBadge priority={String(value)} />,
    },
    { label: "Reason", fieldName: "reason" },
    { label: "Due", fieldName: "dueDate", type: "DATETIME" as const },
  ];

  return (
    <DataTable
      showIndexColumn
      data={tasks}
      columns={columns}
      onClick={(task) => navigate(`/projects/${task.projectId}/tasks/${task.id}`)}
    />
  );
}
