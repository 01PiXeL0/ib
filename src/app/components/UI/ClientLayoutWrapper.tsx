"use client";
import { HeroUIProvider } from "@heroui/react";
import Header from "./header";
import AuthModal from "../auth-modal";
import { AuthModalProvider } from "../auth-modal-context";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <AuthModalProvider>
        <Header />
        {children}
        <AuthModal />
      </AuthModalProvider>
    </HeroUIProvider>
  );
}
