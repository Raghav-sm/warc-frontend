import { useMemo } from "react";

import { useAuth } from "@/components/AuthProvider";

import { useProjectPermissions } from "./useProjectPermissions";

export type TaskCapabilityInput = {
  id: string;
  createdById: string;
  isBlocked?: boolean;
  assignees?: Array<{ userId: string }>;
};

export function useTaskCapabilities(projectId: string | undefined, task: TaskCapabilityInput | null | undefined) {
  const { user } = useAuth();
  const projectPerms = useProjectPermissions(projectId);

  return useMemo(() => {
    const userId = user?.id;
    const isBlocked = task?.isBlocked ?? false;
    const isCreator = Boolean(userId && task?.createdById === userId);
    const isAssignee = Boolean(userId && (task?.assignees ?? []).some((entry) => entry.userId === userId));

    const canEditTask = projectPerms.canEditAnyTask || (projectPerms.canEditOwnTask && (isCreator || isAssignee));
    const canChangeStatus = projectPerms.canChangeTaskStatus || canEditTask;

    return {
      ...projectPerms,
      canEditTask,
      canChangeStatus,
      canAssign: projectPerms.canAssignTask,
      canDelete: projectPerms.canDeleteTask,
      canComplete: canChangeStatus && !isBlocked,
      canManageDependencies: canEditTask,
      canManageSubtasks: canEditTask,
      canUploadFiles: true,
      canDeleteFile: (uploadedById: string) => Boolean(userId && (uploadedById === userId || projectPerms.canEditAnyTask)),
      canComment: true,
      canEditComment: (authorId: string) => Boolean(userId && (authorId === userId || projectPerms.canEditAnyTask)),
    };
  }, [user?.id, task, projectPerms]);
}

export type TaskCapabilities = ReturnType<typeof useTaskCapabilities>;
