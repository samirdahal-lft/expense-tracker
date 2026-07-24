import { useEffect, useState } from "react";
import { type AuthUser, type LoginInput, getCurrentUser, login as apiLogin, logout as apiLogout } from "@/api/client";

/**
 * Auth-state seam. On mount it bootstraps the current session via the
 * current-user endpoint; `user` is the account or null, `bootstrapping` guards
 * the initial check. Exposes login/logout/register methods (all set user on success).
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((u) => {
        if (active) setUser(u);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setBootstrapping(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = async (input: LoginInput): Promise<AuthUser> => {
    const u = await apiLogin(input);
    setUser(u);
    return u;
  };

  const logout = async (): Promise<void> => {
    await apiLogout();
    setUser(null);
  };

  return { user, bootstrapping, setUser, login, logout };
}
