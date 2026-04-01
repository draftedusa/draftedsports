import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageWrapper from "@/components/layout/PageWrapper";

export const metadata: Metadata = {
  title: "UNDRAFTED — Mock Sports Media",
  description: "A mock sports media platform inspired by ESPN, Bleacher Report, and The Athletic. Live game control, analytics dashboard, and community features.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-surface-100 text-surface-text antialiased">
        <Providers>
          <Header />
          <PageWrapper>{children}</PageWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
