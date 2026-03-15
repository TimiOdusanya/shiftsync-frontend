"use client";

import * as React from "react";

interface SidebarContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);
  const toggle = React.useCallback(() => setOpen((o) => !o), []);
  const toggleCollapsed = React.useCallback(
    () => setCollapsed((c) => !c),
    []
  );
  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      collapsed,
      setCollapsed,
      toggleCollapsed,
    }),
    [open, toggle, collapsed, toggleCollapsed]
  );
  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    return {
      open: true,
      setOpen: () => {},
      toggle: () => {},
      collapsed: false,
      setCollapsed: () => {},
      toggleCollapsed: () => {},
    };
  }
  return ctx;
}
