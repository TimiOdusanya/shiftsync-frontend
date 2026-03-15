/**
 * Design tokens for ShiftSync — semantic colors, spacing, typography.
 * Use Tailwind classes that reference these (e.g. bg-background, text-foreground).
 */

export const designTokens = {
  colors: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    card: "var(--card)",
    cardForeground: "var(--card-foreground)",
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    secondary: "var(--secondary)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    accent: "var(--accent)",
    destructive: "var(--destructive)",
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",
  },
  spacing: {
    page: "1.5rem",
    card: "1rem",
    section: "1.5rem",
  },
  radius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
  },
} as const;
