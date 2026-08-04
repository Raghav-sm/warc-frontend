import { useQuery } from "@apollo/client";
import { FolderKanban } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@/components/AuthProvider";
import { CardGrid } from "@/components/CardGrid";
import { DataTable } from "@/components/DataTable";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { EntityCard } from "@/components/EntityCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { KpiGrid } from "@/components/KpiCard";
import Layout from "@/components/Layout";
import { PageSection } from "@/components/PageSection";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ProgressWithLabel } from "@/components/ProgressWithLabel";
import { StatusBadge } from "@/components/StatusBadge";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import { DASHBOARD_QUERY } from "./dashboard-query";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const welcomeTitle = useMemo(() => {
    const name = user?.fullName || user?.email;
    return name ? `Welcome back, ${name} 👋` : "Welcome back 👋";
  }, [user]);

  const { data, loading, error } = useQuery(DASHBOARD_QUERY);

  const isInitialLoading = loading && !data;
  const recentUsers = data?.getDashboard?.recentUsers ?? [];
  const projectCards = (data?.getDashboard?.projectCards ?? []) as Array<{
    id: string;
    name: string;
    status: string;
    progressPercent: number;
    memberCount: number;
  }>;
  const myTasks = data?.getDashboard?.myTasks ?? [];

  const userColumns = [
    {
      label: "Name",
      fieldName: "firstName",
      formatter: (_v: unknown, row: { firstName: string; lastName: string }) => `${row.firstName} ${row.lastName}`,
    },
    { label: "Email", fieldName: "email" },
    { label: "Role", fieldName: "roleName" },
    { label: "Status", fieldName: "isActive", formatter: (v: unknown) => (v ? "Active" : "Inactive") },
    { label: "Created", fieldName: "createdAt", type: "DATETIME" as const },
  ];

  const taskColumns = [
    { label: "Task", fieldName: "title" },
    { label: "Project", fieldName: "projectName" },
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
    { label: "Progress", fieldName: "progress", formatter: (v: unknown) => `${v}%` },
    { label: "Due", fieldName: "dueDate", type: "DATETIME" as const },
  ];

  const renderRecentUsers = () => {
    if (isInitialLoading) return <DataTableSkeleton showIndexColumn columns={userColumns} />;
    if (error) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
    return <DataTable showIndexColumn data={recentUsers} columns={userColumns} />;
  };

  const renderMyTasks = () => {
    if (isInitialLoading) return <DataTableSkeleton showIndexColumn columns={taskColumns} />;
    if (error) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
    return (
      <DataTable
        showIndexColumn
        data={myTasks}
        columns={taskColumns}
        onClick={(task) => navigate(`/projects/${task.projectId}/tasks/${task.id}`)}
      />
    );
  };

  return (
    <Layout title={welcomeTitle} breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-6 pb-6">
        <KpiGrid loading={isInitialLoading} kpis={data?.getDashboard?.kpis} />

        <PageSection title="My projects">
          {isInitialLoading ? (
            <CardGrid loading skeletonCount={3} />
          ) : error ? (
            <ErrorAlert error={getGraphQLErrorMessage(error)} />
          ) : projectCards.length === 0 ? (
            <p className="text-sm text-muted-foreground">You are not on any projects yet.</p>
          ) : (
            <CardGrid>
              {projectCards.map((project) => (
                <EntityCard
                  key={project.id}
                  title={project.name}
                  subtitle={`${project.memberCount} members · ${project.status}`}
                  icon={FolderKanban}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  footer={<ProgressWithLabel value={project.progressPercent} />}
                />
              ))}
            </CardGrid>
          )}
        </PageSection>

        <PageSection title="My tasks">{renderMyTasks()}</PageSection>

        <PageSection title="Recent users">{renderRecentUsers()}</PageSection>
      </div>
    </Layout>
  );
}
