import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import z from "zod";
import { gql } from "@/__generated__";
import { ErrorAlert } from "@/components/ErrorAlert";
import { FormPanelWithReadMode } from "@/components/Form";
import { DetailFormSkeleton } from "@/components/FormSkeletons";
import Layout from "@/components/Layout";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { MESSAGE_MAP, VALIDATION_RULES } from "@/utils/validation";

const UpdateUserSchema = z.object({
  firstName: z
    .string(MESSAGE_MAP.REQUIRED("First Name"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("First Name"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message)
    .optional()
    .nullable(),
  lastName: z
    .string(MESSAGE_MAP.REQUIRED("Last Name"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Last Name"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message)
    .optional()
    .nullable(),
  email: z.email(MESSAGE_MAP.INVALID("Email", "Email Address")).trim().optional().nullable(),
});

const GET_SELF_QUERY = gql(`
  query Me {
    me {
      id
      email
      firstName
      lastName
      roleName
      sessions {
        nodes {
          id
          expiresAt
          userAgent
          ipAddress
          revoked
          revokedAt
          createdAt
        }
        pageInfo {
          totalCount
        }
      }
    }
  }
`);

const UPDATE_USER_MUTATION = gql(`
  mutation UpdateUser($firstName: String, $lastName: String, $email: String) {
    updateUser(firstName: $firstName, lastName: $lastName, email: $email) {
      id
    }
  }
`);

export default function Settings() {
  const { data, loading, error } = useQuery(GET_SELF_QUERY);

  const isInitialLoading = loading && !data;
  const hasError = error || (!loading && !data);

  const [updateUser, { loading: updating, error: updateError }] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: ["AuthBootMe", "Me"],
    onCompleted: () => toast.success("User updated successfully"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to update user"),
  });

  const renderContent = () => {
    if (isInitialLoading) return <DetailFormSkeleton fields={["First Name", "Last Name", "Email"]} />;
    if (hasError) return <ErrorAlert error={getGraphQLErrorMessage(error)} />;

    const user = data?.me;
    if (!user) return <ErrorAlert error="User not found" />;

    return (
      <FormPanelWithReadMode
        title="Account Details"
        subTitle="Manage your account details"
        schema={UpdateUserSchema}
        onSubmit={async (formData) => {
          await updateUser({
            variables: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
            },
          });
        }}
        loading={updating}
        error={updateError}
      >
        {({ FormInput }) => (
          <>
            <FormInput
              className="sm:col-span-full"
              fieldName="firstName"
              label="First Name"
              type="text"
              required
              defaultValue={user.firstName}
              placeholder="Enter your first name"
            />
            <FormInput
              className="sm:col-span-full"
              fieldName="lastName"
              label="Last Name"
              type="text"
              required
              defaultValue={user.lastName}
              placeholder="Enter your last name"
            />
            <FormInput
              className="sm:col-span-full"
              fieldName="email"
              label="Email"
              type="email"
              required
              defaultValue={user.email}
              placeholder="Enter your email"
            />
          </>
        )}
      </FormPanelWithReadMode>
    );
  };

  return (
    <Layout title="Settings" subtitle="Manage your settings" breadcrumbs={[{ label: "Settings", href: "/settings" }]}>
      {renderContent()}
    </Layout>
  );
}
