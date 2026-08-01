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

const LoginSchema = z.object({
  emailOrEmployeeNumber: z.email(MESSAGE_MAP.INVALID("Email", "Email Address")).trim(),
  password: z
    .string(MESSAGE_MAP.REQUIRED("Password"))
    .trim()
    .nonempty(MESSAGE_MAP.EMPTY("Password"))
    .regex(VALIDATION_RULES.PASSWORD.REGEX.value, VALIDATION_RULES.PASSWORD.REGEX.message),
  rememberMe: z.boolean().optional().nullable(),
});

const LOGIN_MUTATION = gql(`
  mutation Login(
    $emailOrEmployeeNumber: String!
    $password: String!
    $rememberMe: Boolean
  ) {
    login(
      emailOrEmployeeNumber: $emailOrEmployeeNumber
      password: $password
      rememberMe: $rememberMe
    ) {
      accessToken
      refreshToken
    }
  }
`);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef<FormPanelRefType>(DEFAULT_FORM_REF_VALUE);
  const { applyTokens } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo");

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (!data.login) return;
      void applyTokens(data.login.accessToken, data.login.refreshToken).then((user) => {
        navigate(resolveAuthLanding(user, redirectTo));
      });
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err)),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-card text-card-foreground border border-border">
        <AuthHeader subtitle="Sign in to your account to continue" />
        <FormPanel
          schema={LoginSchema}
          onSubmit={async (formData) => {
            await login({
              variables: {
                emailOrEmployeeNumber: formData.emailOrEmployeeNumber,
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
                fieldName="emailOrEmployeeNumber"
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
                placeholder="Enter your password"
              />
              <FormInput className="sm:col-span-full" fieldName="rememberMe" label="Remember Me" type="checkbox" />
            </>
          )}
        </FormPanel>
        <Button loading={loading} onClick={() => buttonRef.current.submit()} className="w-full">
          Sign In
        </Button>
        <div className="mt-4 flex flex-col space-y-1 text-center">
          <Link to="/request-reset" className="text-sm text-primary hover:underline transition-colors">
            Forgot password?
          </Link>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
