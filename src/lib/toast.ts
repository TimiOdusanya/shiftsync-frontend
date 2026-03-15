import { toast } from "sonner";

export const t = {
  success: (title: string, description?: string) =>
    toast.success(title, { description }),

  error: (title: string, description?: string) =>
    toast.error(title, {
      description: description ?? "Something went wrong. Please try again.",
    }),

  warning: (title: string, description?: string) =>
    toast.warning(title, { description }),

  info: (title: string, description?: string) =>
    toast.info(title, { description }),
};
