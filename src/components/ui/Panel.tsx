interface PanelProps {
  title?: string;
  titleRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  accent?: string; // Tailwind border-color class e.g. "border-red-500"
}

/** Reusable dark card/panel used in control panels, dashboards, and pages. */
export default function Panel({ title, titleRight, children, className = "", accent }: PanelProps) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden ${accent ? `border-t-2 ${accent}` : ""} ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">{title}</h3>
          {titleRight && <div className="text-sm text-gray-400">{titleRight}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
