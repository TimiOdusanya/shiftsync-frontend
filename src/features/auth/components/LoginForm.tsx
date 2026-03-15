"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginMutation } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {
      // Error shown via loginMutation.isError
    }
  }

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
              loginMutation.isError
                ? (loginMutation.error as Error).message
                : undefined
            }
          >
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loginMutation.isPending}
            />
          </FormField>
          <FormField label="Password" name="password" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loginMutation.isPending}
            />
          </FormField>
          <Button
            type="submit"
            className="w-full"
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
