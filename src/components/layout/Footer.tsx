import Link from "next/link";
import FooterAccountLinks from "./FooterAccountLinks";

const YT = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const IG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const FB = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const SOCIAL = [
  { href: "https://youtube.com",   label: "YouTube",   Icon: YT,     color: "hover:text-red-500" },
  { href: "https://x.com",         label: "X",         Icon: XIcon,  color: "hover:text-surface-text" },
  { href: "https://instagram.com", label: "Instagram", Icon: IG,     color: "hover:text-pink-500" },
  { href: "https://facebook.com",  label: "Facebook",  Icon: FB,     color: "hover:text-blue-500" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-200 border-t border-surface-300 mt-16 text-surface-muted text-sm">
      <div className="max-w-[1400px] mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Col 1 — Company */}
        <div>
          <Link href="/" className="inline-block mb-4">
            <span className="text-lg font-black italic tracking-tighter text-surface-text">
              UN<span className="text-brand">DRAFTED</span>
            </span>
          </Link>
          <p className="leading-relaxed text-xs mb-4">
            Your home for live sports coverage, community debate, and breaking news. Mock data — built for demonstration.
          </p>
          <ul className="space-y-1.5">
            {[
              { href: "/about",   label: "About Us" },
              { href: "/careers", label: "Careers" },
              { href: "/contact", label: "Contact" },
              { href: "/sitemap", label: "Sitemap" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-brand transition-colors text-xs">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2 — Legal */}
        <div>
          <h4 className="text-surface-text font-bold mb-4 text-xs uppercase tracking-widest">Legal</h4>
          <ul className="space-y-1.5">
            {[
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms",          label: "Terms of Use" },
              { href: "/disclaimer",     label: "Content Disclaimers" },
              { href: "/privacy-policy", label: "Cookie Settings" },
              { href: "/accessibility",  label: "Accessibility" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-brand transition-colors text-xs">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Account */}
        <div>
          <h4 className="text-surface-text font-bold mb-4 text-xs uppercase tracking-widest">Account</h4>
          <FooterAccountLinks />
        </div>

        {/* Col 4 — Social */}
        <div>
          <h4 className="text-surface-text font-bold mb-4 text-xs uppercase tracking-widest">Follow Us</h4>
          <div className="grid grid-cols-2 gap-3">
            {SOCIAL.map(({ href, label, Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`flex items-center gap-2 text-surface-muted ${color} transition-colors text-xs font-medium`}
              >
                <Icon />
                {label}
              </a>
            ))}
          </div>
          <div className="mt-6 p-3 bg-brand/5 border border-brand/20 rounded-xl">
            <p className="text-[10px] text-surface-muted mb-1 uppercase tracking-widest font-bold">Newsletter</p>
            <p className="text-xs text-surface-text leading-relaxed">Get top stories in your inbox daily.</p>
            <Link href="/#newsletter" className="mt-2 inline-block text-xs font-bold text-brand hover:underline">
              Subscribe →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-300 px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1400px] mx-auto">
        <p className="text-xs text-surface-muted">
          © {year} UNDRAFTED. All data is fictional. Not affiliated with any sports organization.
        </p>
        <div className="flex items-center gap-4 text-xs text-surface-muted">
          <Link href="/privacy-policy" className="hover:text-brand transition-colors">Privacy</Link>
          <Link href="/terms"          className="hover:text-brand transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-brand transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
