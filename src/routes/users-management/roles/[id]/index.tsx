import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { gql } from "@/__generated__";
import { PermissionEnumType } from "@/__generated__/graphql";
import { ErrorAlert } from "@/components/ErrorAlert";
import { FormPanelWithReadMode } from "@/components/Form";
import { DetailFormSkeleton } from "@/components/FormSkeletons";
import Layout from "@/components/Layout";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { PERMISSIONS, type Permission } from "@/utils/permissions";
import { MESSAGE_MAP, VALIDATION_RULES } from "@/utils/validation";

const UpdateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Name"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message)
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Description"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message)
    .optional()
    .nullable(),
  permissionCodes: z
    .array(z.nativeEnum(PermissionEnumType))
    .min(1, MESSAGE_MAP.ARRAY_MIN_LENGTH("Permissions", 1))
    .optional()
    .nullable(),
});

const ROLE_QUERY = gql(`
  query Role($id: ID!) {
    getRole(id: $id) {
      id
      code
      name
      description
      permissions
    }
  }
`);

const UPDATE_ROLE_MUTATION = gql(`
  mutation UpdateRole(
    $id: ID!
    $name: String
    $description: String
    $permissionCodes: [PermissionEnumType!]
  ) {
    updateRole(
      id: $id
      name: $name
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

export default function RoleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(ROLE_QUERY, {
    variables: { id: id as string },
    skip: !id,
  });

  const isInitialLoading = loading && !data;
  const hasError = error || (!loading && !data);

  const [updateRole, { loading: updating, error: updateError }] = useMutation(UPDATE_ROLE_MUTATION, {
    refetchQueries: ["Role", "Roles"],
    onCompleted: () => toast.success("Role updated successfully"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to update role"),
  });

  const renderContent = () => {
    if (isInitialLoading) return <DetailFormSkeleton fields={["Name", "Code", "Description", "Permissions"]} />;
    if (hasError) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;

    const role = data?.getRole;
    if (!role) return <ErrorAlert error="Role not found" />;

    return (
      <FormPanelWithReadMode
        title="Role details"
        schema={UpdateRoleSchema}
        onSubmit={async (formData) => {
          void updateRole({
            variables: {
              id: role.id,
              name: formData.name,
              description: formData.description,
              permissionCodes: formData.permissionCodes,
            },
          });
        }}
        loading={updating}
        error={updateError}
      >
        {({ FormInput }) => (
          <>
            <FormInput fieldName="name" label="Name" type="text" required defaultValue={role.name} colSpan="full" />
            <FormInput
              fieldName="description"
              label="Description"
              type="textarea"
              defaultValue={role.description}
              colSpan="full"
            />
            <FormInput
              fieldName="permissionCodes"
              label="Permissions"
              type="multi-select"
              defaultValue={role.permissions}
              placeholder="Search and select permissions…"
              options={PERMISSIONS.map((permission) => ({
                label: formatPermissionLabel(permission),
                value: permission,
              }))}
              colSpan="full"
            />
          </>
        )}
      </FormPanelWithReadMode>
    );
  };

  return (
    <Layout
      title={data?.getRole?.name ?? "Loading..."}
      subtitle="View and edit role information."
      breadcrumbs={[{ label: "Roles", href: "/user-management/roles" }, { label: data?.getRole?.name ?? "Loading..." }]}
      onBack={() => navigate("/user-management/roles")}
    >
      {renderContent()}
    </Layout>
  );
}
