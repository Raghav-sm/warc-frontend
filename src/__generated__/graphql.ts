/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: { input: any; output: any; }
};

export type ActiveTimerType = {
  __typename?: 'ActiveTimerType';
  id: Scalars['ID']['output'];
  startedAt: Scalars['DateTime']['output'];
  taskId: Scalars['ID']['output'];
  taskTitle?: Maybe<Scalars['String']['output']>;
};

export type AttachmentType = {
  __typename?: 'AttachmentType';
  commentId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  fileName: Scalars['String']['output'];
  fileType: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  size: Scalars['Int']['output'];
  taskId?: Maybe<Scalars['ID']['output']>;
  uploadedByFirstName?: Maybe<Scalars['String']['output']>;
  uploadedById: Scalars['ID']['output'];
  uploadedByLastName?: Maybe<Scalars['String']['output']>;
};

export type AttachmentsType = {
  __typename?: 'AttachmentsType';
  nodes: Array<AttachmentType>;
};

export type AuditLogFilterInputType = {
  action?: InputMaybe<Scalars['String']['input']>;
  actorId?: InputMaybe<Scalars['ID']['input']>;
  entityId?: InputMaybe<Scalars['ID']['input']>;
  entityType?: InputMaybe<Scalars['String']['input']>;
};

export type AuditLogType = {
  __typename?: 'AuditLogType';
  action: Scalars['String']['output'];
  actor?: Maybe<UserType>;
  actorId?: Maybe<Scalars['ID']['output']>;
  after?: Maybe<Scalars['JSON']['output']>;
  before?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['DateTime']['output'];
  entityId: Scalars['String']['output'];
  entityType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
};

export type AuditLogsType = {
  __typename?: 'AuditLogsType';
  nodes: Array<AuditLogType>;
  pageInfo: PaginationType;
};

