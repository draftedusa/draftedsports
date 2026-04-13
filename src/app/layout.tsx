import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import SiteShell from "@/components/layout/SiteShell";
import TutorialModal from "@/components/ui/TutorialModal";

export const metadata: Metadata = {
  title: "UNDRAFTED | The Scoop",
  description: "A mock sports media platform inspired by ESPN, Bleacher Report, and The Athletic. Live game control, analytics dashboard, and community features.",
};

// UI Refresh 1.0 — PRODUCTION READY - X-STYLE UI
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-surface-100 text-surface-text antialiased">
        <Providers>
          <SiteShell>{children}</SiteShell>
          <TutorialModal />
        </Providers>
      </body>
    </html>
  );
}
