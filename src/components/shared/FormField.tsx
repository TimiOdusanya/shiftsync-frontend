"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  name,
  error,
  required,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
        {label}
      </Label>
      {React.isValidElement(children) && typeof children.type !== "string"
        ? React.cloneElement(children as React.ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>, {
            id: name,
            "aria-invalid": !!error,
            "aria-describedby": error ? `${name}-error` : hint ? `${name}-hint` : undefined,
          })
        : children}
      {hint && !error && (
        <p id={`${name}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