export type AuthPayloadType = {
  __typename?: 'AuthPayloadType';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type CommentType = {
  __typename?: 'CommentType';
  authorFirstName?: Maybe<Scalars['String']['output']>;
  authorId: Scalars['ID']['output'];
  authorLastName?: Maybe<Scalars['String']['output']>;
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  taskId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CommentsType = {
  __typename?: 'CommentsType';
  nodes: Array<CommentType>;
  pageInfo: PaginationType;
};

export type DashboardKpiType = {
  __typename?: 'DashboardKpiType';
  key: Scalars['String']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  tone: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type DashboardMyTaskType = {
  __typename?: 'DashboardMyTaskType';
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  priority: TaskPriorityEnumType;
  progress: Scalars['Int']['output'];
  projectId: Scalars['ID']['output'];
  projectName: Scalars['String']['output'];
  status: TaskStatusEnumType;
  title: Scalars['String']['output'];
};

export type DashboardProjectCardType = {
  __typename?: 'DashboardProjectCardType';
  id: Scalars['ID']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  progressPercent: Scalars['Int']['output'];
  status: ProjectStatusEnumType;
};

export type DashboardRecentUserType = {
  __typename?: 'DashboardRecentUserType';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  roleName: Scalars['String']['output'];
};

export type DashboardType = {
  __typename?: 'DashboardType';
  kpis: Array<DashboardKpiType>;
  myTasks: Array<DashboardMyTaskType>;
  projectCards: Array<DashboardProjectCardType>;
  recentUsers: Array<DashboardRecentUserType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addProjectMember?: Maybe<ProjectMemberType>;
  addTaskAssignee?: Maybe<TaskType>;
  addTaskDependency?: Maybe<TaskDependencyItemType>;
  assignUserRole?: Maybe<UserType>;
  createAttachment?: Maybe<AttachmentType>;
  createComment?: Maybe<CommentType>;
  createProject?: Maybe<ProjectDisplayType>;
  createRole?: Maybe<RoleType>;
  createSubtask?: Maybe<TaskType>;
  createTask?: Maybe<TaskType>;
  createTimeLog?: Maybe<TimeLogType>;
  createUser?: Maybe<UserType>;
  deleteAttachment?: Maybe<Scalars['Boolean']['output']>;
  deleteComment?: Maybe<Scalars['Boolean']['output']>;
  deleteProject: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteSubtask?: Maybe<TaskType>;
  deleteTask: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  getUploadSignature?: Maybe<UploadSignatureType>;
  login: AuthPayloadType;
  logout: Scalars['Boolean']['output'];
  markAllNotificationsRead?: Maybe<Scalars['Boolean']['output']>;
  markNotificationRead?: Maybe<NotificationType>;
  refreshToken: AuthPayloadType;
  removeProjectMember: Scalars['Boolean']['output'];
  removeTaskAssignee?: Maybe<TaskType>;
  removeTaskDependency?: Maybe<Scalars['Boolean']['output']>;
  revokeAllSessions: Scalars['Boolean']['output'];
  revokeOtherSessions: Scalars['Boolean']['output'];
  revokeSession: Scalars['Boolean']['output'];
  signUp: AuthPayloadType;
  startTimer?: Maybe<ActiveTimerType>;
  stopTimer?: Maybe<TimeLogType>;
  updateComment?: Maybe<CommentType>;
  updateProject?: Maybe<ProjectDisplayType>;
  updateProjectMemberRole?: Maybe<ProjectMemberType>;
  updateRole?: Maybe<RoleType>;
  updateSubtask?: Maybe<TaskType>;
  updateTask?: Maybe<TaskType>;
  updateUser?: Maybe<UserType>;
  updateUserById?: Maybe<UserType>;
};


export type MutationAddProjectMemberArgs = {
  memberUserId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
};


export type MutationAddTaskAssigneeArgs = {
  assigneeId: Scalars['ID']['input'];
  taskId: Scalars['ID']['input'];
};


export type MutationAddTaskDependencyArgs = {
  dependsOnTaskId: Scalars['ID']['input'];
  taskId: Scalars['ID']['input'];
};


export type MutationAssignUserRoleArgs = {
  id: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
};


export type MutationCreateAttachmentArgs = {
  commentId?: InputMaybe<Scalars['ID']['input']>;
  fileName: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  taskId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationCreateCommentArgs = {
  body: Scalars['String']['input'];
  taskId: Scalars['ID']['input'];
};


export type MutationCreateProjectArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationCreateRoleArgs = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  permissionCodes: Array<PermissionEnumType>;
};


export type MutationCreateSubtaskArgs = {
  taskId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  weight: Scalars['Int']['input'];
};


export type MutationCreateTaskArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  priority?: InputMaybe<TaskPriorityEnumType>;
  projectId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  type?: InputMaybe<TaskTypeEnumType>;
  weight: Scalars['Int']['input'];
};


export type MutationCreateTimeLogArgs = {
  endedAt: Scalars['DateTime']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  startedAt: Scalars['DateTime']['input'];
  taskId: Scalars['ID']['input'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  roleId: Scalars['ID']['input'];
};


export type MutationDeleteAttachmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubtaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGetUploadSignatureArgs = {
  projectId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  callbackUrl?: InputMaybe<Scalars['String']['input']>;
  emailOrEmployeeNumber: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationLogoutArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationMarkNotificationReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRemoveProjectMemberArgs = {
  memberUserId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
};


export type MutationRemoveTaskAssigneeArgs = {
  assigneeId: Scalars['ID']['input'];
  taskId: Scalars['ID']['input'];
};


export type MutationRemoveTaskDependencyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRevokeAllSessionsArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRevokeOtherSessionsArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRevokeSessionArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  callbackUrl?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationStartTimerArgs = {
  taskId: Scalars['ID']['input'];
};


export type MutationUpdateCommentArgs = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateProjectArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProjectStatusEnumType>;
};


export type MutationUpdateProjectMemberRoleArgs = {
  memberUserId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
};


export type MutationUpdateRoleArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  permissionCodes?: InputMaybe<Array<PermissionEnumType>>;
};


export type MutationUpdateSubtaskArgs = {
  id: Scalars['ID']['input'];
  isComplete?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateTaskArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  priority?: InputMaybe<TaskPriorityEnumType>;
  progress?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<TaskStatusEnumType>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TaskTypeEnumType>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserByIdArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['ID']['input']>;
};

export type MyTaskFilterInputType = {
  assigneeId?: InputMaybe<Scalars['ID']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<TaskStatusEnumType>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type MyTasksType = {
  __typename?: 'MyTasksType';
  nodes: Array<TaskType>;
  pageInfo: PaginationType;
};

export type NotificationType = {
  __typename?: 'NotificationType';
  createdAt: Scalars['DateTime']['output'];
  entityId: Scalars['ID']['output'];
  entityType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type NotificationsType = {
  __typename?: 'NotificationsType';
  nodes: Array<NotificationType>;
  pageInfo: PaginationType;
  unreadCount: Scalars['Int']['output'];
};

export type PaginationType = {
  __typename?: 'PaginationType';
  currentPage: Scalars['Int']['output'];
  isFirstPage: Scalars['Boolean']['output'];
  isLastPage: Scalars['Boolean']['output'];
  nextPage?: Maybe<Scalars['Int']['output']>;
  pageCount: Scalars['Int']['output'];
  previousPage?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export enum PermissionEnumType {
  AuditLogView = 'AUDIT_LOG_VIEW',
  MemberInvite = 'MEMBER_INVITE',
  MemberManageRoles = 'MEMBER_MANAGE_ROLES',
  MemberRemove = 'MEMBER_REMOVE',
  ProjectCreate = 'PROJECT_CREATE',
  ProjectDelete = 'PROJECT_DELETE',
  ProjectEdit = 'PROJECT_EDIT',
  RoleManage = 'ROLE_MANAGE',
  RoleView = 'ROLE_VIEW',
  SessionManage = 'SESSION_MANAGE',
  TaskAssign = 'TASK_ASSIGN',
  TaskChangeStatus = 'TASK_CHANGE_STATUS',
  TaskCreate = 'TASK_CREATE',
  TaskDelete = 'TASK_DELETE',
  TaskEditAny = 'TASK_EDIT_ANY',
  TaskEditOwn = 'TASK_EDIT_OWN',
  UserCreate = 'USER_CREATE',
  UserDelete = 'USER_DELETE',
  UserUpdate = 'USER_UPDATE',
  UserView = 'USER_VIEW'
}

export type ProjectDisplayType = {
  __typename?: 'ProjectDisplayType';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  memberCount: Scalars['Int']['output'];
  myPermissions: Array<PermissionEnumType>;
  myRoleCode?: Maybe<Scalars['String']['output']>;
  myRoleName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  ownerId: Scalars['ID']['output'];
  ownerName?: Maybe<Scalars['String']['output']>;
  progressPercent: Scalars['Int']['output'];
  status: ProjectStatusEnumType;
  taskCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProjectFilterInputType = {
  status?: InputMaybe<ProjectStatusEnumType>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ProjectMemberType = {
  __typename?: 'ProjectMemberType';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  lastName: Scalars['String']['output'];
  roleCode: Scalars['String']['output'];
  roleId: Scalars['ID']['output'];
  roleName: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type ProjectMembersType = {
  __typename?: 'ProjectMembersType';
  nodes: Array<ProjectMemberType>;
};

export enum ProjectStatusEnumType {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED'
}

export type ProjectsType = {
  __typename?: 'ProjectsType';
  nodes: Array<ProjectDisplayType>;
  pageInfo: PaginationType;
};

export type Query = {
  __typename?: 'Query';
  getActiveTimer?: Maybe<ActiveTimerType>;
  getAttachments?: Maybe<AttachmentsType>;
  getAuditLogs: AuditLogsType;
  getComments: CommentsType;
  getDashboard: DashboardType;
  getMyTasks?: Maybe<MyTasksType>;
  getNotifications?: Maybe<NotificationsType>;
  getProject: ProjectDisplayType;
  getProjectMembers: ProjectMembersType;
  getProjects: ProjectsType;
  getRole: RoleType;
  getRoles: RolesType;
  getSessions: SessionsType;
  getTask: TaskType;
  getTaskDependencies: TaskDependenciesType;
  getTasks: TasksType;
  getTimeLogs: TimeLogsType;
  getUser: UserType;
  getUsers: UsersType;
  me: UserType;
};


export type QueryGetAttachmentsArgs = {
  commentId?: InputMaybe<Scalars['ID']['input']>;
  taskId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetAuditLogsArgs = {
  filters?: InputMaybe<AuditLogFilterInputType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  taskId: Scalars['ID']['input'];
};


export type QueryGetMyTasksArgs = {
  filters?: InputMaybe<MyTaskFilterInputType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetProjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProjectMembersArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryGetProjectsArgs = {
  filters?: InputMaybe<ProjectFilterInputType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetRolesArgs = {
  filters?: InputMaybe<RoleFilterInputType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetSessionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTaskDependenciesArgs = {
  taskId: Scalars['ID']['input'];
};


export type QueryGetTasksArgs = {
  filters?: InputMaybe<TaskFilterInputType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetTimeLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  taskId: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUsersArgs = {
  filters?: InputMaybe<UserFilterInputType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type RoleFilterInputType = {
  permissionCodes?: InputMaybe<Array<PermissionEnumType>>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type RoleType = {
  __typename?: 'RoleType';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Array<PermissionEnumType>;
  updatedAt: Scalars['DateTime']['output'];
};

export type RolesType = {
  __typename?: 'RolesType';
  nodes: Array<RoleType>;
  pageInfo: PaginationType;
};

export type SessionType = {
  __typename?: 'SessionType';
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  revoked: Scalars['Boolean']['output'];
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: UserType;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
};

export type SessionsType = {
  __typename?: 'SessionsType';
  nodes: Array<SessionType>;
  pageInfo: PaginationType;
};

export type SubtaskType = {
  __typename?: 'SubtaskType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isComplete: Scalars['Boolean']['output'];
  taskId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  weight: Scalars['Int']['output'];
};

export type TaskAssigneeType = {
  __typename?: 'TaskAssigneeType';
  assignedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  taskId: Scalars['ID']['output'];
  user?: Maybe<UserType>;
  userId: Scalars['ID']['output'];
};

export type TaskDependenciesType = {
  __typename?: 'TaskDependenciesType';
  blockedBy: Array<TaskDependencyItemType>;
  blocks: Array<TaskDependencyItemType>;
  isBlocked: Scalars['Boolean']['output'];
};

export type TaskDependencyItemType = {
  __typename?: 'TaskDependencyItemType';
  dependsOnTaskId: Scalars['ID']['output'];
  dependsOnTaskStatus?: Maybe<TaskStatusEnumType>;
  dependsOnTaskTitle?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  taskId: Scalars['ID']['output'];
  taskTitle?: Maybe<Scalars['String']['output']>;
};

export type TaskFilterInputType = {
  assigneeId?: InputMaybe<Scalars['ID']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<TaskStatusEnumType>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export enum TaskPriorityEnumType {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  Urgent = 'URGENT'
}

export enum TaskStatusEnumType {
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  Todo = 'TODO'
}

export type TaskType = {
  __typename?: 'TaskType';
  assignees?: Maybe<Array<TaskAssigneeType>>;
  createdAt: Scalars['DateTime']['output'];
  createdByFirstName?: Maybe<Scalars['String']['output']>;
  createdById: Scalars['ID']['output'];
  createdByLastName?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isBlocked: Scalars['Boolean']['output'];
  priority: TaskPriorityEnumType;
  progress: Scalars['Int']['output'];
  projectId: Scalars['ID']['output'];
  status: TaskStatusEnumType;
  subtasks?: Maybe<Array<SubtaskType>>;
  title: Scalars['String']['output'];
  type: TaskTypeEnumType;
  updatedAt: Scalars['DateTime']['output'];
  weight: Scalars['Int']['output'];
};

export enum TaskTypeEnumType {
  Checklist = 'CHECKLIST',
  Simple = 'SIMPLE'
}

export type TasksType = {
  __typename?: 'TasksType';
  nodes: Array<TaskType>;
  pageInfo: PaginationType;
};

export type TimeLogType = {
  __typename?: 'TimeLogType';
  createdAt: Scalars['DateTime']['output'];
  durationMinutes?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  startedAt: Scalars['DateTime']['output'];
  taskId: Scalars['ID']['output'];
  userFirstName?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
  userLastName?: Maybe<Scalars['String']['output']>;
};

export type TimeLogsType = {
  __typename?: 'TimeLogsType';
  nodes: Array<TimeLogType>;
  totalMinutes: Scalars['Int']['output'];
};

export type UploadSignatureType = {
  __typename?: 'UploadSignatureType';
  apiKey: Scalars['String']['output'];
  cloudName: Scalars['String']['output'];
  folder: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
};

export type UserFilterInputType = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  roleId?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastName: Scalars['String']['output'];
  permissions?: Maybe<Array<Scalars['String']['output']>>;
  roleCode?: Maybe<Scalars['String']['output']>;
  roleId: Scalars['ID']['output'];
  roleName?: Maybe<Scalars['String']['output']>;
  sessions: SessionsType;
  updatedAt: Scalars['DateTime']['output'];
};


export type UserTypeSessionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type UsersType = {
  __typename?: 'UsersType';
  nodes: Array<UserType>;
  pageInfo: PaginationType;
};

export type AuthBootMeQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthBootMeQuery = { __typename?: 'Query', me: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName: string, fullName: string, roleId: string, roleCode?: string | null, roleName?: string | null, isActive?: boolean | null, permissions?: Array<string> | null, createdAt: any, updatedAt: any } };

export type NotificationsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type NotificationsQuery = { __typename?: 'Query', getNotifications?: { __typename?: 'NotificationsType', unreadCount: number, nodes: Array<{ __typename?: 'NotificationType', id: string, type: string, entityType: string, entityId: string, message: string, isRead: boolean, createdAt: any }> } | null };

export type MarkNotificationReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MarkNotificationReadMutation = { __typename?: 'Mutation', markNotificationRead?: { __typename?: 'NotificationType', id: string, isRead: boolean } | null };

export type MarkAllNotificationsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsReadMutation = { __typename?: 'Mutation', markAllNotificationsRead?: boolean | null };

export type LogoutMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type LoginMutationVariables = Exact<{
  emailOrEmployeeNumber: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayloadType', accessToken: string, refreshToken: string } };

export type SignUpMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'AuthPayloadType', accessToken: string, refreshToken: string } };

export type DashboardOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardOverviewQuery = { __typename?: 'Query', getDashboard: { __typename?: 'DashboardType', kpis: Array<{ __typename?: 'DashboardKpiType', key: string, title: string, subtitle?: string | null, value: string, tone: string }>, recentUsers: Array<{ __typename?: 'DashboardRecentUserType', id: string, email: string, firstName: string, lastName: string, roleName: string, isActive: boolean, createdAt: any }>, projectCards: Array<{ __typename?: 'DashboardProjectCardType', id: string, name: string, status: ProjectStatusEnumType, progressPercent: number, memberCount: number }>, myTasks: Array<{ __typename?: 'DashboardMyTaskType', id: string, title: string, projectId: string, projectName: string, status: TaskStatusEnumType, progress: number, priority: TaskPriorityEnumType, dueDate?: any | null }> } };

export type MyTasksQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<MyTaskFilterInputType>;
}>;


export type MyTasksQuery = { __typename?: 'Query', getMyTasks?: { __typename?: 'MyTasksType', nodes: Array<{ __typename?: 'TaskType', id: string, title: string, status: TaskStatusEnumType, priority: TaskPriorityEnumType, progress: number, projectId: string, dueDate?: any | null }>, pageInfo: { __typename?: 'PaginationType', isFirstPage: boolean, isLastPage: boolean, currentPage: number, previousPage?: number | null, nextPage?: number | null, pageCount: number, totalCount: number } } | null };

export type ProjectDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ProjectDetailQuery = { __typename?: 'Query', getProject: { __typename?: 'ProjectDisplayType', id: string, name: string, description?: string | null, status: ProjectStatusEnumType, progressPercent: number, memberCount: number, myPermissions: Array<PermissionEnumType>, myRoleName?: string | null, myRoleCode?: string | null, createdAt: any, updatedAt: any } };

export type ProjectTasksQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<TaskFilterInputType>;
}>;


export type ProjectTasksQuery = { __typename?: 'Query', getTasks: { __typename?: 'TasksType', nodes: Array<{ __typename?: 'TaskType', id: string, title: string, description?: string | null, type: TaskTypeEnumType, weight: number, progress: number, status: TaskStatusEnumType, priority: TaskPriorityEnumType, dueDate?: any | null, projectId: string, isBlocked: boolean, assignees?: Array<{ __typename?: 'TaskAssigneeType', id: string, userId: string, user?: { __typename?: 'UserType', id: string, fullName: string, email: string } | null }> | null }>, pageInfo: { __typename?: 'PaginationType', totalCount: number } } };

export type ProjectMembersQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type ProjectMembersQuery = { __typename?: 'Query', getProjectMembers: { __typename?: 'ProjectMembersType', nodes: Array<{ __typename?: 'ProjectMemberType', id: string, userId: string, firstName: string, lastName: string, email: string, fullName: string, roleId: string, roleCode: string, roleName: string, joinedAt: any }> } };

export type TaskDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TaskDetailQuery = { __typename?: 'Query', getTask: { __typename?: 'TaskType', id: string, title: string, description?: string | null, type: TaskTypeEnumType, weight: number, progress: number, status: TaskStatusEnumType, priority: TaskPriorityEnumType, dueDate?: any | null, projectId: string, subtasks?: Array<{ __typename?: 'SubtaskType', id: string, title: string, weight: number, isComplete: boolean }> | null, assignees?: Array<{ __typename?: 'TaskAssigneeType', id: string, userId: string, user?: { __typename?: 'UserType', id: string, fullName: string, email: string } | null }> | null } };

export type CreateTaskMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TaskTypeEnumType>;
  weight: Scalars['Int']['input'];
  priority?: InputMaybe<TaskPriorityEnumType>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'TaskType', id: string } | null };

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<TaskPriorityEnumType>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<TaskStatusEnumType>;
  progress?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask?: { __typename?: 'TaskType', id: string, title: string, description?: string | null, weight: number, priority: TaskPriorityEnumType, dueDate?: any | null, status: TaskStatusEnumType, progress: number, isBlocked: boolean } | null };

export type AddTaskAssigneeMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
  assigneeId: Scalars['ID']['input'];
}>;


export type AddTaskAssigneeMutation = { __typename?: 'Mutation', addTaskAssignee?: { __typename?: 'TaskType', id: string, assignees?: Array<{ __typename?: 'TaskAssigneeType', id: string, userId: string, user?: { __typename?: 'UserType', id: string, fullName: string, email: string } | null }> | null } | null };

export type RemoveTaskAssigneeMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
  assigneeId: Scalars['ID']['input'];
}>;


export type RemoveTaskAssigneeMutation = { __typename?: 'Mutation', removeTaskAssignee?: { __typename?: 'TaskType', id: string, assignees?: Array<{ __typename?: 'TaskAssigneeType', id: string, userId: string, user?: { __typename?: 'UserType', id: string, fullName: string, email: string } | null }> | null } | null };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask: boolean };

export type AddProjectMemberMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  memberUserId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
}>;


export type AddProjectMemberMutation = { __typename?: 'Mutation', addProjectMember?: { __typename?: 'ProjectMemberType', id: string } | null };

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProjectStatusEnumType>;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject?: { __typename?: 'ProjectDisplayType', id: string, name: string, description?: string | null, status: ProjectStatusEnumType } | null };

export type CreateSubtaskMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  weight: Scalars['Int']['input'];
}>;


export type CreateSubtaskMutation = { __typename?: 'Mutation', createSubtask?: { __typename?: 'TaskType', id: string, subtasks?: Array<{ __typename?: 'SubtaskType', id: string, title: string, weight: number, isComplete: boolean }> | null } | null };

export type UpdateSubtaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isComplete?: InputMaybe<Scalars['Boolean']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateSubtaskMutation = { __typename?: 'Mutation', updateSubtask?: { __typename?: 'TaskType', id: string, subtasks?: Array<{ __typename?: 'SubtaskType', id: string, title: string, weight: number, isComplete: boolean }> | null } | null };

export type ProjectRolesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ProjectRolesQuery = { __typename?: 'Query', getRoles: { __typename?: 'RolesType', nodes: Array<{ __typename?: 'RoleType', id: string, code: string, name: string }> } };

export type ProjectUsersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<UserFilterInputType>;
}>;


export type ProjectUsersQuery = { __typename?: 'Query', getUsers: { __typename?: 'UsersType', nodes: Array<{ __typename?: 'UserType', id: string, fullName: string, email: string }> } };

export type TaskWorkspaceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TaskWorkspaceQuery = { __typename?: 'Query', getTask: { __typename?: 'TaskType', id: string, title: string, description?: string | null, type: TaskTypeEnumType, weight: number, progress: number, status: TaskStatusEnumType, priority: TaskPriorityEnumType, dueDate?: any | null, projectId: string, createdById: string, isBlocked: boolean, subtasks?: Array<{ __typename?: 'SubtaskType', id: string, title: string, weight: number, isComplete: boolean }> | null, assignees?: Array<{ __typename?: 'TaskAssigneeType', id: string, userId: string, user?: { __typename?: 'UserType', id: string, fullName: string, email: string } | null }> | null } };

export type TaskCommentsQueryVariables = Exact<{
  taskId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TaskCommentsQuery = { __typename?: 'Query', getComments: { __typename?: 'CommentsType', nodes: Array<{ __typename?: 'CommentType', id: string, taskId: string, body: string, authorId: string, authorFirstName?: string | null, authorLastName?: string | null, createdAt: any, updatedAt: any }>, pageInfo: { __typename?: 'PaginationType', totalCount: number } } };

export type CreateCommentMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
  body: Scalars['String']['input'];
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment?: { __typename?: 'CommentType', id: string, body: string, authorId: string, authorFirstName?: string | null, authorLastName?: string | null, createdAt: any, updatedAt: any } | null };

export type UpdateCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  body: Scalars['String']['input'];
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment?: { __typename?: 'CommentType', id: string, body: string, updatedAt: any } | null };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment?: boolean | null };

