import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoTrace — Intelligent DSA Guidance",
  description:
    "AlgoTrace studies your reasoning, code, errors and attempts to give you the next useful hint—not the final solution.",
  keywords: ["DSA", "coding coach", "Socratic learning", "algorithm tutor", "problem solving"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-floral text-smoky font-sans antialiased selection:bg-bone selection:text-smoky">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
