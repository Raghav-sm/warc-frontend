import { useQuery } from "@apollo/client";
import { MessageSquare, Search as SearchIcon } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useNavigate } from "react-router";
import type { GlobalSearchQuery } from "@/__generated__/graphql";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import Layout from "@/components/Layout";
import { SearchInput } from "@/components/SearchInput";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import { SearchResultsSkeleton } from "./SearchResultsSkeleton";
import { GLOBAL_SEARCH_QUERY } from "./search-query";

const filterParsers = {
  q: parseAsString.withDefault(""),
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [queryState, setQueryState] = useQueryStates(filterParsers);
  const trimmedQuery = queryState.q.trim();
  const canSearch = trimmedQuery.length >= 2;

  const { data, loading, error } = useQuery(GLOBAL_SEARCH_QUERY, {
    variables: { query: trimmedQuery, limit: 10 },
    skip: !canSearch,
  });

  const results = data?.globalSearch;
  type SearchProject = GlobalSearchQuery["globalSearch"]["projects"][number];
  type SearchTask = GlobalSearchQuery["globalSearch"]["tasks"][number];
  type SearchComment = GlobalSearchQuery["globalSearch"]["comments"][number];
  const hasResults =
    (results?.projects?.length ?? 0) > 0 || (results?.tasks?.length ?? 0) > 0 || (results?.comments?.length ?? 0) > 0;

  const renderResults = () => {
    if (!canSearch) {
      return <p className="text-sm text-muted-foreground">Type at least 2 characters to search.</p>;
    }

    if (loading) {
      return <SearchResultsSkeleton />;
    }

    if (error) {
      return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
    }

    if (!hasResults) {
      return (
        <EmptyState
          title={`No results for "${trimmedQuery}"`}
          description="Try a different keyword or check spelling."
          icon={SearchIcon}
        />
      );
    }

    return (
      <div className="space-y-6">
        {(results?.projects?.length ?? 0) > 0 ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Projects ({results?.projects?.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results?.projects?.map((project: SearchProject) => (
                <button
                  key={project.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left hover:bg-muted/50"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <span className="font-medium">{project.name}</span>
                  <StatusBadge status={project.status} />
                </button>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {(results?.tasks?.length ?? 0) > 0 ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tasks ({results?.tasks?.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results?.tasks?.map((task: SearchTask) => (
                <button
                  key={task.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left hover:bg-muted/50"
                  onClick={() => navigate(`/projects/${task.projectId}/tasks/${task.id}`)}
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.projectName}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </button>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {(results?.comments?.length ?? 0) > 0 ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Comments ({results?.comments?.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results?.comments?.map((comment: SearchComment) => (
                <button
                  key={comment.id}
                  type="button"
                  className="flex w-full items-start gap-3 rounded-md border border-border px-3 py-2 text-left hover:bg-muted/50"
                  onClick={() => navigate(`/projects/${comment.projectId}/tasks/${comment.taskId}?tab=comments`)}
                >
                  <MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm line-clamp-2">{comment.bodySnippet}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {comment.taskTitle} · {comment.projectName}
                    </p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    );
  };

  return (
    <Layout
      title="Search"
      subtitle="Find projects, tasks, and comments across your workspace"
      breadcrumbs={[{ label: "Search" }]}
    >
      <div className="space-y-6 pb-6">
        <SearchInput
          className="w-full max-w-xl"
          value={queryState.q}
          onSearch={(value) => setQueryState({ q: value })}
          placeholder="Search projects, tasks, comments…"
        />
        {renderResults()}
      </div>
    </Layout>
  );
}
