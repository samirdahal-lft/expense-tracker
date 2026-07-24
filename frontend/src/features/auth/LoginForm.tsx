import { type FormEvent, useState } from "react";
import { type AuthUser, type LoginInput } from "@/api/client";
import { Button, Card, ErrorText, PageHeader, TextInput } from "@/proto-vocab";

interface LoginFormProps {
  /** Called with the account after a successful login. */
  onAuthenticated: (user: AuthUser) => void;
  /** Switch the unauthenticated view to the Register screen. */
  onSwitchToRegister: () => void;
  /** The login API function (injected for testability). */
  login: (input: LoginInput) => Promise<AuthUser>;
}

/** Sign-in screen. Validates client-side, then calls the login endpoint;
 * on success it hands the account up so the app can show the authenticated view. */
export function LoginForm({ onAuthenticated, onSwitchToRegister, login }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): string | null {
    if (!email || !password) {
      return "Please fill in every field.";
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="grid gap-6">
        <PageHeader title="Expense Tracker" subtitle="Sign in" />
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <TextInput id="login-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextInput id="login-password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error ? <ErrorText>{error}</ErrorText> : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
            <Button type="button" variant="ghost" onClick={onSwitchToRegister}>
              Need an account? Create one
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
