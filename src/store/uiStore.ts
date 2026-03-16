import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface SidebarSlice {
  open: boolean;
  collapsed: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
}

export type ScheduleViewMode = "table" | "list";

interface UIState extends SidebarSlice {
  theme: Theme;
  globalLoading: boolean;
  scheduleViewMode: ScheduleViewMode;
  setTheme: (theme: Theme) => void;
  setGlobalLoading: (v: boolean) => void;
  setScheduleViewMode: (mode: ScheduleViewMode) => void;
}

export const useUIStore = create<UIState>((set) => ({
  open: true,
  collapsed: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
  setCollapsed: (collapsed) => set({ collapsed }),
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  theme: "system",
  globalLoading: false,
  scheduleViewMode: "table",
  setTheme: (theme) => set({ theme }),
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
  setScheduleViewMode: (scheduleViewMode) => set({ scheduleViewMode }),
}));

export function useSidebar() {
  const open = useUIStore((s) => s.open);
  const setOpen = useUIStore((s) => s.setOpen);
  const toggle = useUIStore((s) => s.toggle);
  const collapsed = useUIStore((s) => s.collapsed);
  const setCollapsed = useUIStore((s) => s.setCollapsed);
  const toggleCollapsed = useUIStore((s) => s.toggleCollapsed);
  return { open, setOpen, toggle, collapsed, setCollapsed, toggleCollapsed };
}

export function useTheme() {
  return useUIStore((s) => s.theme);
}

export function useSetTheme() {
  return useUIStore((s) => s.setTheme);
}

export function useGlobalLoading() {
  return useUIStore((s) => s.globalLoading);
}

export function useSetGlobalLoading() {
  return useUIStore((s) => s.setGlobalLoading);
}

export function useScheduleViewMode() {
  return useUIStore((s) => s.scheduleViewMode);
}

export function useSetScheduleViewMode() {
  return useUIStore((s) => s.setScheduleViewMode);
}
