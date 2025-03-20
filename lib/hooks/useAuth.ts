import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  AuthResponse,
} from "@/lib/api/auth";

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: ({ email, password, name }) =>
      registerUser(email, password, name),
    onSuccess: (data) => {
      if (!data.error) {
        router.push("/login?registered=true");
      }
    },
  });

  const loginMutation = useMutation<
    AuthResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) => loginUser(email, password),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.push("/me");
      }
    },
  });

  const logoutMutation = useMutation<{ error: Error | null }, Error, void>({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.setQueryData(["user"], null);
        router.push("/login");
      }
    },
  });

  return {
    user: user?.user,
    isLoadingUser,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,
  };
};
