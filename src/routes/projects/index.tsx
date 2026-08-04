import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import { FolderKanban, Plus } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

import { useAuth } from "@/components/AuthProvider";
import { CardGrid } from "@/components/CardGrid";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import { FormDialog } from "@/components/FormDialog";
import Layout from "@/components/Layout";
import { ProjectCard, type ProjectDisplayType } from "@/components/ProjectCard";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { MESSAGE_MAP, VALIDATION_RULES } from "@/utils/validation";

import { CREATE_PROJECT_MUTATION, PROJECTS_QUERY } from "./projects-query";

const CreateProjectSchema = z.object({
  name: z
    .string(MESSAGE_MAP.REQUIRED("Name"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Name"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message),
  description: z
    .string()
    .trim()
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message)
    .optional()
    .nullable(),
});

const filterParsers = {
  text: parseAsString.withDefault(""),
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { hasAllPermissions } = useAuth();
  const canCreate = hasAllPermissions("PROJECT_CREATE");
  const [createOpen, setCreateOpen] = useState(false);
  const [queryState, setQueryState] = useQueryStates(filterParsers);

  const filters = useMemo(() => {
    const result: { text?: string } = {};
    if (queryState.text?.trim()) {
      result.text = queryState.text.trim();
    }
    return result;
  }, [queryState]);

  const { data, loading, error, fetchMore, networkStatus } = useQuery(PROJECTS_QUERY, {
    variables: { limit: 12, filters },
    notifyOnNetworkStatusChange: true,
  });

  const [createProject, { loading: creating, error: createError }] = useMutation(CREATE_PROJECT_MUTATION, {
    refetchQueries: ["Projects"],
    onCompleted: (result) => {
      toast.success("Project created");
      setCreateOpen(false);
      const id = result.createProject?.id;
      if (id) navigate(`/projects/${id}`);
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to create project"),
  });

  const pageInfo = data?.getProjects?.pageInfo;
  const projects = (data?.getProjects?.nodes ?? []) as ProjectDisplayType[];
  const isInitialLoading = loading && !data;
  const hasError = error || (!loading && !data);
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;
  const hasActiveFilters = Boolean(queryState.text);

  const handleClearFilters = () => setQueryState({ text: "" });
  const handleSearch = (value: string) => setQueryState({ text: value.trim() || "" });

  const renderContent = () => {
    if (isInitialLoading) {
      return <CardGrid loading skeletonCount={8} />;
    }
    if (hasError) {
      return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
    }
    if (projects.length === 0) {
      return (
        <EmptyState
          title={hasActiveFilters ? "No projects match your search" : "No projects yet"}
          description={
            hasActiveFilters
              ? "Try a different search term or clear filters."
              : "Create a project to start planning work with your team."
          }
          icon={FolderKanban}
          action={
            canCreate ? (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create project
              </Button>
            ) : undefined
          }
        />
      );
    }

    return (
      <>
        <CardGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => navigate(`/projects/${project.id}`)} />
          ))}
        </CardGrid>
        {!pageInfo?.isLastPage ? (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              loading={isFetchingMore}
              onClick={() =>
                fetchMore({
                  variables: {
                    page: pageInfo?.nextPage,
                    limit: 12,
                    filters,
                  },
                })
              }
            >
              Load more
            </Button>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <Layout title="Projects" subtitle="Browse and manage projects you belong to." breadcrumbs={[{ label: "Projects" }]}>
      <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search projects"
            onSearch={handleSearch}
            value={queryState.text}
            onValueChange={handleSearch}
          />
          {hasActiveFilters ? (
            <Button variant="link" onClick={handleClearFilters} className="text-sm">
              Clear
            </Button>
          ) : null}
        </div>
        {canCreate ? (
          <FormDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            trigger={
              <Button>
                <Plus className="h-4 w-4" />
                Create project
              </Button>
            }
            title="Create project"
            description="Add a new project workspace for tasks and members."
            schema={CreateProjectSchema}
            loading={creating}
            error={createError}
            submitLabel="Create project"
            onSubmit={async (formData) => {
              await createProject({
                variables: {
                  name: formData.name,
                  description: formData.description,
                },
              });
            }}
          >
            {({ FormInput }) => (
              <>
                <FormInput type="text" fieldName="name" label="Name" required colSpan="full" />
                <FormInput fieldName="description" label="Description" type="textarea" colSpan="full" />
              </>
            )}
          </FormDialog>
        ) : null}
      </div>
      {renderContent()}
    </Layout>
  );
}
