import { type FormEvent, useState } from "react";
import { type AuthUser, register } from "@/api/client";
import { Button, Card, ErrorText, PageHeader, TextInput } from "@/proto-vocab";

const MIN_PASSWORD_LENGTH = 8;

interface RegisterFormProps {
  /** Called with the new account after a successful registration. */
  onAuthenticated: (user: AuthUser) => void;
  /** Switch the unauthenticated view to the Login screen. */
  onSwitchToLogin: () => void;
}

/** Account-creation screen. Validates client-side, then calls the register endpoint;
 * on success it hands the account up so the app can show the authenticated view. */
export function RegisterForm({ onAuthenticated, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): string | null {
    if (!name || !email || !password || !confirmPassword) {
      return "Please fill in every field.";
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (password !== confirmPassword) {
      return "Passwords don't match.";
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
      const user = await register({ name, email, password, confirmPassword });
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="grid gap-6">
        <PageHeader title="Expense Tracker" subtitle="Create your account" />
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <TextInput id="register-name" label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <TextInput id="register-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextInput id="register-password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <TextInput id="register-confirm-password" label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {error ? <ErrorText>{error}</ErrorText> : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </Button>
            <Button type="button" variant="ghost" onClick={onSwitchToLogin}>
              Already have an account? Sign in
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
