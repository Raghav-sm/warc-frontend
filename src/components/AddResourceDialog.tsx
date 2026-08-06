import { useMutation } from "@apollo/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { FormDialog } from "@/components/FormDialog";
import { Button } from "@/components/ui/button";
import { CREATE_RESOURCE_MUTATION } from "@/routes/projects/[id]/resource-query";
import { GET_UPLOAD_SIGNATURE_MUTATION } from "@/routes/projects/[id]/tasks/[taskId]/task-detail-query";
import { uploadToCloudinary } from "@/utils/cloudinary-upload";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { MESSAGE_MAP } from "@/utils/validation";

type MemberOption = { label: string; value: string };

type AddResourceDialogProps = {
  projectId: string;
  memberOptions: MemberOption[];
};

const CreateResourceSchema = z
  .object({
    type: z.enum(["LINK", "FILE"]),
    title: z
      .string(MESSAGE_MAP.REQUIRED("Title"))
      .trim()
      .min(1, MESSAGE_MAP.MIN("title", 1))
      .max(150, MESSAGE_MAP.MAX("title", 150)),
    url: z.string().trim().optional(),
    file: z
      .custom<File>((value) => value instanceof File || value === null || value === undefined)
      .optional()
      .nullable(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    viewerIds: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.type === "LINK") {
      const result = z.url().safeParse(data.url);
      if (!result.success) {
        ctx.addIssue({ code: "custom", message: "A valid URL is required for link resources", path: ["url"] });
      }
    }

    if (data.type === "FILE" && !(data.file instanceof File)) {
      ctx.addIssue({ code: "custom", message: "A file is required", path: ["file"] });
    }

    if (data.visibility === "PRIVATE" && data.viewerIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Select at least one viewer for private resources",
        path: ["viewerIds"],
      });
    }
  });

export function AddResourceDialog({ projectId, memberOptions }: AddResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [getSignature] = useMutation(GET_UPLOAD_SIGNATURE_MUTATION);
  const [createResource, { error: createError }] = useMutation(CREATE_RESOURCE_MUTATION, {
    refetchQueries: ["GetResources"],
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="bg-[#111111] text-white hover:bg-[#111111]/90 border-transparent">
          <Plus className="size-4" />
          Add resource
        </Button>
      }
      title="Add resource"
      description="Share a link or file with your project team."
      schema={CreateResourceSchema}
      loading={submitting}
      error={createError}
      submitLabel="Add resource"
      defaultValues={{
        type: "LINK",
        visibility: "PUBLIC",
        viewerIds: [],
      }}
      onSubmit={async (formData) => {
        setSubmitting(true);
        try {
          let fileUrl: string | undefined;
          let fileName: string | undefined;
          let fileType: string | undefined;
          let size: number | undefined;

          if (formData.type === "FILE" && formData.file instanceof File) {
            const sigResult = await getSignature({ variables: { projectId } });
            const signature = sigResult.data?.getUploadSignature;
            if (!signature) {
              throw new Error("Could not get upload signature");
            }

            const uploaded = await uploadToCloudinary(formData.file, signature);
            fileUrl = uploaded.secureUrl;
            fileName = uploaded.fileName;
            fileType = uploaded.fileType;
            size = uploaded.size;
          }

          await createResource({
            variables: {
              projectId,
              type: formData.type,
              title: formData.title,
              url: formData.type === "LINK" ? formData.url : null,
              fileUrl: formData.type === "FILE" ? fileUrl : null,
              fileName: formData.type === "FILE" ? fileName : null,
              fileType: formData.type === "FILE" ? fileType : null,
              size: formData.type === "FILE" ? size : null,
              visibility: formData.visibility,
              viewerIds: formData.visibility === "PRIVATE" ? formData.viewerIds : null,
            },
          });

          toast.success("Resource added");
          setOpen(false);
        } catch (err) {
          toast.error(getGraphQLErrorMessage(err as Error) || "Failed to add resource");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ FormInput }) => (
        <>
          <FormInput
            fieldName="type"
            label="Type"
            type="radio-group"
            colSpan="full"
            options={[
              { label: "Link", value: "LINK" },
              { label: "File", value: "FILE" },
            ]}
          />
          <FormInput fieldName="title" label="Title" type="text" required colSpan="full" />
          <FormInput
            fieldName="url"
            label="URL"
            type="text"
            required
            colSpan="full"
            placeholder="https://"
            conditionsToShow={{
              matches: [{ field: "type", condition: "===", value: "LINK" }],
            }}
          />
          <FormInput
            fieldName="file"
            label="File"
            type="upload"
            required
            colSpan="full"
            conditionsToShow={{
              matches: [{ field: "type", condition: "===", value: "FILE" }],
            }}
          />
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
  );
}