export type TaskAttachmentsQueryVariables = Exact<{
  taskId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type TaskAttachmentsQuery = { __typename?: 'Query', getAttachments?: { __typename?: 'AttachmentsType', nodes: Array<{ __typename?: 'AttachmentType', id: string, taskId?: string | null, commentId?: string | null, fileUrl: string, fileName: string, fileType: string, size: number, uploadedById: string, uploadedByFirstName?: string | null, uploadedByLastName?: string | null, createdAt: any }> } | null };

export type GetUploadSignatureMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetUploadSignatureMutation = { __typename?: 'Mutation', getUploadSignature?: { __typename?: 'UploadSignatureType', signature: string, timestamp: number, apiKey: string, cloudName: string, folder: string } | null };

export type CreateAttachmentMutationVariables = Exact<{
  taskId?: InputMaybe<Scalars['ID']['input']>;
  fileUrl: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
  size: Scalars['Int']['input'];
}>;


export type CreateAttachmentMutation = { __typename?: 'Mutation', createAttachment?: { __typename?: 'AttachmentType', id: string, fileUrl: string, fileName: string, fileType: string, size: number, createdAt: any } | null };

export type DeleteAttachmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAttachmentMutation = { __typename?: 'Mutation', deleteAttachment?: boolean | null };

export type TaskDependenciesQueryVariables = Exact<{
  taskId: Scalars['ID']['input'];
}>;


export type TaskDependenciesQuery = { __typename?: 'Query', getTaskDependencies: { __typename?: 'TaskDependenciesType', isBlocked: boolean, blockedBy: Array<{ __typename?: 'TaskDependencyItemType', id: string, taskId: string, dependsOnTaskId: string, dependsOnTaskTitle?: string | null, dependsOnTaskStatus?: TaskStatusEnumType | null }>, blocks: Array<{ __typename?: 'TaskDependencyItemType', id: string, taskId: string, dependsOnTaskId: string, taskTitle?: string | null, dependsOnTaskStatus?: TaskStatusEnumType | null }> } };

export type AddTaskDependencyMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
  dependsOnTaskId: Scalars['ID']['input'];
}>;


