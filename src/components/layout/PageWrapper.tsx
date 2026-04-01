"use client";

import { usePathname } from "next/navigation";
import LeftRail from "./LeftRail";
import RightRail from "./RightRail";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuth  = pathname === "/login";

  if (isAdmin || isAuth) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="flex max-w-[1400px] mx-auto w-full px-4 gap-6 flex-1">
      <LeftRail />
      <main className="flex-1 min-w-0 py-6 min-h-screen">{children}</main>
      <RightRail />
    </div>
  );
}
