export const metadata = {
  title: "Accessibility — UNDRAFTED",
};

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-black tracking-tighter text-surface-text">Accessibility Statement</h1>
      <p className="text-xs text-surface-muted">Last updated: April 7, 2026</p>

      <section className="space-y-4 text-sm text-surface-muted leading-relaxed">
        <h2 className="text-lg font-bold text-surface-text">Our Commitment</h2>
        <p>
          UNDRAFTED is committed to ensuring digital accessibility for people with disabilities.
          We continually improve the user experience for everyone and apply the relevant accessibility
          standards to achieve this goal.
        </p>

        <h2 className="text-lg font-bold text-surface-text">Standards</h2>
        <p>
          We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
          These guidelines explain how to make web content more accessible to people with a wide
          range of disabilities.
        </p>

        <h2 className="text-lg font-bold text-surface-text">Features</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Semantic HTML structure for screen reader compatibility</li>
          <li>Keyboard navigation support throughout the platform</li>
          <li>Sufficient color contrast ratios in both light and dark modes</li>
          <li>Alt text and ARIA labels for interactive elements</li>
          <li>Responsive design that adapts to different screen sizes</li>
          <li>Focus indicators for interactive elements</li>
        </ul>

        <h2 className="text-lg font-bold text-surface-text">Feedback</h2>
        <p>
          We welcome your feedback on the accessibility of UNDRAFTED. If you encounter any barriers,
          please contact us at accessibility@undrafted.com. We will make reasonable efforts to address
          the issue promptly.
        </p>
      </section>

      <p className="text-xs text-surface-muted italic">
        Note: UNDRAFTED is a demonstration platform. This statement is for illustrative purposes only.
      </p>
    </div>
  );
}
