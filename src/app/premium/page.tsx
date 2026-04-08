import Link from "next/link";

export const metadata = {
  title: "UNDRAFTED+ — Premium Sports Intelligence",
  description: "Unlock unlimited analysis, film rooms, live data, and exclusive creator content.",
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    cta: "Current Plan",
    ctaHref: "/",
    ctaVariant: "ghost" as const,
    features: [
      "3 articles per session",
      "Live scores & standings",
      "Fan Pulse community",
      "Basic stats",
    ],
    missing: ["Film Room access", "Advanced metrics", "Draft boards", "Ad-free experience"],
  },
  {
    name: "UNDRAFTED+",
    price: "$6.99",
    period: "per month",
    cta: "Start Free Trial",
    ctaHref: "/auth/onboarding",
    ctaVariant: "brand" as const,
    badge: "Most Popular",
    features: [
      "Unlimited articles",
      "Full Film Room access",
      "Advanced metrics & EPA",
      "Creator franchise deep dives",
      "Draft boards & Big Board",
      "Ad-free reading",
      "Breaking news alerts",
    ],
    missing: [],
  },
  {
    name: "Annual",
    price: "$59.99",
    period: "per year",
    subtext: "Save 28%",
    cta: "Go Annual",
    ctaHref: "/auth/onboarding",
    ctaVariant: "brand" as const,
    features: [
      "Everything in UNDRAFTED+",
      "Priority access to new features",
      "Exclusive AMA sessions",
      "Member-only Discord",
    ],
    missing: [],
  },
];

const CREATORS = [
  { name: "Marcus Webb", show: "Film Room",     avatar: "M", desc: "Play-by-play breakdowns, scheme analysis, and film study." },
  { name: "Priya Nair",  show: "Big Board",     avatar: "P", desc: "Draft rankings, prospect scouting, and G-League reports." },
  { name: "Dana Howell", show: "Dynasty Watch", avatar: "D", desc: "Long-term roster management and championship windows." },
  { name: "Jamal Carter", show: "Inside Track", avatar: "J", desc: "League-wide intelligence, locker room intel, and rumors." },
];

export default function PremiumPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase text-brand">UNDRAFTED+</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-surface-text leading-none">
          Sports intelligence,<br />
          <span className="text-brand">no limits.</span>
        </h1>
        <p className="text-surface-muted max-w-lg mx-auto text-sm leading-relaxed">
          Join thousands of fans who get deeper analysis, faster alerts, and exclusive creator content every day.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              plan.ctaVariant === "brand"
                ? "bg-brand/5 border-brand/30"
                : "bg-surface-200 border-surface-300"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {plan.badge}
              </div>
            )}
            <div className="mb-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-surface-text mb-2">{plan.name}</h2>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black text-surface-text">{plan.price}</span>
                <span className="text-xs text-surface-muted mb-1">/{plan.period}</span>
              </div>
              {plan.subtext && <p className="text-xs font-bold text-emerald-400 mt-0.5">{plan.subtext}</p>}
            </div>

            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-surface-text">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  {f}
                </li>
              ))}
              {plan.missing.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-surface-muted line-through">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-surface-muted/40 shrink-0 mt-0.5">
                    <path d="M19 13H5v-2h14v2z"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaHref}
              className={`block text-center px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                plan.ctaVariant === "brand"
                  ? "bg-brand hover:bg-brand/90 text-white"
                  : "bg-surface-300 hover:bg-surface-200 border border-surface-300 text-surface-muted"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Creator Franchises */}
      <section>
        <h2 className="text-2xl font-black tracking-tighter text-surface-text mb-2 text-center">Creator Franchises</h2>
        <p className="text-surface-muted text-sm text-center mb-8">Exclusive shows you can&apos;t find anywhere else.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CREATORS.map((c) => (
            <div key={c.name} className="flex items-start gap-4 p-4 bg-surface-200 border border-surface-300 rounded-xl hover:border-brand/40 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-xl font-black text-brand shrink-0">
                {c.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-surface-text">{c.name}</p>
                <p className="text-xs text-brand font-semibold mb-1">{c.show}</p>
                <p className="text-xs text-surface-muted leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-xl font-black tracking-tighter text-surface-text mb-6 text-center">Common Questions</h2>
        <div className="space-y-3">
          {[
            { q: "Can I cancel anytime?", a: "Yes. Cancel with one click, no questions asked. You keep access until the end of your billing period." },
            { q: "Is there a free trial?", a: "Yes — 7 days free. No credit card required for the trial." },
            { q: "What counts as an article view?", a: "Each unique article you open counts once per 24-hour window on the free plan." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-surface-200 border border-surface-300 rounded-xl p-4">
              <p className="text-sm font-bold text-surface-text mb-1">{q}</p>
              <p className="text-xs text-surface-muted leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
