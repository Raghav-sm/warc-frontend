import { NetworkStatus, useQuery } from "@apollo/client";
import { parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { gql } from "@/__generated__";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/DataTable";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import Layout from "@/components/Layout";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import CreateRoleDialogButton from "./CreateRoleDialogButton";

const ROLES_QUERY = gql(`
  query Roles($page: Int, $limit: Int, $filters: RoleFilterInputType) {
    getRoles(page: $page, limit: $limit, filters: $filters) {
      nodes {
        id
        code
        name
        description
        createdAt
      }
      pageInfo {
        isFirstPage
        isLastPage
        currentPage
        previousPage
        nextPage
        pageCount
        totalCount
      }
    }
  }
`);

const filterParsers = {
  text: parseAsString.withDefault(""),
};

export default function RolesAndAssignments() {
  const { hasAllPermissions } = useAuth();
  const canManageRoles = hasAllPermissions("ROLE_MANAGE");
  const navigate = useNavigate();
  const [queryState, setQueryState] = useQueryStates(filterParsers);

  const filters = useMemo(() => {
    const result: { text?: string } = {};
    if (queryState.text?.trim()) {
      result.text = queryState.text.trim();
    }
    return result;
  }, [queryState]);

  const { data, loading, error, fetchMore, networkStatus } = useQuery(ROLES_QUERY, {
    variables: {
      limit: 10,
      filters,
    },
    notifyOnNetworkStatusChange: true,
  });

  const pageInfo = data?.getRoles?.pageInfo;
  const roles = data?.getRoles?.nodes ?? [];

  const isInitialLoading = loading && !data;
  const hasError = error || (!loading && !data);
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  const hasActiveFilters = !!queryState.text;

  const handleClearFilters = () => {
    setQueryState({ text: "" });
  };

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    setQueryState({ text: trimmed || "" });
  };

  const columns = [
    { label: "Code", fieldName: "code" },
    { label: "Name", fieldName: "name" },
    { label: "Description", fieldName: "description" },
    { label: "Created At", fieldName: "createdAt", type: "DATETIME" as const },
  ];

  const renderContent = () => {
    if (isInitialLoading) return <DataTableSkeleton showIndexColumn columns={columns} />;
    if (hasError) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;

    return (
      <DataTable
        showIndexColumn
        key={JSON.stringify({ filters, limit: 10 })}
        data={roles}
        columns={columns}
        onClick={(role) => navigate(`/user-management/roles/${role.id}`)}
        pagination={{
          ...pageInfo,
          onLoadMore: () =>
            fetchMore({
              variables: {
                page: pageInfo?.nextPage,
                limit: 10,
                filters,
              },
            }),
          totalCount: pageInfo?.totalCount,
          hasNextPage: !pageInfo?.isLastPage,
          loading: isFetchingMore,
        }}
      />
    );
  };

  return (
    <Layout
      title="Roles and assignments"
      subtitle="Create roles, assign them to users, and open a role to edit details."
      breadcrumbs={[{ label: "Roles and assignments" }]}
    >
      <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search roles"
            onSearch={handleSearch}
            value={queryState.text}
            onValueChange={handleSearch}
          />
          {hasActiveFilters && (
            <Button variant="link" onClick={handleClearFilters} className="text-sm">
              Clear
            </Button>
          )}
        </div>
        {canManageRoles ? <CreateRoleDialogButton /> : null}
      </div>
      {renderContent()}
    </Layout>
  );
}
