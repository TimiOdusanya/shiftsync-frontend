"use client";

import { Toaster as SonnerToaster } from "sonner";
import { cn } from "@/lib/utils";

const toastBase =
  "group relative flex flex-row items-start gap-3 rounded-xl border bg-card py-3.5 pl-4 pr-4 text-left text-sm font-medium text-card-foreground shadow-dropdown";

const contentBase = "min-w-0 flex-1";
const titleBase = "font-semibold leading-tight text-foreground";
const descriptionBase = "mt-1 text-xs font-normal leading-relaxed text-muted-foreground";
const closeButtonBase =
  "shrink-0 self-start rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card border-0 bg-transparent cursor-pointer";

const actionButtonBase =
  "order-2 mt-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

const cancelButtonBase =
  "order-2 mt-2 mr-2 rounded-lg border-0 bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors={false}
      closeButton
      offset="1rem"
      gap={8}
      visibleToasts={4}
      toastOptions={{
        descriptionClassName: descriptionBase,
        closeButtonAriaLabel: "Dismiss notification",
        classNames: {
          toast: cn(
            toastBase,
            "border-border",
            "[&>[data-icon]]:shrink-0 [&>[data-icon]]:order-0",
            "[&>[data-content]]:order-1 [&>[data-content]]:min-w-0 [&>[data-content]]:flex-1",
            "[&>[data-close-button]]:order-[9999] [&>[data-close-button]]:ml-auto",
            "[&>[data-cancel]]:order-2 [&>[data-action]]:order-2"
          ),
          content: contentBase,
          title: titleBase,
          description: descriptionBase,
          closeButton: closeButtonBase,
          cancelButton: cancelButtonBase,
          actionButton: actionButtonBase,
          success: cn(
            "!border-l-4 !border-l-success !border-border !bg-success-subtle/50",
            "[&>[data-icon]]:text-success"
          ),
          error: cn(
            "!border-l-4 !border-l-danger !border-border !bg-danger-subtle/50",
            "[&>[data-icon]]:text-danger"
          ),
          warning: cn(
            "!border-l-4 !border-l-warning !border-border !bg-warning-subtle/50",
            "[&>[data-icon]]:text-warning"
          ),
          info: cn(
            "!border-l-4 !border-l-info !border-border !bg-info-subtle/50",
            "[&>[data-icon]]:text-info"
          ),
        },
      }}
    />
  );
}
