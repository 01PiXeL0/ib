import type { Metadata } from "next";
import "./globals.css";
import HeaderWrapper from "./components/UI/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "DevBasics",
  description: "Generated lessons",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HeaderWrapper>
          {children}
        </HeaderWrapper>
      </body>
    </html>
  );
}
