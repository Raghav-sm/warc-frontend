import { useMutation } from "@apollo/client";
import { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { gql } from "@/__generated__";
import AuthHeader from "@/components/AuthHeader";
import { useAuth } from "@/components/AuthProvider";
import { DEFAULT_FORM_REF_VALUE, FormPanel, type FormPanelRefType } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { resolveAuthLanding } from "@/utils/auth-landing";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { MESSAGE_MAP, VALIDATION_RULES } from "@/utils/validation";

const SignUpSchema = z.object({
  firstName: z
    .string(MESSAGE_MAP.REQUIRED("First Name"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("First Name"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message),
  lastName: z
    .string(MESSAGE_MAP.REQUIRED("Last Name"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Last Name"))
    .regex(VALIDATION_RULES.STRING.REGEX.value, VALIDATION_RULES.STRING.REGEX.message),
  email: z.email(MESSAGE_MAP.INVALID("Email", "Email Address")).trim(),
  password: z
    .string(MESSAGE_MAP.REQUIRED("Password"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Password"))
    .regex(VALIDATION_RULES.PASSWORD.REGEX.value, VALIDATION_RULES.PASSWORD.REGEX.message),
  rememberMe: z.boolean().optional().nullable(),
});

const SIGNUP_MUTATION = gql(`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $rememberMe: Boolean
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      rememberMe: $rememberMe
    ) {
      accessToken
      refreshToken
    }
  }
`);

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef<FormPanelRefType>(DEFAULT_FORM_REF_VALUE);
  const { applyTokens } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo");

  const [signUp, { loading, error }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      if (!data.signUp) return;
      void applyTokens(data.signUp.accessToken, data.signUp.refreshToken).then((user) => {
        navigate(resolveAuthLanding(user, redirectTo));
      });
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Could not create your account"),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-card text-card-foreground border border-border">
        <AuthHeader subtitle="Sign up to create your account" />
        <FormPanel
          schema={SignUpSchema}
          onSubmit={async (formData) => {
            await signUp({
              variables: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe,
              },
            });
          }}
          loading={loading}
          error={error}
          buttonRef={buttonRef}
          className="mb-4 gap-5"
        >
          {({ FormInput }) => (
            <>
              <FormInput
                className="sm:col-span-full"
                fieldName="firstName"
                label="First Name"
                type="text"
                required
                placeholder="Enter your first name"
              />
              <FormInput
                className="sm:col-span-full"
                fieldName="lastName"
                label="Last Name"
                type="text"
                required
                placeholder="Enter your last name"
              />
              <FormInput
                className="sm:col-span-full"
                fieldName="email"
                label="Email"
                type="email"
                required
                placeholder="Enter your email"
              />
              <FormInput
                className="sm:col-span-full"
                fieldName="password"
                label="Password"
                type="password"
                required
                placeholder="Create a password"
              />
              <FormInput className="sm:col-span-full" fieldName="rememberMe" label="Remember Me" type="checkbox" />
            </>
          )}
        </FormPanel>
        <Button loading={loading} onClick={() => buttonRef.current.submit()} className="w-full">
          Sign Up
        </Button>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
