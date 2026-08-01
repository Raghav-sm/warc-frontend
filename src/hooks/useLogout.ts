import { useMutation } from "@apollo/client";
import { gql } from "@/__generated__";
import { useAuth } from "@/components/AuthProvider";
import { tokenStorage } from "@/utils/apollo-client";

const LOGOUT_MUTATION = gql(`
  mutation Logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken)
  }
`);

export function useLogout() {
  const { clearSession } = useAuth();
  const [logout, { loading }] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => void clearSession(),
    onError: () => void clearSession(),
  });

  const handleLogout = () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) void logout({ variables: { refreshToken } });
    else void clearSession();
  };

  return { handleLogout, loading };
}
