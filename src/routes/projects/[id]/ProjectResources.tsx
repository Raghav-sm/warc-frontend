import { useQuery } from "@apollo/client";
import { FolderOpen } from "lucide-react";
import { useMemo } from "react";

import { AddResourceDialog } from "@/components/AddResourceDialog";
import { useAuth } from "@/components/AuthProvider";
import { CardGrid } from "@/components/CardGrid";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import { PageSection } from "@/components/PageSection";
import { ResourceCard, type ResourceNode } from "@/components/ResourceCard";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { PROJECT_MEMBERS_QUERY } from "@/routes/projects/[id]/project-detail-query";
import { GET_RESOURCES_QUERY } from "@/routes/projects/[id]/resource-query";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

type ProjectResourcesProps = {
  projectId: string;
};

type MemberOption = {
  userId: string;
  fullName?: string | null;
  email?: string | null;
};

export function ProjectResources({ projectId }: ProjectResourcesProps) {
  const { user } = useAuth();
  const permissions = useProjectPermissions(projectId);

  const { data, loading, error } = useQuery(GET_RESOURCES_QUERY, {
    variables: { projectId },
    skip: !projectId,
  });

  const { data: membersData } = useQuery(PROJECT_MEMBERS_QUERY, {
    variables: { projectId },
    skip: !projectId,
  });

  const memberOptions = useMemo(
    () =>
      ((membersData?.getProjectMembers?.nodes ?? []) as MemberOption[]).map((member) => ({
        label: member.fullName ?? member.email ?? member.userId,
        value: member.userId,
      })),
    [membersData],
  );

  const resources = (data?.getResources?.nodes ?? []) as ResourceNode[];

  const canManageResource = (createdById: string) =>
    Boolean(user?.id && (createdById === user.id || permissions.canEditProject));

  const renderContent = () => {
    if (loading && !data) {
      return <CardGrid loading skeletonCount={4} />;
    }

    if (error) {
      return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
    }

    if (resources.length === 0) {
      return (
        <EmptyState
          title="No resources yet"
          description="Add links to Figma, GitHub, docs, or upload files your team needs in one place."
          icon={FolderOpen}
          action={<AddResourceDialog projectId={projectId} memberOptions={memberOptions} />}
        />
      );
    }

    return (
      <CardGrid>
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            canManage={canManageResource(resource.createdById)}
            memberOptions={memberOptions}
          />
        ))}
      </CardGrid>
    );
  };

  return (
    <PageSection
      title="Resources"
      action={resources.length > 0 ? <AddResourceDialog projectId={projectId} memberOptions={memberOptions} /> : null}
    >
      {renderContent()}
    </PageSection>
  );
}
