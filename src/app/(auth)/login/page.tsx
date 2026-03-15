"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginFormSkeleton } from "@/features/auth/components/LoginFormSkeleton";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/schedule");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <LoginFormSkeleton />;
  }

  if (isAuthenticated) return null;

  return <LoginForm />;
}
