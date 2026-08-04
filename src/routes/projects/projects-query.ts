import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const PROJECTS_QUERY = gql(`
  query Projects($page: Int, $limit: Int, $filters: ProjectFilterInputType) {
    getProjects(page: $page, limit: $limit, filters: $filters) {
      nodes {
        id
        name
        description
        status
        ownerName
        progressPercent
        memberCount
        taskCount
        myRoleName
        myRoleCode
        createdAt
        updatedAt
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

export const CREATE_PROJECT_MUTATION = gql(`
  mutation CreateProject($name: String!, $description: String) {
    createProject(name: $name, description: $description) {
      id
      name
    }
  }
`) as DocumentNode;
