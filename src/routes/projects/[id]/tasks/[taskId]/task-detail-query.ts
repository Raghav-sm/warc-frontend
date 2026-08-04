import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const TASK_WORKSPACE_QUERY = gql(`
  query TaskWorkspace($id: ID!) {
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
      createdById
      isBlocked
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

export const TASK_COMMENTS_QUERY = gql(`
  query TaskComments($taskId: ID!, $page: Int, $limit: Int) {
    getComments(taskId: $taskId, page: $page, limit: $limit) {
      nodes {
        id
        taskId
        body
        authorId
        authorFirstName
        authorLastName
        createdAt
        updatedAt
      }
      pageInfo {
        totalCount
      }
    }
  }
`) as DocumentNode;

export const CREATE_COMMENT_MUTATION = gql(`
  mutation CreateComment($taskId: ID!, $body: String!) {
    createComment(taskId: $taskId, body: $body) {
      id
      body
      authorId
      authorFirstName
      authorLastName
      createdAt
      updatedAt
    }
  }
`) as DocumentNode;

export const UPDATE_COMMENT_MUTATION = gql(`
  mutation UpdateComment($id: ID!, $body: String!) {
    updateComment(id: $id, body: $body) {
      id
      body
      updatedAt
    }
  }
`) as DocumentNode;

export const DELETE_COMMENT_MUTATION = gql(`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`) as DocumentNode;

export const TASK_ATTACHMENTS_QUERY = gql(`
  query TaskAttachments($taskId: ID) {
    getAttachments(taskId: $taskId) {
      nodes {
        id
        taskId
        commentId
        fileUrl
        fileName
        fileType
        size
        uploadedById
        uploadedByFirstName
        uploadedByLastName
        createdAt
      }
    }
  }
`) as DocumentNode;

export const GET_UPLOAD_SIGNATURE_MUTATION = gql(`
  mutation GetUploadSignature($projectId: ID!) {
    getUploadSignature(projectId: $projectId) {
      signature
      timestamp
      apiKey
      cloudName
      folder
    }
  }
`) as DocumentNode;

export const CREATE_ATTACHMENT_MUTATION = gql(`
  mutation CreateAttachment(
    $taskId: ID
    $fileUrl: String!
    $fileName: String!
    $fileType: String!
    $size: Int!
  ) {
    createAttachment(taskId: $taskId, fileUrl: $fileUrl, fileName: $fileName, fileType: $fileType, size: $size) {
      id
      fileUrl
      fileName
      fileType
      size
      createdAt
    }
  }
`) as DocumentNode;

export const DELETE_ATTACHMENT_MUTATION = gql(`
  mutation DeleteAttachment($id: ID!) {
    deleteAttachment(id: $id)
  }
`) as DocumentNode;

export const TASK_DEPENDENCIES_QUERY = gql(`
  query TaskDependencies($taskId: ID!) {
    getTaskDependencies(taskId: $taskId) {
      isBlocked
      blockedBy {
        id
        taskId
        dependsOnTaskId
        dependsOnTaskTitle
        dependsOnTaskStatus
      }
      blocks {
        id
        taskId
        dependsOnTaskId
        taskTitle
        dependsOnTaskStatus
      }
    }
  }
`) as DocumentNode;

export const ADD_TASK_DEPENDENCY_MUTATION = gql(`
  mutation AddTaskDependency($taskId: ID!, $dependsOnTaskId: ID!) {
    addTaskDependency(taskId: $taskId, dependsOnTaskId: $dependsOnTaskId) {
      id
      taskId
      dependsOnTaskId
      dependsOnTaskTitle
      dependsOnTaskStatus
    }
  }
`) as DocumentNode;

export const REMOVE_TASK_DEPENDENCY_MUTATION = gql(`
  mutation RemoveTaskDependency($id: ID!) {
    removeTaskDependency(id: $id)
  }
`) as DocumentNode;

export const TASK_TIME_LOGS_QUERY = gql(`
  query TaskTimeLogs($taskId: ID!, $page: Int, $limit: Int) {
    getTimeLogs(taskId: $taskId, page: $page, limit: $limit) {
      nodes {
        id
        taskId
        userId
        startedAt
        endedAt
        durationMinutes
        note
        createdAt
        userFirstName
        userLastName
      }
      totalMinutes
    }
  }
`) as DocumentNode;

export const ACTIVE_TIMER_QUERY = gql(`
  query ActiveTimer {
    getActiveTimer {
      id
      taskId
      taskTitle
      startedAt
    }
  }
`) as DocumentNode;

export const START_TIMER_MUTATION = gql(`
  mutation StartTimer($taskId: ID!) {
    startTimer(taskId: $taskId) {
      id
      taskId
      taskTitle
      startedAt
    }
  }
`) as DocumentNode;

export const STOP_TIMER_MUTATION = gql(`
  mutation StopTimer {
    stopTimer {
      id
      taskId
      durationMinutes
      startedAt
      endedAt
    }
  }
`) as DocumentNode;

export const CREATE_TIME_LOG_MUTATION = gql(`
  mutation CreateTimeLog($taskId: ID!, $startedAt: DateTime!, $endedAt: DateTime!, $note: String) {
    createTimeLog(taskId: $taskId, startedAt: $startedAt, endedAt: $endedAt, note: $note) {
      id
      durationMinutes
    }
  }
`) as DocumentNode;

export const CREATE_SUBTASK_MUTATION = gql(`
  mutation TaskWorkspaceCreateSubtask($taskId: ID!, $title: String!, $weight: Int!) {
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
  mutation TaskWorkspaceUpdateSubtask($id: ID!, $isComplete: Boolean) {
    updateSubtask(id: $id, isComplete: $isComplete) {
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

export const NOTIFICATION_TASK_CONTEXT_QUERY = gql(`
  query NotificationTaskContext($id: ID!) {
    getTask(id: $id) {
      id
      projectId
    }
  }
`) as DocumentNode;

export const UPDATE_TASK_WORKSPACE_MUTATION = gql(`
  mutation UpdateTaskWorkspace(
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

export const ADD_TASK_ASSIGNEE_WORKSPACE_MUTATION = gql(`
  mutation AddTaskAssigneeWorkspace($taskId: ID!, $assigneeId: ID!) {
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

export const REMOVE_TASK_ASSIGNEE_WORKSPACE_MUTATION = gql(`
  mutation RemoveTaskAssigneeWorkspace($taskId: ID!, $assigneeId: ID!) {
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

export const DELETE_TASK_WORKSPACE_MUTATION = gql(`
  mutation DeleteTaskWorkspace($id: ID!) {
    deleteTask(id: $id)
  }
`) as DocumentNode;
