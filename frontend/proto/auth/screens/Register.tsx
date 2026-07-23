import { useState, type FormEvent } from "react";
import { useFlow } from "@robusgauli/proto";
import { Shell } from "../../shell/Shell";
import { Card, Button, TextInput, PageHeader, ErrorText } from "@/proto-vocab";

export default function Register() {
  const { goto } = useFlow();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Fill in every field.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    goto("dashboard");
  }

  return (
    <Shell>
      <div className="flex justify-center">
        <div className="grid gap-6">
          <PageHeader title="Expense Tracker" subtitle="Create your account" />
          <Card>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <TextInput
                id="register-name"
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextInput
                id="register-email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextInput
                id="register-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextInput
                id="register-confirm-password"
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error ? <ErrorText>{error}</ErrorText> : null}
              <Button type="submit">Create account</Button>
              <Button type="button" variant="ghost" onClick={() => goto("login")}>
                Already have an account? Sign in
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
