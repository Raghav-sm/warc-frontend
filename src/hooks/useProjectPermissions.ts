import { useQuery } from "@apollo/client";
import { useMemo } from "react";

import { PROJECT_DETAIL_QUERY } from "@/routes/projects/[id]/project-detail-query";

export function useProjectPermissions(projectId: string | undefined) {
  const { data, loading } = useQuery(PROJECT_DETAIL_QUERY, {
    variables: { id: projectId ?? "" },
    skip: !projectId,
  });

  const permissionList = data?.getProject?.myPermissions ?? [];

  const permissions = useMemo(() => new Set<string>(permissionList), [permissionList]);

  const has = useMemo(
    () =>
      (...codes: string[]): boolean =>
        codes.every((code) => permissions.has(code)),
    [permissions],
  );

  return {
    loading: loading && !data,
    permissions,
    has,
    myRoleName: data?.getProject?.myRoleName ?? null,
    myRoleCode: data?.getProject?.myRoleCode ?? null,
    canCreateTask: has("TASK_CREATE"),
    canEditProject: has("PROJECT_EDIT"),
    canInviteMember: has("MEMBER_INVITE"),
    canManageMemberRoles: has("MEMBER_MANAGE_ROLES"),
    canRemoveMember: has("MEMBER_REMOVE"),
    canChangeTaskStatus: has("TASK_CHANGE_STATUS"),
  };
}
