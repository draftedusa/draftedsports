"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import LiveTicker from "./LiveTicker";
import Footer from "./Footer";
import PageWrapper from "./PageWrapper";

// Routes that bypass the global chrome entirely
const CHROMELESS_PATHS = ["/auth"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChromeless = CHROMELESS_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isChromeless) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <LiveTicker />
      <PageWrapper>{children}</PageWrapper>
      <Footer />
    </>
  );
}
