import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup } from "@/components/ui/message";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/classnames";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import {
  CREATE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
  TASK_COMMENTS_QUERY,
  UPDATE_COMMENT_MUTATION,
} from "./task-detail-query";

type TaskCommentsProps = {
  taskId: string;
  canComment?: boolean;
  canEditComment?: (authorId: string) => boolean;
};

type CommentNode = {
  id: string;
  body: string;
  authorId: string;
  authorFirstName?: string | null;
  authorLastName?: string | null;
  createdAt: string;
  updatedAt: string;
};

function authorName(comment: CommentNode) {
  return [comment.authorFirstName, comment.authorLastName].filter(Boolean).join(" ") || "User";
}

export function TaskComments({ taskId, canComment = true, canEditComment }: TaskCommentsProps) {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  const { data, loading, error } = useQuery(TASK_COMMENTS_QUERY, {
    variables: { taskId, page: 1, limit: 100 },
    skip: !taskId,
  });

  const [createComment, { loading: creating }] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: ["TaskComments"],
    onCompleted: () => {
      setDraft("");
      toast.success("Comment posted");
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to post comment"),
  });

  const [updateComment, { loading: updating }] = useMutation(UPDATE_COMMENT_MUTATION, {
    refetchQueries: ["TaskComments"],
    onCompleted: () => {
      setEditingId(null);
      setEditBody("");
      toast.success("Comment updated");
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to update comment"),
  });

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    refetchQueries: ["TaskComments"],
    onCompleted: () => toast.success("Comment deleted"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to delete comment"),
  });

  const comments = (data?.getComments?.nodes ?? []) as CommentNode[];

  if (loading && !data) {
    return <p className="text-sm text-muted-foreground">Loading comments…</p>;
  }

  if (error) {
    return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xs">
        {comments.length === 0 ? (
          <EmptyState title="No comments yet" description="Start the conversation on this task." />
        ) : (
          <MessageGroup className="max-h-[28rem] overflow-y-auto pr-1">
            {comments.map((comment) => {
              const isOwn = comment.authorId === user?.id;
              const canEdit = isOwn && (canEditComment ? canEditComment(comment.authorId) : true);
              const isEditing = editingId === comment.id;

              return (
                <Message key={comment.id} align={isOwn ? "end" : "start"}>
                  {!isOwn ? (
                    <MessageAvatar>
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs bg-muted">
                          {authorName(comment).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                  ) : null}
                  <MessageContent>
                    <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
                      <span>{isOwn ? "You" : authorName(comment)}</span>
                      <span>·</span>
                      <span>{dayjs(comment.createdAt).format("h:mm A")}</span>
                      {canEdit && !isEditing ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs" className="ml-1">
                              <MoreHorizontal className="size-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingId(comment.id);
                                setEditBody(comment.body);
                              }}
                            >
                              <Pencil className="size-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                if (window.confirm("Delete this comment?")) {
                                  deleteComment({ variables: { id: comment.id } });
                                }
                              }}
                            >
                              <Trash2 className="size-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={3} />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            loading={updating}
                            disabled={!editBody.trim()}
                            onClick={() => updateComment({ variables: { id: comment.id, body: editBody.trim() } })}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null);
                              setEditBody("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Bubble variant={isOwn ? "default" : "tinted"} align={isOwn ? "end" : "start"}>
                        <BubbleContent
                          className={cn(
                            "rounded-2xl border border-neutral-200/80 shadow-xs",
                            isOwn ? "rounded-br-sm" : "rounded-bl-sm",
                          )}
                        >
                          {comment.body}
                        </BubbleContent>
                      </Bubble>
                    )}
                    {comment.updatedAt !== comment.createdAt && !isEditing ? <MessageFooter>edited</MessageFooter> : null}
                  </MessageContent>
                </Message>
              );
            })}
          </MessageGroup>
        )}
      </div>

      {canComment ? (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment… Use @name or @email to mention teammates."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              loading={creating}
              disabled={!draft.trim()}
              onClick={() => createComment({ variables: { taskId, body: draft.trim() } })}
            >
              Post comment
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
