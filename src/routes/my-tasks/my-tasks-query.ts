import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const MY_TASKS_QUERY = gql(`
  query MyTasks($page: Int, $limit: Int, $filters: MyTaskFilterInputType) {
    getMyTasks(page: $page, limit: $limit, filters: $filters) {
      nodes {
        id
        title
        status
        priority
        progress
        projectId
        dueDate
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
