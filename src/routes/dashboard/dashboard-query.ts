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
      projectKpis {
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
      taskStatusBreakdown {
        status
        count
      }
      tasksDueByDay {
        date
        label
        count
        tasks {
          id
          title
          projectId
          projectName
        }
      }
      activeTimer {
        id
        taskId
        taskTitle
        projectId
        projectName
        startedAt
      }
      attentionItems {
        id
        kind
        title
        subtitle
        taskId
        projectId
        notificationId
      }
      recentActivity {
        id
        type
        message
        entityType
        entityId
        isRead
        createdAt
        projectId
        projectName
      }
      projectHealth {
        projectId
        projectName
        openTaskCount
        overdueCount
        blockedCount
        healthStatus
      }
      teamWorkload {
        userId
        userName
        openTaskCount
      }
      projectRiskTasks {
        id
        title
        projectId
        projectName
        status
        priority
        dueDate
        isOverdue
        isBlocked
        assigneeNames
        reason
      }
    }
  }
`) as DocumentNode;

export const DASHBOARD_STOP_TIMER = gql(`
  mutation DashboardStopTimer {
    stopTimer {
      id
    }
  }
`) as DocumentNode;
