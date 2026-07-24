import { useState } from "react";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button, Card, PageHeader } from "@/proto-vocab";

type AuthMode = "register" | "login";

/**
 * Auth-state gate: while bootstrapping the session, render nothing; when there is
 * no session, show the unauthenticated view (Register, with a link to sign in);
 * once authenticated, show the dashboard. The real Login screen + logout arrive
 * in T-011 — for now the "Sign in" link lands on a placeholder.
 */
export default function App() {
  const { user, bootstrapping, setUser } = useAuth();
  const [mode, setMode] = useState<AuthMode>("register");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl py-10">
        {bootstrapping ? null : user ? (
          <Dashboard />
        ) : mode === "register" ? (
          <RegisterForm onAuthenticated={setUser} onSwitchToLogin={() => setMode("login")} />
        ) : (
          <LoginPlaceholder onSwitchToRegister={() => setMode("register")} />
        )}
      </div>
    </div>
  );
}

/** Temporary stand-in for the Login screen (built in T-011). */
function LoginPlaceholder({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  return (
    <div className="flex justify-center">
      <div className="grid gap-6">
        <PageHeader title="Expense Tracker" subtitle="Sign in" />
        <Card>
          <p className="text-sm text-muted-foreground">Sign in is coming soon.</p>
          <Button type="button" variant="ghost" onClick={onSwitchToRegister} className="mt-4">
            Need an account? Create one
          </Button>
        </Card>
      </div>
    </div>
  );
}
