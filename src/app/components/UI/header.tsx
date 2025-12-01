"use client";

import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuthModal } from "../auth-modal-context";

const links = [
  { label: "Главная", href: "/#hero" },
  { label: "Сценарии", href: "/#flows" },
  { label: "Тест", href: "/assessment" },
  { label: "Чат", href: "/chat" },
  { label: "Контакты", href: "/#contacts" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openModal, user, logout } = useAuthModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const gradientClass = useMemo(
    () =>
      scrolled
        ? "bg-slate-950/90 border-white/10 shadow-2xl shadow-slate-900/40"
        : "bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/60 border-white/5",
    [scrolled],
  );

  const renderNavLink = (href: string, label: string) => {
    const active = pathname === href || (href.startsWith("#") && pathname === "/");
    return (
      <Link
        key={href}
        href={href}
        color="foreground"
        className={`text-sm font-medium transition-colors ${active ? "text-white" : "text-zinc-400 hover:text-white"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="relative z-50">
      <div className="pointer-events-none absolute inset-x-1/4 top-0 -z-10 h-32 blur-[120px]">
        <div className="h-full w-full bg-gradient-to-r from-indigo-500/50 via-cyan-400/40 to-purple-500/40 opacity-70" />
      </div>
      <Navbar
        isBordered
        maxWidth="xl"
        className={`backdrop-blur-xl transition-all duration-300 ${gradientClass}`}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent justify="start" className="gap-3">
          <NavbarMenuToggle className="sm:hidden" aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"} />
          <NavbarBrand className="gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-indigo-600/40">
              DB
            </div>
            <div className="flex flex-col leading-tight">
              <p className="text-lg font-semibold text-zinc-300">DEVBASICS</p>
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">профиль + тест + чат</span>
            </div>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="center" className="hidden gap-5 sm:flex">
          {links.map((link) => (
            <NavbarItem key={link.href}>{renderNavLink(link.href, link.label)}</NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end" className="gap-2">
          {user ? (
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <button className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-left text-sm text-white transition hover:border-white/40">
                    <Avatar name={user.name || user.email} size="sm" className="bg-indigo-500 text-xs font-semibold" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Профиль</span>
                      <span className="text-sm font-semibold">{user.name || "Без имени"}</span>
                    </div>
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="profile menu" variant="flat">
                  <DropdownItem key="profile" href="/profile">
                    Перейти в профиль
                  </DropdownItem>
                  <DropdownItem key="assessment" href="/assessment">
                    Пройти тест
                  </DropdownItem>
                  <DropdownItem key="logout" className="text-rose-500" onPress={logout}>
                    Выйти
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          ) : (
            <>
              <NavbarItem className="hidden gap-2 sm:flex">
                <Button variant="light" color="primary" className="font-semibold" onPress={() => openModal("login")}>
                  Войти
                </Button>
                <Button
                  color="primary"
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 font-semibold text-white shadow-lg shadow-indigo-500/40"
                  onPress={() => openModal("register")}
                >
                  Регистрация
                </Button>
              </NavbarItem>
              <NavbarItem className="sm:hidden">
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="font-semibold"
                  onPress={() => openModal("login")}
                >
                  Войти
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        <NavbarMenu className="gap-6 bg-slate-950/95 px-4 py-6 backdrop-blur-2xl">
          <div className="flex flex-col gap-1 text-sm text-zinc-500">
            <span>Навигация</span>
            <Divider className="bg-white/5" />
          </div>
          {links.map((link) => (
            <NavbarMenuItem key={link.href} onClick={() => setIsMenuOpen(false)}>
              {renderNavLink(link.href, link.label)}
            </NavbarMenuItem>
          ))}
          <Divider className="bg-white/5" />
          {user ? (
            <div className="flex flex-col gap-3">
              <Button variant="flat" color="primary" as={Link} href="/profile">
                Профиль
              </Button>
              <Button color="danger" variant="light" onPress={logout}>
                Выйти
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button variant="flat" color="primary" onPress={() => openModal("login")}>
                Войти
              </Button>
              <Button
                color="primary"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white"
                onPress={() => openModal("register")}
              >
                Зарегистрироваться
              </Button>
            </div>
          )}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
