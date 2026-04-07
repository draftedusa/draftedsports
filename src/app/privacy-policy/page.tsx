export const metadata = {
  title: "Privacy Policy — UNDRAFTED",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-black tracking-tighter text-surface-text">Privacy Policy</h1>
      <p className="text-xs text-surface-muted">Last updated: April 7, 2026</p>

      <section className="space-y-4 text-sm text-surface-muted leading-relaxed">
        <h2 className="text-lg font-bold text-surface-text">1. Information We Collect</h2>
        <p>
          UNDRAFTED collects information you provide directly, such as when you create an account,
          subscribe to newsletters, or participate in Fan Pulse. This includes your name, email address,
          username, and any content you post.
        </p>
        <p>
          We also collect usage data automatically, including pages viewed, time spent on the platform,
          device information, IP address, and browser type. This data helps us improve the user experience.
        </p>

        <h2 className="text-lg font-bold text-surface-text">2. How We Use Your Information</h2>
        <p>
          We use collected information to operate and improve the platform, personalize your experience,
          send relevant notifications, and provide customer support. We may also use aggregated,
          anonymized data for analytics and reporting purposes.
        </p>

        <h2 className="text-lg font-bold text-surface-text">3. Sharing of Information</h2>
        <p>
          We do not sell your personal information to third parties. We may share information with
          service providers who assist in operating the platform, when required by law, or to protect
          the rights and safety of UNDRAFTED and its users.
        </p>

        <h2 className="text-lg font-bold text-surface-text">4. Cookies & Tracking</h2>
        <p>
          UNDRAFTED uses cookies and similar technologies to maintain session state, remember preferences,
          and analyze platform usage. You can manage cookie preferences through your browser settings.
        </p>

        <h2 className="text-lg font-bold text-surface-text">5. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is active or as needed to
          provide services. You may request deletion of your account and associated data at any time
          by contacting us.
        </p>

        <h2 className="text-lg font-bold text-surface-text">6. Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have rights to access, correct, delete, or port your
          personal data. To exercise these rights, please contact privacy@undrafted.com.
        </p>

        <h2 className="text-lg font-bold text-surface-text">7. Contact</h2>
        <p>
          For privacy-related inquiries, contact us at privacy@undrafted.com or through our Contact page.
        </p>
      </section>

      <p className="text-xs text-surface-muted italic">
        Note: UNDRAFTED is a demonstration platform. All data is fictional. This policy is for
        illustrative purposes only.
      </p>
    </div>
  );
}
