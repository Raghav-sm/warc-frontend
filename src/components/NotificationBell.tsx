import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import type { DocumentNode } from "graphql";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { gql } from "@/__generated__";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NOTIFICATION_TASK_CONTEXT_QUERY } from "@/routes/projects/[id]/tasks/[taskId]/task-detail-query";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

const NOTIFICATIONS_QUERY = gql(`
  query Notifications($page: Int, $limit: Int, $unreadOnly: Boolean) {
    getNotifications(page: $page, limit: $limit, unreadOnly: $unreadOnly) {
      nodes {
        id
        type
        entityType
        entityId
        message
        isRead
        createdAt
      }
      unreadCount
    }
  }
`) as DocumentNode;

const MARK_NOTIFICATION_READ = gql(`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      isRead
    }
  }
`) as DocumentNode;

const MARK_ALL_NOTIFICATIONS_READ = gql(`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`) as DocumentNode;

type NotificationNode = {
  id: string;
  type: string;
  entityType: string;
  entityId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const navigate = useNavigate();
  const client = useApolloClient();

  const { data, refetch } = useQuery(NOTIFICATIONS_QUERY, {
    variables: { page: 1, limit: 20 },
    pollInterval: 30000,
    fetchPolicy: "cache-and-network",
  });

  const [markRead] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries: ["Notifications"],
  });

  const [markAllRead, { loading: markingAll }] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    refetchQueries: ["Notifications"],
    onCompleted: () => toast.success("All notifications marked read"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to mark notifications read"),
  });

  const notifications = (data?.getNotifications?.nodes ?? []) as NotificationNode[];
  const unreadCount = data?.getNotifications?.unreadCount ?? 0;
  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  const handleNotificationClick = async (notification: NotificationNode) => {
    if (!notification.isRead) {
      try {
        await markRead({ variables: { id: notification.id } });
      } catch (err) {
        toast.error(getGraphQLErrorMessage(err as Error) || "Failed to mark notification read");
        return;
      }
    }

    if (notification.entityType !== "TASK") return;

    try {
      const result = await client.query({
        query: NOTIFICATION_TASK_CONTEXT_QUERY,
        variables: { id: notification.entityId },
        fetchPolicy: "network-only",
      });
      const projectId = result.data?.getTask?.projectId;
      if (!projectId) {
        toast.error("Could not open task");
        return;
      }
      navigate(`/projects/${projectId}/tasks/${notification.entityId}`);
    } catch (err) {
      toast.error(getGraphQLErrorMessage(err as Error) || "Could not open task");
    }
  };

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) refetch();
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {badgeLabel}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-sm font-medium">Notifications</span>
          {unreadCount > 0 ? (
            <Button variant="ghost" size="sm" loading={markingAll} onClick={() => markAllRead()}>
              Mark all read
            </Button>
          ) : null}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                className={`w-full text-left px-3 py-2.5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                  !notification.isRead ? "bg-primary/5" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2">
                  {!notification.isRead ? (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  ) : (
                    <span className="mt-1.5 size-2 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dayjs(notification.createdAt).format("MMM D, h:mm A")}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
