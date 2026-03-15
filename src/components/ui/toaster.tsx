"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      expand={false}
      richColors={false}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border border-border bg-card text-card-foreground shadow-lg flex gap-3 items-start px-4 py-3.5 text-sm font-medium",
          title: "font-semibold text-foreground",
          description: "text-muted-foreground font-normal text-xs mt-0.5",
          success:
            "!border-success/20 !bg-success/5 [&>[data-icon]]:text-success",
          error:
            "!border-danger/20 !bg-danger/5 [&>[data-icon]]:text-danger",
          warning:
            "!border-warning/20 !bg-warning/5 [&>[data-icon]]:text-warning",
          info: "!border-primary/20 !bg-primary/5 [&>[data-icon]]:text-primary",
          closeButton:
            "!bg-transparent !border-0 !text-muted-foreground hover:!text-foreground !top-3 !right-3",
        },
      }}
    />
  );
}
