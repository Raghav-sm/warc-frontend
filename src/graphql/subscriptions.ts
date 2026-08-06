import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const TASK_UPDATED_SUBSCRIPTION = gql(`
  subscription TaskUpdated($projectId: ID!) {
    taskUpdated(projectId: $projectId) {
      id
      projectId
      status
      progress
      title
    }
  }
`) as DocumentNode;

export const COMMENT_ADDED_SUBSCRIPTION = gql(`
  subscription CommentAdded($taskId: ID!) {
    commentAdded(taskId: $taskId) {
      id
      taskId
      body
      authorId
      authorFirstName
      authorLastName
      createdAt
    }
  }
`) as DocumentNode;

export const NOTIFICATION_CREATED_SUBSCRIPTION = gql(`
  subscription NotificationCreated {
    notificationCreated {
      id
      type
      entityType
      entityId
      message
      isRead
      createdAt
    }
  }
`) as DocumentNode;
