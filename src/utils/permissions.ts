import { PermissionEnumType } from "@/__generated__/graphql";

export const PLATFORM_PERMISSIONS = [
  PermissionEnumType.UserView,
  PermissionEnumType.UserCreate,
  PermissionEnumType.UserUpdate,
  PermissionEnumType.UserDelete,
  PermissionEnumType.RoleView,
  PermissionEnumType.RoleManage,
  PermissionEnumType.SessionManage,
  PermissionEnumType.AuditLogView,
] as const;

/** Project/task/member flags — extend generated enum after codegen. */
export const PROJECT_PERMISSIONS = ["PROJECT_CREATE", "PROJECT_DELETE", "PROJECT_EDIT"] as const;

export const TASK_PERMISSIONS = [
  "TASK_CREATE",
  "TASK_EDIT_OWN",
  "TASK_EDIT_ANY",
  "TASK_DELETE",
  "TASK_ASSIGN",
  "TASK_CHANGE_STATUS",
] as const;

export const MEMBER_PERMISSIONS = ["MEMBER_INVITE", "MEMBER_REMOVE", "MEMBER_MANAGE_ROLES"] as const;

export const PERMISSIONS = [
  ...PLATFORM_PERMISSIONS,
  ...PROJECT_PERMISSIONS,
  ...TASK_PERMISSIONS,
  ...MEMBER_PERMISSIONS,
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export function isPlatformPermission(permission: Permission): permission is (typeof PLATFORM_PERMISSIONS)[number] {
  return (PLATFORM_PERMISSIONS as readonly string[]).includes(permission);
}

const PLATFORM_ADMIN_ROLE_CODES = new Set(["SUPER_ADMIN", "ADMIN"]);

export function isPlatformAdmin(roleCode: string | undefined | null): boolean {
  return roleCode != null && PLATFORM_ADMIN_ROLE_CODES.has(roleCode);
}
