"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AuthMode = "login" | "register";

export type UserProfile = {
  id: number;
  email: string;
  name?: string | null;
};

type AuthModalContextValue = {
  isOpen: boolean;
  mode: AuthMode;
  user: UserProfile | null;
  openModal: (nextMode?: AuthMode) => void;
  closeModal: () => void;
  setMode: (mode: AuthMode) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<UserProfile | null>(null);

  const openModal = useCallback((nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("devbasics:user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to parse stored user", err);
    }
  }, []);

  const handleSetUser = useCallback((next: UserProfile | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem("devbasics:user", JSON.stringify(next));
    } else {
      localStorage.removeItem("devbasics:user");
    }
  }, []);

  const logout = useCallback(() => {
    handleSetUser(null);
  }, [handleSetUser]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ mode?: AuthMode }>;
      openModal(custom.detail?.mode || "login");
    };
    window.addEventListener("devbasics:auth", handler as EventListener);
    return () => window.removeEventListener("devbasics:auth", handler as EventListener);
  }, [openModal]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as typeof window & { devbasicsAuth?: (mode?: AuthMode) => void }).devbasicsAuth = openModal;
  }, [openModal]);

  const value = useMemo(
    () => ({
      isOpen,
      mode,
      user,
      openModal,
      closeModal,
      setMode,
      setUser: handleSetUser,
      logout,
    }),
    [closeModal, handleSetUser, isOpen, logout, mode, openModal, user],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}

