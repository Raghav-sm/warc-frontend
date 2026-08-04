import { NetworkStatus, useQuery } from "@apollo/client";
import { ListTodo } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import { DataTable } from "@/components/DataTable";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import Layout from "@/components/Layout";
import { PriorityBadge } from "@/components/PriorityBadge";
import { SearchInput } from "@/components/SearchInput";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { PROJECTS_QUERY } from "@/routes/projects/projects-query";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { MY_TASKS_QUERY } from "./my-tasks-query";

const filterParsers = {
  q: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  project: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "To do", value: "TODO" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

export default function MyTasksPage() {
  const navigate = useNavigate();
  const [queryState, setQueryState] = useQueryStates(filterParsers);

  const filters = useMemo(() => {
    const result: { text?: string; status?: string; projectId?: string } = {};
    if (queryState.q.trim()) result.text = queryState.q.trim();
    if (queryState.status) result.status = queryState.status;
    if (queryState.project) result.projectId = queryState.project;
    return result;
  }, [queryState]);

  const { data: projectsData } = useQuery(PROJECTS_QUERY, {
    variables: { limit: 100 },
  });

  const projectNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projectsData?.getProjects?.nodes ?? []) {
      map.set(p.id, p.name);
    }
    return map;
  }, [projectsData]);

  const { data, loading, error, networkStatus } = useQuery(MY_TASKS_QUERY, {
    variables: { page: queryState.page, limit: 20, filters },
    notifyOnNetworkStatusChange: true,
  });

  const tasks = data?.getMyTasks?.nodes ?? [];
  const pageInfo = data?.getMyTasks?.pageInfo;
  const isInitialLoading = loading && !data;
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  const projectOptions = [
    { label: "All projects", value: "" },
    ...(projectsData?.getProjects?.nodes ?? []).map((p: { id: string; name: string }) => ({
      label: p.name,
      value: p.id,
    })),
  ];

  const columns = [
    { label: "Task", fieldName: "title" },
    {
      label: "Project",
      fieldName: "projectId",
      formatter: (value: unknown) => projectNameById.get(String(value)) ?? String(value),
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
    {
      label: "Progress",
      fieldName: "progress",
      formatter: (value: unknown) => `${value}%`,
    },
    { label: "Due", fieldName: "dueDate", type: "DATETIME" as const },
  ];

  const renderContent = () => {
    if (isInitialLoading) return <DataTableSkeleton showIndexColumn columns={columns} />;
    if (error) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
    if (tasks.length === 0) {
      return (
        <EmptyState
          title="No assigned tasks"
          description="Tasks assigned to you across your projects will appear here."
          icon={ListTodo}
        />
      );
    }

    return (
      <DataTable
        showIndexColumn
        data={tasks}
        columns={columns}
        onClick={(task) => navigate(`/projects/${task.projectId}/tasks/${task.id}`)}
        pagination={
          pageInfo
            ? {
                totalCount: pageInfo.totalCount,
                hasNextPage: !pageInfo.isLastPage,
                loading: isFetchingMore,
                onLoadMore: () => {},
              }
            : undefined
        }
      />
    );
  };

  return (
    <Layout title="My Tasks" subtitle="Tasks assigned to you across active projects" breadcrumbs={[{ label: "My Tasks" }]}>
      <div className="space-y-4 pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <SearchInput
            value={queryState.q}
            onSearch={(value) => setQueryState({ q: value.trim() || "", page: 1 })}
            placeholder="Search tasks…"
          />
          <NativeSelect
            className="w-48"
            value={queryState.status}
            onChange={(e) => setQueryState({ status: e.target.value, page: 1 })}
          >
            {STATUS_OPTIONS.map((opt) => (
              <NativeSelectOption key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            className="w-48"
            value={queryState.project}
            onChange={(e) => setQueryState({ project: e.target.value, page: 1 })}
          >
            {projectOptions.map((opt) => (
              <NativeSelectOption key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {queryState.q || queryState.status || queryState.project ? (
            <Button variant="outline" onClick={() => setQueryState({ q: "", status: "", project: "", page: 1 })}>
              Clear filters
            </Button>
          ) : null}
        </div>

        {renderContent()}

        {pageInfo && pageInfo.pageCount > 1 ? (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pageInfo.isFirstPage}
              onClick={() => setQueryState({ page: Math.max(1, queryState.page - 1) })}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              Page {pageInfo.currentPage} of {pageInfo.pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pageInfo.isLastPage}
              onClick={() => setQueryState({ page: queryState.page + 1 })}
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
