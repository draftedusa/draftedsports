"use client";

import { useUser, SignInButton } from "@clerk/nextjs";

interface AuthGateProps {
  children: React.ReactNode;
  tooltip?: string;
  className?: string;
}

/**
 * Wraps interactive elements. Signed-in users see children normally.
 * Signed-out users see a SignInButton trigger with a hover tooltip.
 */
export default function AuthGate({
  children,
  tooltip = "Sign in to interact",
  className,
}: AuthGateProps) {
  const { isSignedIn } = useUser();
  if (isSignedIn) return <>{children}</>;

  return (
    <SignInButton mode="modal">
      <span className={`relative group inline-flex${className ? ` ${className}` : ""}`}>
        <span className="pointer-events-none">{children}</span>
        <span
          role="tooltip"
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-white/10 text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg"
        >
          {tooltip}
        </span>
      </span>
    </SignInButton>
  );
}
