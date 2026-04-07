export const metadata = {
  title: "Content Disclaimers — UNDRAFTED",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-black tracking-tighter text-surface-text">Content Disclaimers</h1>
      <p className="text-xs text-surface-muted">Last updated: April 7, 2026</p>

      <section className="space-y-4 text-sm text-surface-muted leading-relaxed">
        <h2 className="text-lg font-bold text-surface-text">Mock Data Disclaimer</h2>
        <p>
          UNDRAFTED is a demonstration sports media platform. All scores, standings, player statistics,
          transactions, articles, and user-generated content displayed on this platform are entirely
          fictional and created for demonstration purposes only.
        </p>

        <h2 className="text-lg font-bold text-surface-text">No Affiliation</h2>
        <p>
          UNDRAFTED is not affiliated with, endorsed by, or connected to the NFL, NBA, MLB, NHL,
          or any professional sports team, league, or organization. Any resemblance to real events,
          persons, or organizations is for demonstrative context only.
        </p>

        <h2 className="text-lg font-bold text-surface-text">Not Financial Advice</h2>
        <p>
          Any odds, betting lines, or gambling-related content shown on the platform is entirely
          fictional. UNDRAFTED does not provide financial, gambling, or betting advice. Do not make
          real financial decisions based on any data displayed on this platform.
        </p>

        <h2 className="text-lg font-bold text-surface-text">Editorial Content</h2>
        <p>
          All articles, analysis, and opinion pieces are fictional works created for the purpose of
          demonstrating a sports media platform. The views expressed do not represent those of any
          real individual or organization.
        </p>
      </section>

      <p className="text-xs text-surface-muted italic">
        Note: This platform is built for portfolio demonstration and educational purposes.
      </p>
    </div>
  );
}
