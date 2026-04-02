interface KickerProps {
  label: string;
  variant?: "brand" | "breaking" | "live" | "muted";
  className?: string;
}

const VARIANTS = {
  brand:    "text-brand",
  breaking: "text-red-500",
  live:     "text-brand animate-pulse",
  muted:    "text-surface-muted",
};

export default function Kicker({ label, variant = "brand", className = "" }: KickerProps) {
  return (
    <p
      className={`text-[10px] font-black uppercase tracking-[0.15em] leading-none ${VARIANTS[variant]} ${className}`}
    >
      {variant === "live" && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand mr-1.5 align-middle animate-pulse" />
      )}
      {label}
    </p>
  );
}