export type AddTaskDependencyMutation = { __typename?: 'Mutation', addTaskDependency?: { __typename?: 'TaskDependencyItemType', id: string, taskId: string, dependsOnTaskId: string, dependsOnTaskTitle?: string | null, dependsOnTaskStatus?: TaskStatusEnumType | null } | null };

export type RemoveTaskDependencyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveTaskDependencyMutation = { __typename?: 'Mutation', removeTaskDependency?: boolean | null };

export type TaskTimeLogsQueryVariables = Exact<{
  taskId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TaskTimeLogsQuery = { __typename?: 'Query', getTimeLogs: { __typename?: 'TimeLogsType', totalMinutes: number, nodes: Array<{ __typename?: 'TimeLogType', id: string, taskId: string, userId: string, startedAt: any, endedAt?: any | null, durationMinutes?: number | null, note?: string | null, createdAt: any, userFirstName?: string | null, userLastName?: string | null }> } };

export type ActiveTimerQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveTimerQuery = { __typename?: 'Query', getActiveTimer?: { __typename?: 'ActiveTimerType', id: string, taskId: string, taskTitle?: string | null, startedAt: any } | null };

export type StartTimerMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
}>;


export type StartTimerMutation = { __typename?: 'Mutation', startTimer?: { __typename?: 'ActiveTimerType', id: string, taskId: string, taskTitle?: string | null, startedAt: any } | null };

