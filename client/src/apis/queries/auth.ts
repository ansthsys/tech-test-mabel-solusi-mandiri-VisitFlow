import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAuthLogin, postAuthLogout } from "@apis/services/auth";
import { AuthLoginPayload } from "src/types/api";
import { authKeys } from "./keys";

export function useAuthLogin() {
  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: (payload: AuthLoginPayload) => postAuthLogin(payload),
  });
}

export function useAuthLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authKeys.logout(),
    mutationFn: () => postAuthLogout(),
    onSettled: () => queryClient.clear(),
  });
}
