import { useQuery } from "@apollo/client";
import { ListTodo } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/DataTable";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { KpiGrid } from "@/components/KpiCard";
import Layout from "@/components/Layout";
import { PageSection } from "@/components/PageSection";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { isPlatformAdmin } from "@/utils/permissions";

import { ActiveTimerCard } from "./ActiveTimerCard";
import { AttentionList } from "./AttentionList";
import { DashboardChartsSkeleton } from "./DashboardChartsSkeleton";
import { DashboardScopeHeader } from "./DashboardScopeHeader";
import { DASHBOARD_QUERY } from "./dashboard-query";
import { ProjectHealthList } from "./ProjectHealthList";
import { ProjectProgressChart } from "./ProjectProgressChart";
import { ProjectRiskTasksTable } from "./ProjectRiskTasksTable";
import { RecentActivityList } from "./RecentActivityList";
import { TaskStatusChart } from "./TaskStatusChart";
import { TasksDueChart } from "./TasksDueChart";
import { TeamWorkloadChart } from "./TeamWorkloadChart";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = isPlatformAdmin(user?.roleCode);

  const welcomeTitle = useMemo(() => {
    const name = user?.fullName || user?.email;
    return name ? `Welcome back, ${name} 👋` : "Welcome back 👋";
  }, [user]);

  const { data, loading, error } = useQuery(DASHBOARD_QUERY);

  const isInitialLoading = loading && !data;
  const dashboard = data?.getDashboard;

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

  const renderCharts = () => {
    if (isInitialLoading) return <DashboardChartsSkeleton />;
    if (error) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;

    return (
      <>
        <div className="grid gap-3 lg:grid-cols-3">
          <TaskStatusChart breakdown={dashboard?.taskStatusBreakdown ?? []} className="lg:col-span-1" />
          <ProjectProgressChart projects={dashboard?.projectCards ?? []} className="lg:col-span-2" />
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <TasksDueChart days={dashboard?.tasksDueByDay ?? []} className="lg:col-span-2" />
          <AttentionList items={dashboard?.attentionItems ?? []} className="lg:col-span-1" />
        </div>
      </>
    );
  };

  const renderMyTasks = () => {
    if (isInitialLoading) return <DataTableSkeleton showIndexColumn columns={taskColumns} />;
    if (error) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
    const myTasks = dashboard?.myTasks ?? [];
    if (myTasks.length === 0) {
      return <p className="text-sm text-muted-foreground">No tasks assigned to you yet.</p>;
    }
    return (
      <DataTable
        showIndexColumn
        data={myTasks}
        columns={taskColumns}
        onClick={(task) => navigate(`/projects/${task.projectId}/tasks/${task.id}`)}
      />
    );
  };

  const renderRecentUsers = () => {
    if (isInitialLoading) return <DataTableSkeleton showIndexColumn columns={userColumns} />;
    if (error) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
    return <DataTable showIndexColumn data={dashboard?.recentUsers ?? []} columns={userColumns} />;
  };

  return (
    <Layout title={welcomeTitle} breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-8 pb-6 min-w-0">
        <KpiGrid loading={isInitialLoading} kpis={dashboard?.kpis} />

        <section className="space-y-4">
          <DashboardScopeHeader label="For you" description="Tasks assigned to you and your personal workload" />

          {dashboard?.activeTimer ? <ActiveTimerCard timer={dashboard.activeTimer} /> : null}

          <div className="space-y-3 min-w-0">{renderCharts()}</div>
        </section>

        <section className="space-y-4">
          <DashboardScopeHeader
            label="On your projects"
            description="Delivery health across projects you belong to — any team member"
          />
          <KpiGrid loading={isInitialLoading} kpis={dashboard?.projectKpis} />

          <div className="grid gap-3 lg:grid-cols-2">
            <ProjectHealthList items={dashboard?.projectHealth ?? []} />
            <TeamWorkloadChart items={dashboard?.teamWorkload ?? []} />
          </div>

          <PageSection title="Overdue & blocked on projects">
            {isInitialLoading ? (
              <DataTableSkeleton
                showIndexColumn
                columns={[
                  { label: "Task" },
                  { label: "Project" },
                  { label: "Assignees" },
                  { label: "Status" },
                  { label: "Priority" },
                  { label: "Reason" },
                  { label: "Due" },
                ]}
              />
            ) : error ? (
              <ErrorAlert error={getGraphQLErrorMessage(error)} />
            ) : (
              <ProjectRiskTasksTable tasks={dashboard?.projectRiskTasks ?? []} />
            )}
          </PageSection>
        </section>

        <section className="space-y-4">
          <PageSection title="Recent activity">
            {isInitialLoading ? (
              <div className="h-24 rounded-md border border-neutral-200 bg-white shadow-xs animate-pulse" />
            ) : error ? (
              <ErrorAlert error={getGraphQLErrorMessage(error)} />
            ) : (
              <RecentActivityList items={dashboard?.recentActivity ?? []} />
            )}
          </PageSection>

          <PageSection
            title="My tasks"
            action={
              <Button variant="outline" size="sm" asChild>
                <Link to="/my-tasks">
                  <ListTodo className="size-4 mr-1.5" />
                  View all
                </Link>
              </Button>
            }
          >
            {renderMyTasks()}
          </PageSection>

          {isAdmin ? <PageSection title="Recent users">{renderRecentUsers()}</PageSection> : null}
        </section>
      </div>
    </Layout>
  );
}