export type StopTimerMutationVariables = Exact<{ [key: string]: never; }>;


export type StopTimerMutation = { __typename?: 'Mutation', stopTimer?: { __typename?: 'TimeLogType', id: string, taskId: string, durationMinutes?: number | null, startedAt: any, endedAt?: any | null } | null };

export type CreateTimeLogMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
  startedAt: Scalars['DateTime']['input'];
  endedAt: Scalars['DateTime']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateTimeLogMutation = { __typename?: 'Mutation', createTimeLog?: { __typename?: 'TimeLogType', id: string, durationMinutes?: number | null } | null };

export type TaskWorkspaceCreateSubtaskMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  weight: Scalars['Int']['input'];
}>;


export type TaskWorkspaceCreateSubtaskMutation = { __typename?: 'Mutation', createSubtask?: { __typename?: 'TaskType', id: string, subtasks?: Array<{ __typename?: 'SubtaskType', id: string, title: string, weight: number, isComplete: boolean }> | null } | null };

export type TaskWorkspaceUpdateSubtaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isComplete?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type TaskWorkspaceUpdateSubtaskMutation = { __typename?: 'Mutation', updateSubtask?: { __typename?: 'TaskType', id: string, subtasks?: Array<{ __typename?: 'SubtaskType', id: string, title: string, weight: number, isComplete: boolean }> | null } | null };

