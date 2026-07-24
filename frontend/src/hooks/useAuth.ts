import { useEffect, useState } from "react";
import { type AuthUser, getCurrentUser } from "@/api/client";

/**
 * Auth-state seam. On mount it bootstraps the current session via the
 * current-user endpoint; `user` is the account or null, `bootstrapping` guards
 * the initial check. `setUser` lets a successful register/login promote the
 * session. Login/logout are layered on by T-011.
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

  return { user, bootstrapping, setUser };
}
