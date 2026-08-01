import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const DASHBOARD_QUERY = gql(`
  query DashboardOverview {
    getDashboard {
      kpis {
        key
        title
        subtitle
        value
        tone
      }
      recentUsers {
        id
        email
        firstName
        lastName
        roleName
        isActive
        createdAt
      }
      projectCards {
        id
        name
        status
        progressPercent
        memberCount
      }
      myTasks {
        id
        title
        projectId
        projectName
        status
        progress
        priority
        dueDate
      }
    }
  }
`) as DocumentNode;
