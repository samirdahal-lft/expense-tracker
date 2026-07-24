import { useState } from "react";
import { LoginForm } from "@/features/auth/LoginForm";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "register" | "login";

/**
 * Auth-state gate: while bootstrapping the session, render nothing; when there is
 * no session, show the unauthenticated view (Register or Login, user can switch);
 * once authenticated, show the dashboard with a logout affordance in its header.
 */
export default function App() {
  const { user, bootstrapping, setUser, login, logout } = useAuth();
  const [mode, setMode] = useState<AuthMode>("register");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl py-10">
        {bootstrapping ? null : user ? (
          <Dashboard onLogout={logout} />
        ) : mode === "register" ? (
          <RegisterForm onAuthenticated={setUser} onSwitchToLogin={() => setMode("login")} />
        ) : (
          <LoginForm onAuthenticated={setUser} onSwitchToRegister={() => setMode("register")} login={login} />
        )}
      </div>
    </div>
  );
}
