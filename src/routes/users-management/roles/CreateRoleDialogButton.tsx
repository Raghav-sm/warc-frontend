import { useMutation } from "@apollo/client";
import { Users } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { gql } from "@/__generated__";
import { PermissionEnumType } from "@/__generated__/graphql";
import { DEFAULT_FORM_REF_VALUE, FormPanel, type FormPanelRefType } from "@/components/Form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { PERMISSIONS, type Permission } from "@/utils/permissions";
import { MESSAGE_MAP, VALIDATION_RULES } from "@/utils/validation";

const CreateRoleSchema = z.object({
  name: z
    .string(MESSAGE_MAP.REQUIRED("Name"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Name"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message),
  code: z
    .string(MESSAGE_MAP.REQUIRED("Code"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Code"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message),
  description: z
    .string()
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Description"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message)
    .optional()
    .nullable(),
  permissionCodes: z
    .array(z.nativeEnum(PermissionEnumType), MESSAGE_MAP.ARRAY_MIN_LENGTH("Permissions", 1))
    .min(1, MESSAGE_MAP.ARRAY_MIN_LENGTH("Permissions", 1)),
});

const CREATE_ROLE_MUTATION = gql(`
  mutation CreateRole(
    $name: String!
    $code: String!
    $description: String
    $permissionCodes: [PermissionEnumType!]!
  ) {
    createRole(
      name: $name
      code: $code
      description: $description
      permissionCodes: $permissionCodes
    ) {
      id
    }
  }
`);

function formatPermissionLabel(permission: Permission) {
  const parts = permission.split("_");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  }
  const last = parts.pop();
  const labelString = parts.length
    ? `${parts.join(" ").toLowerCase()}: ${last?.toLowerCase()}`
    : (last?.toLowerCase() ?? "");
  return labelString.replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function CreateRoleDialogButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<FormPanelRefType>(DEFAULT_FORM_REF_VALUE);

  const [createRole, { loading, error }] = useMutation(CREATE_ROLE_MUTATION, {
    refetchQueries: ["Roles"],
    onCompleted: () => {
      toast.success("Role created successfully");
      setOpen(false);
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to create role"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Users className="h-4 w-4" />
          Create role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>Add a custom role and choose which permissions it grants.</DialogDescription>
        </DialogHeader>
        <FormPanel
          schema={CreateRoleSchema}
          onSubmit={async (formData) => {
            await createRole({
              variables: {
                name: formData.name,
                code: formData.code,
                description: formData.description,
                permissionCodes: formData.permissionCodes,
              },
            });
          }}
          onCancel={() => setOpen(false)}
          loading={loading}
          error={error}
          buttonRef={buttonRef}
        >
          {({ FormInput }) => (
            <>
              <FormInput type="text" fieldName="name" label="Name" defaultValue={undefined} required colSpan="full" />
              <FormInput
                fieldName="code"
                label="Code"
                type="text"
                required
                placeholder="e.g. CUSTOM_MANAGER"
                colSpan="full"
              />
              <FormInput fieldName="description" label="Description" type="textarea" colSpan="full" />
              <FormInput
                fieldName="permissionCodes"
                label="Permissions"
                type="multi-select"
                required
                placeholder="Search and select permissions…"
                options={PERMISSIONS.map((permission) => ({
                  label: formatPermissionLabel(permission),
                  value: permission,
                }))}
                colSpan="full"
              />
            </>
          )}
        </FormPanel>
        <DialogFooter>
          <Button loading={loading} onClick={() => buttonRef.current.submit()}>
            Create Role
          </Button>
          <Button variant="ghost" onClick={() => buttonRef.current.cancel()}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