export type NotificationTaskContextQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type NotificationTaskContextQuery = { __typename?: 'Query', getTask: { __typename?: 'TaskType', id: string, projectId: string } };

export type UpdateTaskWorkspaceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<TaskPriorityEnumType>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<TaskStatusEnumType>;
  progress?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateTaskWorkspaceMutation = { __typename?: 'Mutation', updateTask?: { __typename?: 'TaskType', id: string, title: string, description?: string | null, weight: number, priority: TaskPriorityEnumType, dueDate?: any | null, status: TaskStatusEnumType, progress: number, isBlocked: boolean } | null };

export type AddTaskAssigneeWorkspaceMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
  assigneeId: Scalars['ID']['input'];
}>;


export type AddTaskAssigneeWorkspaceMutation = { __typename?: 'Mutation', addTaskAssignee?: { __typename?: 'TaskType', id: string, assignees?: Array<{ __typename?: 'TaskAssigneeType', id: string, userId: string, user?: { __typename?: 'UserType', id: string, fullName: string, email: string } | null }> | null } | null };

export type RemoveTaskAssigneeWorkspaceMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
  assigneeId: Scalars['ID']['input'];
}>;


export type RemoveTaskAssigneeWorkspaceMutation = { __typename?: 'Mutation', removeTaskAssignee?: { __typename?: 'TaskType', id: string, assignees?: Array<{ __typename?: 'TaskAssigneeType', id: string, userId: string, user?: { __typename?: 'UserType', id: string, fullName: string, email: string } | null }> | null } | null };

export type DeleteTaskWorkspaceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTaskWorkspaceMutation = { __typename?: 'Mutation', deleteTask: boolean };

export type ProjectsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<ProjectFilterInputType>;
}>;


export type ProjectsQuery = { __typename?: 'Query', getProjects: { __typename?: 'ProjectsType', nodes: Array<{ __typename?: 'ProjectDisplayType', id: string, name: string, description?: string | null, status: ProjectStatusEnumType, ownerName?: string | null, progressPercent: number, memberCount: number, taskCount: number, myRoleName?: string | null, myRoleCode?: string | null, createdAt: any, updatedAt: any }>, pageInfo: { __typename?: 'PaginationType', isFirstPage: boolean, isLastPage: boolean, currentPage: number, previousPage?: number | null, nextPage?: number | null, pageCount: number, totalCount: number } } };

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject?: { __typename?: 'ProjectDisplayType', id: string, name: string } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName: string, roleName?: string | null, sessions: { __typename?: 'SessionsType', nodes: Array<{ __typename?: 'SessionType', id: string, expiresAt: any, userAgent?: string | null, ipAddress?: string | null, revoked: boolean, revokedAt?: any | null, createdAt: any }>, pageInfo: { __typename?: 'PaginationType', totalCount: number } } } };

export type UpdateUserMutationVariables = Exact<{
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'UserType', id: string } | null };

export type CreateRoleMutationVariables = Exact<{
  name: Scalars['String']['input'];
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  permissionCodes: Array<PermissionEnumType> | PermissionEnumType;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole?: { __typename?: 'RoleType', id: string } | null };

