interface PanelProps {
  title?: string;
  titleRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  accent?: string; // Tailwind border-color class e.g. "border-red-500"
}

/** Reusable card/panel used in control panels, dashboards, and pages. */
export default function Panel({ title, titleRight, children, className = "", accent }: PanelProps) {
  return (
    <div className={`bg-surface-200 border border-surface-300 rounded-xl overflow-hidden ${accent ? `border-t-2 ${accent}` : ""} ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-300">
          <h3 className="text-sm font-semibold text-surface-text uppercase tracking-wide">{title}</h3>
          {titleRight && <div className="text-sm text-surface-muted">{titleRight}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
