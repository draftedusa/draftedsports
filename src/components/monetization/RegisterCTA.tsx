import Link from "next/link";

interface RegisterCTAProps {
  /** The hook text, e.g. "Sign In to Follow Team" */
  label: string;
  /** Additional context shown below the button */
  sublabel?: string;
  variant?: "inline" | "card";
}

export default function RegisterCTA({ label, sublabel, variant = "inline" }: RegisterCTAProps) {
  if (variant === "card") {
    return (
      <div className="bg-surface-200 border border-brand/20 rounded-xl p-5 text-center">
        <p className="text-sm font-bold text-surface-text mb-2">{label}</p>
        {sublabel && <p className="text-xs text-surface-muted mb-3">{sublabel}</p>}
        <Link
          href="/auth/login"
          className="inline-flex px-5 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-lg transition-colors"
        >
          Sign In / Register Free
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-surface-200 border border-surface-300 rounded-lg px-4 py-3">
      <p className="text-xs font-semibold text-surface-text">{label}</p>
      <Link
        href="/auth/login"
        className="inline-flex px-3 py-1.5 bg-brand hover:bg-brand/90 text-white text-[10px] font-bold rounded-lg transition-colors shrink-0"
      >
        Sign In
      </Link>
    </div>
  );
}
