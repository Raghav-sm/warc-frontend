import { useMutation } from "@apollo/client";
import { ExternalLink, Lock, MoreHorizontal, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { EntityCard } from "@/components/EntityCard";
import { FormDialog } from "@/components/FormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DELETE_RESOURCE_MUTATION, UPDATE_RESOURCE_MUTATION } from "@/routes/projects/[id]/resource-query";
import { fileTypeIcon } from "@/utils/file-type-icon";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

export type ResourceNode = {
  id: string;
  projectId: string;
  type: "LINK" | "FILE";
  title: string;
  url?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  size?: number | null;
  visibility: "PUBLIC" | "PRIVATE";
  createdById: string;
  viewerIds: string[];
  createdAt: string;
};

type MemberOption = { label: string; value: string };

type ResourceCardProps = {
  resource: ResourceNode;
  canManage: boolean;
  memberOptions: MemberOption[];
};

const EditVisibilitySchema = z
  .object({
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    viewerIds: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.visibility === "PRIVATE" && data.viewerIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Select at least one viewer for private resources",
        path: ["viewerIds"],
      });
    }
  });

function VisibilityBadge({ visibility }: { visibility: ResourceNode["visibility"] }) {
  if (visibility === "PRIVATE") {
    return (
      <Badge variant="outline" className="gap-1">
        <Lock className="size-3" />
        Private
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <Users className="size-3" />
      Public
    </Badge>
  );
}

export function ResourceCard({ resource, canManage, memberOptions }: ResourceCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const Icon = fileTypeIcon(resource.type === "LINK" ? "link" : resource.fileType);

  const [updateResource, { loading: updating, error: updateError }] = useMutation(UPDATE_RESOURCE_MUTATION, {
    refetchQueries: ["GetResources"],
    onCompleted: () => {
      toast.success("Resource updated");
      setEditOpen(false);
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to update resource"),
  });

  const [deleteResource] = useMutation(DELETE_RESOURCE_MUTATION, {
    refetchQueries: ["GetResources"],
    onCompleted: () => toast.success("Resource deleted"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to delete resource"),
  });

  const href = resource.type === "LINK" ? resource.url : resource.fileUrl;
  const linkLabel = resource.type === "LINK" ? "Open link" : (resource.fileName ?? "Download file");

  return (
    <>
      <EntityCard
        title={resource.title}
        subtitle={resource.type === "FILE" && resource.fileName ? resource.fileName : undefined}
        icon={Icon}
        footer={
          <div className="flex items-center justify-between gap-2">
            <VisibilityBadge visibility={resource.visibility} />
            <div className="flex items-center gap-1">
              {href ? (
                <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                  <a href={href} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>
                    <ExternalLink className="size-3.5" />
                    {linkLabel}
                  </a>
                </Button>
              ) : null}
              {canManage ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs" onClick={(event) => event.stopPropagation()}>
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditOpen(true);
                      }}
                    >
                      Edit visibility
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (window.confirm(`Delete "${resource.title}"?`)) {
                          void deleteResource({ variables: { id: resource.id } });
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
          </div>
        }
      />

      {canManage ? (
        <FormDialog
          key={`edit-${resource.id}-${editOpen}`}
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Edit visibility"
          description="Control who can see this resource within the project."
          schema={EditVisibilitySchema}
          loading={updating}
          error={updateError}
          submitLabel="Save changes"
          defaultValues={{
            visibility: resource.visibility,
            viewerIds: resource.viewerIds,
          }}
          onSubmit={async (formData) => {
            await updateResource({
              variables: {
                id: resource.id,
                visibility: formData.visibility,
                viewerIds: formData.visibility === "PRIVATE" ? formData.viewerIds : [],
              },
            });
          }}
        >
          {({ FormInput }) => (
            <>
              <FormInput
                fieldName="visibility"
                label="Visibility"
                type="radio-group"
                colSpan="full"
                options={[
                  { label: "Public — all project members", value: "PUBLIC" },
                  { label: "Private — selected members only", value: "PRIVATE" },
                ]}
              />
              <FormInput
                fieldName="viewerIds"
                label="Viewers"
                type="multi-select"
                colSpan="full"
                className="w-full min-w-0"
                options={memberOptions}
                conditionsToShow={{
                  matches: [{ field: "visibility", condition: "===", value: "PRIVATE" }],
                }}
              />
            </>
          )}
        </FormDialog>
      ) : null}
    </>
  );
}
