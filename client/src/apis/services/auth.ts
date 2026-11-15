import secureApi from "@apis/instances/secure-api";
import { AuthLoginPayload } from "src/types/api";

export function postAuthLogin(payload: AuthLoginPayload) {
  return secureApi.post("/auth/sign-in/email", payload);
}

export function postAuthLogout() {
  return secureApi.post("/auth/sign-out");
}
