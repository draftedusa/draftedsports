export const metadata = {
  title: "Contact — UNDRAFTED",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-black tracking-tighter text-surface-text">Contact Us</h1>

      <section className="space-y-4 text-sm text-surface-muted leading-relaxed">
        <p>
          Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          Reach out through any of the channels below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-5">
            <h3 className="text-sm font-bold text-surface-text mb-2">General Inquiries</h3>
            <p className="text-xs text-surface-muted">hello@undrafted.com</p>
          </div>
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-5">
            <h3 className="text-sm font-bold text-surface-text mb-2">Press & Media</h3>
            <p className="text-xs text-surface-muted">press@undrafted.com</p>
          </div>
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-5">
            <h3 className="text-sm font-bold text-surface-text mb-2">Privacy & Data</h3>
            <p className="text-xs text-surface-muted">privacy@undrafted.com</p>
          </div>
          <div className="bg-surface-200 border border-surface-300 rounded-xl p-5">
            <h3 className="text-sm font-bold text-surface-text mb-2">Accessibility</h3>
            <p className="text-xs text-surface-muted">accessibility@undrafted.com</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-surface-text">Follow Us</h2>
        <p>
          Stay connected on social media for the latest updates, highlights, and community discussions.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-surface-text">YouTube</span>
          <span className="text-xs font-bold text-surface-text">X (Twitter)</span>
          <span className="text-xs font-bold text-surface-text">Instagram</span>
          <span className="text-xs font-bold text-surface-text">Facebook</span>
        </div>
      </section>

      <p className="text-xs text-surface-muted italic">
        Note: UNDRAFTED is a demonstration platform. These contact details are fictional.
      </p>
    </div>
  );
}
