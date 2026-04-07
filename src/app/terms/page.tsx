export const metadata = {
  title: "Terms of Use — UNDRAFTED",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-black tracking-tighter text-surface-text">Terms of Use</h1>
      <p className="text-xs text-surface-muted">Last updated: April 7, 2026</p>

      <section className="space-y-4 text-sm text-surface-muted leading-relaxed">
        <h2 className="text-lg font-bold text-surface-text">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the UNDRAFTED platform, you agree to be bound by these Terms of Use.
          If you do not agree, please discontinue use of the platform immediately.
        </p>

        <h2 className="text-lg font-bold text-surface-text">2. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials.
          You agree to provide accurate information during registration and to notify us immediately
          of any unauthorized use of your account.
        </p>

        <h2 className="text-lg font-bold text-surface-text">3. User Content</h2>
        <p>
          You retain ownership of content you post on UNDRAFTED, including Fan Pulse posts and comments.
          By posting, you grant UNDRAFTED a non-exclusive, royalty-free license to display, distribute,
          and promote your content within the platform.
        </p>

        <h2 className="text-lg font-bold text-surface-text">4. Prohibited Conduct</h2>
        <p>
          Users may not: post harmful, abusive, or harassing content; impersonate other users; use
          automated systems to access the platform without permission; or violate any applicable laws.
        </p>

        <h2 className="text-lg font-bold text-surface-text">5. Intellectual Property</h2>
        <p>
          All content, design, and branding on UNDRAFTED is the property of UNDRAFTED or its licensors.
          You may not reproduce, distribute, or create derivative works without written permission.
        </p>

        <h2 className="text-lg font-bold text-surface-text">6. Limitation of Liability</h2>
        <p>
          UNDRAFTED is provided &quot;as is&quot; without warranties of any kind. We are not liable for
          any damages arising from your use of the platform.
        </p>

        <h2 className="text-lg font-bold text-surface-text">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use after changes
          constitutes acceptance of the revised terms.
        </p>
      </section>

      <p className="text-xs text-surface-muted italic">
        Note: UNDRAFTED is a demonstration platform. These terms are for illustrative purposes only.
      </p>
    </div>
  );
}
