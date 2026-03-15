const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function required(value: string, fieldName: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `${fieldName} is required`;
  return null;
}

export function email(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address";
  return null;
}

export function minLength(value: string, min: number, fieldName: string): string | null {
  if (value.length < min) return `${fieldName} must be at least ${min} characters`;
  return null;
}

export function requiredId(value: string, fieldName: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `Select ${fieldName}`;
  return null;
}

export type ValidationResult = { valid: true } | { valid: false; errors: Record<string, string> };

export function runValidations(
  checks: Array<{ key: string; error: string | null }>
): ValidationResult {
  const errors: Record<string, string> = {};
  for (const { key, error } of checks) {
    if (error) errors[key] = error;
  }
  return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
}