export type RoleQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RoleQuery = { __typename?: 'Query', getRole: { __typename?: 'RoleType', id: string, code: string, name: string, description?: string | null, permissions: Array<PermissionEnumType> } };

export type UpdateRoleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  permissionCodes?: InputMaybe<Array<PermissionEnumType> | PermissionEnumType>;
}>;


export type UpdateRoleMutation = { __typename?: 'Mutation', updateRole?: { __typename?: 'RoleType', id: string } | null };

export type RolesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<RoleFilterInputType>;
}>;


export type RolesQuery = { __typename?: 'Query', getRoles: { __typename?: 'RolesType', nodes: Array<{ __typename?: 'RoleType', id: string, code: string, name: string, description?: string | null, createdAt: any }>, pageInfo: { __typename?: 'PaginationType', isFirstPage: boolean, isLastPage: boolean, currentPage: number, previousPage?: number | null, nextPage?: number | null, pageCount: number, totalCount: number } } };

export type UsersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<UserFilterInputType>;
}>;


export type UsersQuery = { __typename?: 'Query', getUsers: { __typename?: 'UsersType', nodes: Array<{ __typename?: 'UserType', id: string, email: string, firstName: string, lastName: string, fullName: string, roleName?: string | null, roleCode?: string | null, isActive?: boolean | null, createdAt: any }>, pageInfo: { __typename?: 'PaginationType', isFirstPage: boolean, isLastPage: boolean, currentPage: number, previousPage?: number | null, nextPage?: number | null, pageCount: number, totalCount: number } } };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthPayloadType', accessToken: string, refreshToken: string } };


