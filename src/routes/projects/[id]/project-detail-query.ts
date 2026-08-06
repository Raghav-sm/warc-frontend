import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const PROJECT_DETAIL_QUERY = gql(`
  query ProjectDetail($id: ID!) {
    getProject(id: $id) {
      id
      name
      description
      status
      progressPercent
      memberCount
      myPermissions
      myRoleName
      myRoleCode
      createdAt
      updatedAt
    }
  }
`) as DocumentNode;

export const PROJECT_TASKS_QUERY = gql(`
  query ProjectTasks($page: Int, $limit: Int, $filters: TaskFilterInputType) {
    getTasks(page: $page, limit: $limit, filters: $filters) {
      nodes {
        id
        title
        description
        type
        weight
        progress
        status
        priority
        dueDate
        projectId
        isBlocked
        assignees {
          id
          userId
          user {
            id
            fullName
            email
          }
        }
      }
      pageInfo {
        totalCount
      }
    }
  }
`) as DocumentNode;

export const PROJECT_MEMBERS_QUERY = gql(`
  query ProjectMembers($projectId: ID!) {
    getProjectMembers(projectId: $projectId) {
      nodes {
        id
        userId
        firstName
        lastName
        email
        fullName
        roleId
        roleCode
        roleName
        joinedAt
      }
    }
  }
`) as DocumentNode;

export const TASK_DETAIL_QUERY = gql(`
  query TaskDetail($id: ID!) {
    getTask(id: $id) {
      id
      title
      description
      type
      weight
      progress
      status
      priority
      dueDate
      projectId
      subtasks {
        id
        title
        weight
        isComplete
      }
      assignees {
        id
        userId
        user {
          id
          fullName
          email
        }
      }
    }
  }
`) as DocumentNode;

export const CREATE_TASK_MUTATION = gql(`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $type: TaskTypeEnumType
    $weight: Int!
    $priority: TaskPriorityEnumType
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      type: $type
      weight: $weight
      priority: $priority
      dueDate: $dueDate
    ) {
      id
    }
  }
`) as DocumentNode;

export const UPDATE_TASK_MUTATION = gql(`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $weight: Int
    $priority: TaskPriorityEnumType
    $dueDate: DateTime
    $status: TaskStatusEnumType
    $progress: Int
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      weight: $weight
      priority: $priority
      dueDate: $dueDate
      status: $status
      progress: $progress
    ) {
      id
      title
      description
      weight
      priority
      dueDate
      status
      progress
      isBlocked
    }
  }
`) as DocumentNode;

export const ADD_TASK_ASSIGNEE_MUTATION = gql(`
  mutation AddTaskAssignee($taskId: ID!, $assigneeId: ID!) {
    addTaskAssignee(taskId: $taskId, assigneeId: $assigneeId) {
      id
      assignees {
        id
        userId
        user {
          id
          fullName
          email
        }
      }
    }
  }
`) as DocumentNode;

export const REMOVE_TASK_ASSIGNEE_MUTATION = gql(`
  mutation RemoveTaskAssignee($taskId: ID!, $assigneeId: ID!) {
    removeTaskAssignee(taskId: $taskId, assigneeId: $assigneeId) {
      id
      assignees {
        id
        userId
        user {
          id
          fullName
          email
        }
      }
    }
  }
`) as DocumentNode;

export const DELETE_TASK_MUTATION = gql(`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`) as DocumentNode;

export const DELETE_PROJECT_MUTATION = gql(`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`) as DocumentNode;

export const ADD_PROJECT_MEMBER_MUTATION = gql(`
  mutation AddProjectMember($projectId: ID!, $memberUserId: ID!, $roleId: ID!) {
    addProjectMember(projectId: $projectId, memberUserId: $memberUserId, roleId: $roleId) {
      id
    }
  }
`) as DocumentNode;

export const UPDATE_PROJECT_MUTATION = gql(`
  mutation UpdateProject($id: ID!, $name: String, $description: String, $status: ProjectStatusEnumType) {
    updateProject(id: $id, name: $name, description: $description, status: $status) {
      id
      name
      description
      status
    }
  }
`) as DocumentNode;

export const CREATE_SUBTASK_MUTATION = gql(`
  mutation CreateSubtask($taskId: ID!, $title: String!, $weight: Int!) {
    createSubtask(taskId: $taskId, title: $title, weight: $weight) {
      id
      subtasks {
        id
        title
        weight
        isComplete
      }
    }
  }
`) as DocumentNode;

export const UPDATE_SUBTASK_MUTATION = gql(`
  mutation UpdateSubtask($id: ID!, $isComplete: Boolean, $weight: Int) {
    updateSubtask(id: $id, isComplete: $isComplete, weight: $weight) {
      id
      subtasks {
        id
        title
        weight
        isComplete
      }
    }
  }
`) as DocumentNode;

export const PROJECT_ROLES_QUERY = gql(`
  query ProjectRoles($limit: Int) {
    getRoles(limit: $limit) {
      nodes {
        id
        code
        name
      }
    }
  }
`) as DocumentNode;

export const PROJECT_USERS_QUERY = gql(`
  query ProjectUsers($limit: Int, $filters: UserFilterInputType) {
    getUsers(limit: $limit, filters: $filters) {
      nodes {
        id
        fullName
        email
      }
    }
  }
`) as DocumentNode;
