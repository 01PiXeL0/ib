"use client";

import { Avatar, Button, Tab, Tabs } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useAuthModal } from "./auth-modal-context";
import type { AuthMode } from "./auth-modal-context";

type TextFieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  autoComplete?: string;
  error?: string | null;
  onChange: (value: string) => void;
};

function TextField({ label, placeholder, type = "text", value, autoComplete, error, onChange }: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300" htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

type Props = {
  onSuccess?: (data: { mode: AuthMode; user?: { id: number; email: string; name?: string | null } }) => void;
};

const initialState = {
  email: "",
  password: "",
  name: "",
};

export default function AuthModal({ onSuccess }: Props) {
  const { isOpen, mode, closeModal, setMode, setUser } = useAuthModal();
  const [email, setEmail] = useState(initialState.email);
  const [password, setPassword] = useState(initialState.password);
  const [name, setName] = useState(initialState.name);
  const [emailDirty, setEmailDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [nameDirty, setNameDirty] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [autoCloseTimer, setAutoCloseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [autoCloseTimer]);

  useEffect(() => {
    if (!mounted) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : originalOverflow;
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, mounted]);

  const resetState = () => {
    setStatus(null);
    setError(null);
    setEmail(initialState.email);
    setPassword(initialState.password);
    setName(initialState.name);
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
    setEmailDirty(false);
    setPasswordDirty(false);
    setNameDirty(false);
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailPattern.test(email);
  const passwordValid = password.length >= 6;
  const nameValid = mode === "login" ? true : name.trim().length >= 2;
  const canSubmit = emailValid && passwordValid && nameValid;

  const emailError = emailDirty && !emailValid ? "Введите корректный email" : null;
  const passwordError = passwordDirty && !passwordValid ? "Минимум 6 символов" : null;
  const nameError = mode === "register" && nameDirty && !nameValid ? "Минимум 2 символа" : null;

  const helperMessage = useMemo(() => {
    if (error) return { text: error, color: "text-rose-400" };
    if (status) return { text: status, color: "text-emerald-400" };
    return null;
  }, [error, status]);

  const handleSubmit = () => {
    if (!canSubmit || pending) return;
    setStatus(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Не удалось выполнить запрос");
        setStatus(json.message || "Готово");
        if (json.user) {
          setUser(json.user);
        }
        onSuccess?.({ mode, user: json.user });
        const timer = setTimeout(() => {
          closeModal();
          resetState();
        }, 1200);
        setAutoCloseTimer(timer);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  const handleClose = () => {
    closeModal();
    resetState();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 py-10 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 p-6 text-white shadow-2xl shadow-indigo-900/40"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 -z-10 opacity-40">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 blur-3xl" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar size="sm" name="DB" className="bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 text-[10px] font-bold text-white" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">DevBasics</p>
                  <p className="text-base font-semibold">{mode === "login" ? "Вход в профиль" : "Создание профиля"}</p>
                </div>
              </div>
              <Button size="sm" variant="light" onPress={handleClose}>
                Закрыть
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <Tabs
                selectedKey={mode}
                onSelectionChange={(key) => {
                  setMode(key as AuthMode);
                  setStatus(null);
                  setError(null);
                }}
                variant="solid"
                color="primary"
                fullWidth
              >
                <Tab key="login" title="Войти" />
                <Tab key="register" title="Регистрация" />
              </Tabs>

              {mode === "register" && (
                <TextField
                  label="Имя"
                  placeholder="Как к вам обращаться"
                  value={name}
                  onChange={(val) => {
                    setName(val);
                    setNameDirty(true);
                  }}
                  error={nameError}
                />
              )}
              <TextField
                label="Email"
                placeholder="you@example.com"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(val) => {
                  setEmail(val);
                  setEmailDirty(true);
                }}
                error={emailError}
              />
              <TextField
                label="Пароль"
                placeholder="Минимум 6 символов"
                type="password"
                value={password}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                onChange={(val) => {
                  setPassword(val);
                  setPasswordDirty(true);
                }}
                error={passwordError}
              />
              {helperMessage && <p className={`text-sm font-semibold ${helperMessage.color}`}>{helperMessage.text}</p>}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button variant="light" className="w-full sm:w-auto" onPress={handleClose}>
                  Отмена
                </Button>
                <Button
                  color="primary"
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 font-semibold text-white sm:w-auto"
                  onPress={handleSubmit}
                  isDisabled={!canSubmit || pending}
                  isLoading={pending}
                >
                  {mode === "login" ? "Войти" : "Создать аккаунт"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

