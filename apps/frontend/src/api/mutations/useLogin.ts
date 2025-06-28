import { useMutation } from "@tanstack/react-query";
import { login, LoginInput, LoginResponse } from "../services/auth.service";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: login,
  });
}
