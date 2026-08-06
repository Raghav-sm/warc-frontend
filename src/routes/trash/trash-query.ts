import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const GET_TRASHED_PROJECTS_QUERY = gql(`
  query TrashedProjects($page: Int, $limit: Int) {
    getTrashedProjects(page: $page, limit: $limit) {
      nodes {
        id
        name
        description
        status
        deletedAt
        ownerId
        ownerName
      }
      pageInfo {
        isFirstPage
        isLastPage
        currentPage
        previousPage
        nextPage
        pageCount
        totalCount
      }
    }
  }
`) as DocumentNode;

export const GET_TRASHED_TASKS_QUERY = gql(`
  query TrashedTasks($page: Int, $limit: Int, $projectId: ID) {
    getTrashedTasks(page: $page, limit: $limit, projectId: $projectId) {
      nodes {
        id
        title
        projectId
        projectName
        status
        priority
        deletedAt
      }
      pageInfo {
        isFirstPage
        isLastPage
        currentPage
        previousPage
        nextPage
        pageCount
        totalCount
      }
    }
  }
`) as DocumentNode;

export const RESTORE_PROJECT_MUTATION = gql(`
  mutation RestoreProject($id: ID!) {
    restoreProject(id: $id) {
      id
      name
    }
  }
`) as DocumentNode;

export const RESTORE_TASK_MUTATION = gql(`
  mutation RestoreTask($id: ID!) {
    restoreTask(id: $id) {
      id
      title
      projectId
    }
  }
`) as DocumentNode;

export const PERMANENT_DELETE_PROJECT_MUTATION = gql(`
  mutation PermanentDeleteProject($id: ID!) {
    permanentDeleteProject(id: $id)
  }
`) as DocumentNode;

export const PERMANENT_DELETE_TASK_MUTATION = gql(`
  mutation PermanentDeleteTask($id: ID!) {
    permanentDeleteTask(id: $id)
  }
`) as DocumentNode;
