import { useState, type FormEvent } from "react";
import { useFlow } from "@robusgauli/proto";
import { Shell } from "../../shell/Shell";
import { Card, Button, TextInput, PageHeader, ErrorText } from "@/proto-vocab";

export default function Login() {
  const { goto } = useFlow();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setError("");
    goto("dashboard");
  }

  return (
    <Shell>
      <div className="flex justify-center">
        <div className="grid gap-6">
          <PageHeader title="Expense Tracker" subtitle="Sign in to your account" />
          <Card>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <TextInput
                id="login-email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextInput
                id="login-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error ? <ErrorText>{error}</ErrorText> : null}
              <Button type="submit">Sign in</Button>
              <Button type="button" variant="ghost" onClick={() => goto("register")}>
                Don&apos;t have an account? Register
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
