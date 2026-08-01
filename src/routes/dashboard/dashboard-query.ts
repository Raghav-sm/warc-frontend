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
    }
  }
`);
