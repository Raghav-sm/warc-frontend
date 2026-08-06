import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const GLOBAL_SEARCH_QUERY = gql(`
  query GlobalSearch($query: String!, $limit: Int) {
    globalSearch(query: $query, limit: $limit) {
      projects {
        id
        name
        status
      }
      tasks {
        id
        title
        projectId
        projectName
        status
      }
      comments {
        id
        bodySnippet
        taskId
        taskTitle
        projectId
        projectName
      }
    }
  }
`) as DocumentNode;
