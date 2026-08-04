import { useMutation, useQuery } from "@apollo/client";
import { FileIcon, MoreHorizontal, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { uploadToCloudinary } from "@/utils/cloudinary-upload";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import {
  CREATE_ATTACHMENT_MUTATION,
  DELETE_ATTACHMENT_MUTATION,
  GET_UPLOAD_SIGNATURE_MUTATION,
  TASK_ATTACHMENTS_QUERY,
} from "./task-detail-query";

type TaskFilesProps = {
  taskId: string;
  projectId: string;
  canUpload?: boolean;
  canDeleteFile?: (uploadedById: string) => boolean;
};

type AttachmentNode = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  size: number;
  uploadedById: string;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TaskFiles({ taskId, projectId, canUpload = true, canDeleteFile }: TaskFilesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data, loading, error } = useQuery(TASK_ATTACHMENTS_QUERY, {
    variables: { taskId },
    skip: !taskId,
  });

  const [getSignature] = useMutation(GET_UPLOAD_SIGNATURE_MUTATION);
  const [createAttachment] = useMutation(CREATE_ATTACHMENT_MUTATION, {
    refetchQueries: ["TaskAttachments"],
    onCompleted: () => toast.success("File uploaded"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to save attachment"),
  });

  const [deleteAttachment] = useMutation(DELETE_ATTACHMENT_MUTATION, {
    refetchQueries: ["TaskAttachments"],
    onCompleted: () => toast.success("Attachment removed"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to delete attachment"),
  });

  const attachments = (data?.getAttachments?.nodes ?? []) as AttachmentNode[];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    setUploading(true);
    try {
      const sigResult = await getSignature({ variables: { projectId } });
      const signature = sigResult.data?.getUploadSignature;
      if (!signature) {
        throw new Error("Could not get upload signature");
      }

      const uploaded = await uploadToCloudinary(file, signature);
      await createAttachment({
        variables: {
          taskId,
          fileUrl: uploaded.secureUrl,
          fileName: uploaded.fileName,
          fileType: uploaded.fileType,
          size: uploaded.size,
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading && !data) {
    return <p className="text-sm text-muted-foreground">Loading files…</p>;
  }

  if (error) {
    return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{attachments.length} file(s)</p>
        {canUpload ? (
          <div>
            <input ref={inputRef} type="file" className="hidden" onChange={handleFileSelect} />
            <Button loading={uploading} onClick={() => inputRef.current?.click()}>
              <Upload className="size-4" />
              Upload file
            </Button>
          </div>
        ) : null}
      </div>

      {attachments.length === 0 ? (
        <EmptyState title="No files yet" description="Upload documents, images, or other files for this task." />
      ) : (
        <AttachmentGroup className="flex-col gap-2 overflow-visible">
          {attachments.map((file) => (
            <Attachment key={file.id} className="w-full max-w-full" orientation="horizontal">
              <AttachmentMedia>
                <FileIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{file.fileName}</AttachmentTitle>
                <AttachmentDescription>
                  {file.fileType.toUpperCase()} · {formatFileSize(file.size)}
                </AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <Button variant="ghost" size="icon-xs" asChild>
                  <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </Button>
                {canDeleteFile?.(file.uploadedById) ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <AttachmentAction>
                        <MoreHorizontal className="size-3.5" />
                      </AttachmentAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          if (window.confirm("Remove this attachment?")) {
                            deleteAttachment({ variables: { id: file.id } });
                          }
                        }}
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </AttachmentActions>
            </Attachment>
          ))}
        </AttachmentGroup>
      )}
    </div>
  );
}