export const AuthBootMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthBootMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"roleCode"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AuthBootMeQuery, AuthBootMeQueryVariables>;
export const NotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Notifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unreadOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"unreadOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unreadOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}}]}}]}}]} as unknown as DocumentNode<NotificationsQuery, NotificationsQueryVariables>;
export const MarkNotificationReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkNotificationRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markNotificationRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}}]}}]}}]} as unknown as DocumentNode<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;
export const MarkAllNotificationsReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkAllNotificationsRead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markAllNotificationsRead"}}]}}]} as unknown as DocumentNode<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailOrEmployeeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailOrEmployeeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailOrEmployeeNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"rememberMe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"rememberMe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const DashboardOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kpis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"tone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recentUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"projectCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercent"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"projectName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}}]}}]}}]}}]} as unknown as DocumentNode<DashboardOverviewQuery, DashboardOverviewQueryVariables>;
export const MyTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyTasks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MyTaskFilterInputType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyTasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isFirstPage"}},{"kind":"Field","name":{"kind":"Name","value":"isLastPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"previousPage"}},{"kind":"Field","name":{"kind":"Name","value":"nextPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<MyTasksQuery, MyTasksQueryVariables>;
export const ProjectDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercent"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"myPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"myRoleName"}},{"kind":"Field","name":{"kind":"Name","value":"myRoleCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ProjectDetailQuery, ProjectDetailQueryVariables>;
export const ProjectTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectTasks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskFilterInputType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"isBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectTasksQuery, ProjectTasksQueryVariables>;
export const ProjectMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProjectMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"roleCode"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectMembersQuery, ProjectMembersQueryVariables>;
export const TaskDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaskDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"subtasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaskDetailQuery, TaskDetailQueryVariables>;
export const CreateTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskTypeEnumType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"weight"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskPriorityEnumType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"weight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"weight"}}},{"kind":"Argument","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}},{"kind":"Argument","name":{"kind":"Name","value":"dueDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>;
export const UpdateTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"weight"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskPriorityEnumType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskStatusEnumType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"progress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"weight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"weight"}}},{"kind":"Argument","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}},{"kind":"Argument","name":{"kind":"Name","value":"dueDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"progress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"progress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"isBlocked"}}]}}]}}]} as unknown as DocumentNode<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const AddTaskAssigneeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddTaskAssignee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assigneeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTaskAssignee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"assigneeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assigneeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddTaskAssigneeMutation, AddTaskAssigneeMutationVariables>;
export const RemoveTaskAssigneeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveTaskAssignee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assigneeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTaskAssignee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"assigneeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assigneeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RemoveTaskAssigneeMutation, RemoveTaskAssigneeMutationVariables>;
export const DeleteTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const AddProjectMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddProjectMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addProjectMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddProjectMemberMutation, AddProjectMemberMutationVariables>;
export const UpdateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectStatusEnumType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const CreateSubtaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSubtask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"weight"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSubtask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"weight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"weight"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subtasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSubtaskMutation, CreateSubtaskMutationVariables>;
export const UpdateSubtaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSubtask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isComplete"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"weight"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSubtask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"isComplete"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isComplete"}}},{"kind":"Argument","name":{"kind":"Name","value":"weight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"weight"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subtasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSubtaskMutation, UpdateSubtaskMutationVariables>;
export const ProjectRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectRolesQuery, ProjectRolesQueryVariables>;
export const ProjectUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterInputType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectUsersQuery, ProjectUsersQueryVariables>;
export const TaskWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaskWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}},{"kind":"Field","name":{"kind":"Name","value":"isBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"subtasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaskWorkspaceQuery, TaskWorkspaceQueryVariables>;
export const TaskCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaskComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"authorFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"authorLastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<TaskCommentsQuery, TaskCommentsQueryVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"authorFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"authorLastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const UpdateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const DeleteCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const TaskAttachmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaskAttachments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAttachments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"commentId"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedById"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedByFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedByLastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<TaskAttachmentsQuery, TaskAttachmentsQueryVariables>;
export const GetUploadSignatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GetUploadSignature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUploadSignature"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"apiKey"}},{"kind":"Field","name":{"kind":"Name","value":"cloudName"}},{"kind":"Field","name":{"kind":"Name","value":"folder"}}]}}]}}]} as unknown as DocumentNode<GetUploadSignatureMutation, GetUploadSignatureMutationVariables>;
export const CreateAttachmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAttachment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAttachment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileName"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileType"}}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateAttachmentMutation, CreateAttachmentMutationVariables>;
export const DeleteAttachmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAttachment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAttachment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteAttachmentMutation, DeleteAttachmentMutationVariables>;
export const TaskDependenciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaskDependencies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTaskDependencies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"blockedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"dependsOnTaskId"}},{"kind":"Field","name":{"kind":"Name","value":"dependsOnTaskTitle"}},{"kind":"Field","name":{"kind":"Name","value":"dependsOnTaskStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"dependsOnTaskId"}},{"kind":"Field","name":{"kind":"Name","value":"taskTitle"}},{"kind":"Field","name":{"kind":"Name","value":"dependsOnTaskStatus"}}]}}]}}]}}]} as unknown as DocumentNode<TaskDependenciesQuery, TaskDependenciesQueryVariables>;
export const AddTaskDependencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddTaskDependency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dependsOnTaskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTaskDependency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"dependsOnTaskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dependsOnTaskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"dependsOnTaskId"}},{"kind":"Field","name":{"kind":"Name","value":"dependsOnTaskTitle"}},{"kind":"Field","name":{"kind":"Name","value":"dependsOnTaskStatus"}}]}}]}}]} as unknown as DocumentNode<AddTaskDependencyMutation, AddTaskDependencyMutationVariables>;
export const RemoveTaskDependencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveTaskDependency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTaskDependency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveTaskDependencyMutation, RemoveTaskDependencyMutationVariables>;
export const TaskTimeLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaskTimeLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTimeLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"userLastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalMinutes"}}]}}]}}]} as unknown as DocumentNode<TaskTimeLogsQuery, TaskTimeLogsQueryVariables>;
export const ActiveTimerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActiveTimer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActiveTimer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"taskTitle"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<ActiveTimerQuery, ActiveTimerQueryVariables>;
export const StartTimerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartTimer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTimer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"taskTitle"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<StartTimerMutation, StartTimerMutationVariables>;
export const StopTimerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StopTimer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopTimer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}}]}}]}}]} as unknown as DocumentNode<StopTimerMutation, StopTimerMutationVariables>;
export const CreateTimeLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTimeLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startedAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endedAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"note"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTimeLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"startedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startedAt"}}},{"kind":"Argument","name":{"kind":"Name","value":"endedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endedAt"}}},{"kind":"Argument","name":{"kind":"Name","value":"note"},"value":{"kind":"Variable","name":{"kind":"Name","value":"note"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}}]}}]}}]} as unknown as DocumentNode<CreateTimeLogMutation, CreateTimeLogMutationVariables>;
export const TaskWorkspaceCreateSubtaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TaskWorkspaceCreateSubtask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"weight"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSubtask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"weight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"weight"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subtasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}}]}}]}}]}}]} as unknown as DocumentNode<TaskWorkspaceCreateSubtaskMutation, TaskWorkspaceCreateSubtaskMutationVariables>;
export const TaskWorkspaceUpdateSubtaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TaskWorkspaceUpdateSubtask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isComplete"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSubtask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"isComplete"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isComplete"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subtasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}}]}}]}}]}}]} as unknown as DocumentNode<TaskWorkspaceUpdateSubtaskMutation, TaskWorkspaceUpdateSubtaskMutationVariables>;
export const NotificationTaskContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationTaskContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}}]}}]} as unknown as DocumentNode<NotificationTaskContextQuery, NotificationTaskContextQueryVariables>;
export const UpdateTaskWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTaskWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"weight"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskPriorityEnumType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskStatusEnumType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"progress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"weight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"weight"}}},{"kind":"Argument","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}},{"kind":"Argument","name":{"kind":"Name","value":"dueDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"progress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"progress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"isBlocked"}}]}}]}}]} as unknown as DocumentNode<UpdateTaskWorkspaceMutation, UpdateTaskWorkspaceMutationVariables>;
export const AddTaskAssigneeWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddTaskAssigneeWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assigneeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTaskAssignee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"assigneeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assigneeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddTaskAssigneeWorkspaceMutation, AddTaskAssigneeWorkspaceMutationVariables>;
export const RemoveTaskAssigneeWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveTaskAssigneeWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assigneeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTaskAssignee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"assigneeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assigneeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RemoveTaskAssigneeWorkspaceMutation, RemoveTaskAssigneeWorkspaceMutationVariables>;
export const DeleteTaskWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTaskWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteTaskWorkspaceMutation, DeleteTaskWorkspaceMutationVariables>;
export const ProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Projects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectFilterInputType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerName"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercent"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"taskCount"}},{"kind":"Field","name":{"kind":"Name","value":"myRoleName"}},{"kind":"Field","name":{"kind":"Name","value":"myRoleCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isFirstPage"}},{"kind":"Field","name":{"kind":"Name","value":"isLastPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"previousPage"}},{"kind":"Field","name":{"kind":"Name","value":"nextPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectsQuery, ProjectsQueryVariables>;
export const CreateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateProjectMutation, CreateProjectMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissionCodes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionEnumType"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissionCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissionCodes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const RoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Role"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<RoleQuery, RoleQueryVariables>;
export const UpdateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissionCodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionEnumType"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissionCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissionCodes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const RolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Roles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleFilterInputType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isFirstPage"}},{"kind":"Field","name":{"kind":"Name","value":"isLastPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"previousPage"}},{"kind":"Field","name":{"kind":"Name","value":"nextPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<RolesQuery, RolesQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterInputType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"roleCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isFirstPage"}},{"kind":"Field","name":{"kind":"Name","value":"isLastPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"previousPage"}},{"kind":"Field","name":{"kind":"Name","value":"nextPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;