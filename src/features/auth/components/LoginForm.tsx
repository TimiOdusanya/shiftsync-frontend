"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { email, minLength, required, runValidations } from "@/lib/validation";

const PASSWORD_MIN_LENGTH = 8;

export function LoginForm() {
  const [emailValue, setEmailValue] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { login, loginMutation } = useAuth();

  const validate = useCallback((): boolean => {
    const passwordError =
      required(password, "Password") ??
      minLength(password, PASSWORD_MIN_LENGTH, "Password");
    const result = runValidations([
      { key: "email", error: email(emailValue) },
      { key: "password", error: passwordError },
    ]);
    if (result.valid) {
      setFieldErrors({});
      return true;
    }
    setFieldErrors(result.errors);
    return false;
  }, [emailValue, password]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setFieldErrors({});
    login(emailValue.trim(), password).catch(() => {});
  }

  const canSubmit =
    emailValue.trim() !== "" &&
    password.length >= PASSWORD_MIN_LENGTH &&
    !loginMutation.isPending;

  return (
    <Card className="w-full border-border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
        <p className="text-sm text-muted-foreground">
          Staff scheduling — multi-location
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField
            label="Email"
            name="email"
            required
            error={
              fieldErrors.email ??
              (loginMutation.isError ? (loginMutation.error as Error).message : undefined)
            }
          >
            <Input
              type="email"
              placeholder="you@example.com"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              autoComplete="email"
              disabled={loginMutation.isPending}
              aria-invalid={!!fieldErrors.email}
            />
          </FormField>
          <FormField
            label="Password"
            name="password"
            required
            error={fieldErrors.password}
          >
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loginMutation.isPending}
              aria-invalid={!!fieldErrors.password}
            />
          </FormField>
          <Button
            type="submit"
            className="w-full"
            loading={loginMutation.isPending}
            disabled={!canSubmit}
          >
            {loginMutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
