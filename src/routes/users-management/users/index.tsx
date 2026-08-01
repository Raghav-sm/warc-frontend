import { NetworkStatus, useQuery } from "@apollo/client";
import { parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";
import { gql } from "@/__generated__";

import { DataTable } from "@/components/DataTable";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import Layout from "@/components/Layout";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

const USERS_QUERY = gql(`
  query Users($page: Int, $limit: Int, $filters: UserFilterInputType) {
    getUsers(page: $page, limit: $limit, filters: $filters) {
      nodes {
        id
        email
        firstName
        lastName
        fullName
        roleName
        roleCode
        isActive
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

export default function UsersPage() {
  const [queryState, setQueryState] = useQueryStates(filterParsers);

  const filters = useMemo(() => {
    const result: { text?: string } = {};
    if (queryState.text?.trim()) {
      result.text = queryState.text.trim();
    }
    return result;
  }, [queryState]);

  const { data, loading, error, fetchMore, networkStatus } = useQuery(USERS_QUERY, {
    variables: {
      limit: 10,
      filters,
    },
    notifyOnNetworkStatusChange: true,
  });

  const pageInfo = data?.getUsers?.pageInfo;
  const users = data?.getUsers?.nodes ?? [];

  const isInitialLoading = loading && !data;
  const hasError = error || (!loading && !data);
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  const columns = [
    { label: "Name", fieldName: "fullName" },
    { label: "Email", fieldName: "email" },
    { label: "Role", fieldName: "roleName" },
    { label: "Status", fieldName: "isActive", formatter: (v: unknown) => (v ? "Active" : "Inactive") },
    { label: "Created At", fieldName: "createdAt", type: "DATETIME" as const },
  ];

  const renderContent = () => {
    if (isInitialLoading) return <DataTableSkeleton showIndexColumn columns={columns} />;
    if (hasError) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;

    return (
      <DataTable
        showIndexColumn
        key={JSON.stringify({ filters, limit: 10 })}
        data={users}
        columns={columns}
        pagination={{
          hasNextPage: pageInfo ? !pageInfo.isLastPage : false,
          loading: isFetchingMore,
          onLoadMore: () => {
            if (!pageInfo?.nextPage) return;
            void fetchMore({
              variables: {
                page: pageInfo.nextPage,
                limit: 10,
                filters,
              },
            });
          },
        }}
      />
    );
  };

  return (
    <Layout
      title="Users"
      breadcrumbs={[{ label: "User Management", href: "/user-management/members" }, { label: "Users" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search users..."
            value={queryState.text}
            onSearch={(value) => setQueryState({ text: value.trim() || "" })}
          />
          {queryState.text && (
            <Button variant="outline" onClick={() => setQueryState({ text: "" })}>
              Clear
            </Button>
          )}
        </div>
      }
    >
      {renderContent()}
    </Layout>
  );
}
