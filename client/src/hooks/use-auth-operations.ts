import Cookie from "js-cookie";
import { REFRESH_TOKEN, TOKEN } from "@configs/vars";
import { useNavigate } from "react-router-dom";
import { useAuthLogout } from "@apis/queries/auth";

/**
 * useAuthOperations hook that provides authentication & authorization methods
 */
const useAuthOperations = () => {
  const navigate = useNavigate();
  const { mutateAsync: submitLogout } = useAuthLogout();

  function login(value: { token?: string; refreshToken?: string }) {
    Cookie.set(TOKEN, value.token ?? "1");
    if (value.refreshToken) Cookie.set(REFRESH_TOKEN, value.refreshToken);
    navigate("/");
  }

  async function logout() {
    try {
      await submitLogout();
    } catch {
      // Ignore network errors so the local session is still cleared
    } finally {
      Cookie.remove(TOKEN);
      Cookie.remove(REFRESH_TOKEN);
      navigate("/auth/login");
    }
  }

  return { login, logout };
};

export default useAuthOperations;
