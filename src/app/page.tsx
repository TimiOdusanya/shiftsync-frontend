"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { cn } from "@/lib/utils";
import {
  Calendar,
  RefreshCw,
  BarChart3,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Globe,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Real-time scheduling",
    description:
      "Build and edit shifts in seconds. Every change syncs instantly to the whole team via WebSockets.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: RefreshCw,
    title: "Shift swapping",
    description:
      "Staff can request swaps directly. Managers approve in one tap — no email chains, no confusion.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: BarChart3,
    title: "Analytics & insights",
    description:
      "Track projected overtime, fairness scores, and hour distribution across your entire workforce.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Clock,
    title: "Live on-duty view",
    description:
      "See exactly who's working at each location right now. No calls, no guessing.",
    color: "text-info",
    bg: "bg-info/10",
  },
];

const benefits = [
  "Multi-location scheduling from one dashboard",
  "Automatic overtime detection and warnings",
  "Fair hour distribution with fairness scoring",
  "Real-time updates without refreshing",
  "Role-based access for managers and staff",
  "Shift drop and claim workflow built-in",
];

const testimonials = [
  {
    quote:
      "ShiftSync cut our scheduling time in half. The real-time updates mean we never have confusion about who's working.",
    author: "Sarah K.",
    role: "Operations Manager · Coastal Eats",
    initials: "SK",
  },
  {
    quote:
      "The fairness score feature alone is worth it. My team trusts that hours are distributed equitably now.",
    author: "Marcus T.",
    role: "GM · North Shore Grill",
    initials: "MT",
  },
  {
    quote:
      "Swap requests used to take days to resolve. Now it's minutes. My staff actually prefer the new workflow.",
    author: "Priya N.",
    role: "Area Manager · Sunset Kitchens",
    initials: "PN",
  },
];

function DashboardPreview() {
  return (
    <div className="relative rounded-2xl border border-border bg-surface shadow-modal overflow-hidden">
      <div className="flex h-10 items-center gap-1.5 border-b border-border bg-muted/40 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <span className="ml-2 text-xs text-muted-foreground">shiftsync.app/schedule</span>
      </div>
      <div className="flex h-[320px]">
        <div className="w-48 border-r border-border bg-surface p-2">
          <div className="mb-3 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="text-xs font-semibold">ShiftSync</span>
            </div>
          </div>
          {["Schedule", "Swaps", "Analytics", "On-Duty", "Settings"].map((item, i) => (
            <div
              key={item}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-xs",
                i === 0 ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"
              )}
            >
              <span className="h-3 w-3 rounded-sm bg-current opacity-60" />
              {item}
            </div>
          ))}
        </div>
        <div className="flex-1 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="h-4 w-24 rounded bg-foreground/10" />
              <div className="mt-1.5 h-3 w-40 rounded bg-foreground/6" />
            </div>
            <div className="h-8 w-20 rounded-lg bg-primary/80" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { col: "bg-primary/15", badge: "bg-success/20 text-success" },
              { col: "bg-warning/10", badge: "bg-warning/20 text-warning" },
              { col: "bg-primary/10", badge: "bg-success/20 text-success" },
              { col: "bg-muted/60", badge: "bg-muted text-muted-foreground" },
              { col: "bg-primary/15", badge: "bg-success/20 text-success" },
              { col: "bg-warning/10", badge: "bg-warning/20 text-warning" },
            ].map((card, i) => (
              <div key={i} className={cn("rounded-xl border border-border p-2.5", card.col)}>
                <div className="mb-1.5 h-2.5 w-16 rounded bg-foreground/15" />
                <div className={cn("inline-block rounded-full px-1.5 py-0.5 text-[8px] font-medium", card.badge)}>
                  {i % 3 === 0 ? "PUBLISHED" : i % 3 === 1 ? "DRAFT" : "PUBLISHED"}
                </div>
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full rounded bg-foreground/10" />
                  <div className="h-1.5 w-4/5 rounded bg-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/schedule");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm supports-[backdrop-filter]:bg-surface/80">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-5">
          <Logo size="md" showText={true} />
          <nav className="hidden items-center gap-6 md:flex">
            {["Features", "Benefits", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login" className="gap-1.5">
                Get started
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border px-5 pb-20 pt-20 md:pt-28">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
            aria-hidden
          />
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 font-medium">
              <Zap className="h-3 w-3 text-warning" />
              Real-time multi-location scheduling
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]">
              Staff scheduling that{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">actually works</span>
                <span
                  className="absolute inset-x-0 bottom-1 h-2 rounded-full bg-primary/10"
                  aria-hidden
                />
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Multi-location shift planning with real-time sync, built-in swap workflows,
              and fairness tracking — all in one place.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="h-12 px-6 text-base">
                <Link href="/login">
                  Get started free
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-6 text-base">
                <Link href="/login">Sign in to dashboard</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required · Set up in under 5 minutes
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl px-0 sm:px-4">
            <DashboardPreview />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-xl text-center">
              <Badge variant="secondary" className="mb-4">Platform features</Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Everything your team needs
              </h2>
              <p className="mt-3 text-muted-foreground">
                Built around the real workflows of modern hospitality and service teams.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
                >
                  <div className={cn("mb-4 inline-flex rounded-xl p-2.5", f.bg)}>
                    <f.icon className={cn("h-5 w-5", f.color)} aria-hidden />
                  </div>
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="border-y border-border bg-muted/30 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Badge variant="secondary" className="mb-4">Why ShiftSync</Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Designed for teams that can't afford scheduling errors
                </h2>
                <p className="mt-4 text-muted-foreground">
                  ShiftSync replaces spreadsheets, group chats, and manual processes with
                  a system that keeps everyone aligned — automatically.
                </p>
                <ul className="mt-8 space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="mt-8" asChild>
                  <Link href="/login">Start scheduling now</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: Globe,
                    title: "Multi-location management",
                    description:
                      "Manage all your sites from a single view. Filter by location, track headcount, and prevent conflicts.",
                  },
                  {
                    icon: Shield,
                    title: "Overtime prevention",
                    description:
                      "Automatic overtime warnings before you publish. Catch issues before they become payroll problems.",
                  },
                  {
                    icon: Users,
                    title: "Team coordination",
                    description:
                      "Staff can drop, swap, and claim shifts within guardrails you set. Less friction, more autonomy.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
                  >
                    <div className="shrink-0 rounded-xl bg-accent p-2.5">
                      <item.icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-xl text-center">
              <Badge variant="secondary" className="mb-4">Customer stories</Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Teams that rely on ShiftSync
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.author}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
                >
                  <div className="mb-4 flex gap-0.5">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          viewBox="0 0 12 12"
                          className="h-3.5 w-3.5 fill-warning"
                          aria-hidden
                        >
                          <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5l3.5-.5z" />
                        </svg>
                      ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary px-5 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground md:text-4xl">
              Ready to simplify scheduling?
            </h2>
            <p className="mt-4 text-primary-foreground/75">
              Join teams already using ShiftSync to save hours every week and keep staff aligned.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-12 bg-white px-6 text-base font-semibold text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/login">
                  Get started free
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/30 px-6 text-base text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <Logo size="sm" showText={true} />
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#benefits" className="hover:text-foreground">Benefits</a>
            <a href="#testimonials" className="hover:text-foreground">Testimonials</a>
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ShiftSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
