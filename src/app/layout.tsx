import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoTrace | Behavioral DSA Coach",
  description:
    "AI-powered behavioral coaching system for DSA practice. Track coding behavior, identify weaknesses, and improve with Socratic guidance.",
  keywords: ["DSA", "coding coach", "behavioral analysis", "algorithm practice", "AI coaching"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-[var(--font-space)]">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
