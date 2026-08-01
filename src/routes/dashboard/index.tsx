import { useQuery } from "@apollo/client";
import { useMemo } from "react";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/DataTable";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { KpiGrid } from "@/components/KpiCard";
import Layout from "@/components/Layout";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import { DASHBOARD_QUERY } from "./dashboard-query";

export default function Dashboard() {
  const { user } = useAuth();
  const welcomeTitle = useMemo(() => {
    const name = user?.fullName || user?.email;
    return name ? `Welcome back, ${name} 👋` : "Welcome back 👋";
  }, [user]);

  const { data, loading, error } = useQuery(DASHBOARD_QUERY);

  const isInitialLoading = loading && !data;
  const recentUsers = data?.getDashboard?.recentUsers ?? [];

  const columns = [
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

  return (
    <Layout title={welcomeTitle} breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-6 pb-6">
        <KpiGrid loading={isInitialLoading} kpis={data?.getDashboard?.kpis} />
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Users</h2>
          {isInitialLoading ? (
            <DataTableSkeleton showIndexColumn columns={columns} />
          ) : error ? (
            <ErrorAlert error={getGraphQLErrorMessage(error)} />
          ) : (
            <DataTable showIndexColumn data={recentUsers} columns={columns} />
          )}
        </div>
      </div>
    </Layout>
  );
}
