export const metadata = {
  title: "About Us — UNDRAFTED",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-black tracking-tighter text-surface-text">About UNDRAFTED</h1>

      <section className="space-y-4 text-sm text-surface-muted leading-relaxed">
        <p className="text-base text-surface-text font-semibold">
          The sports platform built for fans who want more than scores.
        </p>
        <p>
          UNDRAFTED is an analysis-first, creator-led sports media platform that combines live game
          coverage, community engagement, and deep-dive journalism into one seamless experience.
          We believe the future of sports media is personal, interactive, and built around trust.
        </p>
        <p>
          Our creator franchises — from the Film Room to the Big Board — bring personality and
          expertise to every story. Our Fan Pulse community gives you a voice in the conversation.
          And our UNDRAFTED+ subscription unlocks the premium analysis that sets us apart.
        </p>

        <h2 className="text-lg font-bold text-surface-text">Our Mission</h2>
        <p>
          To be the daily sports habit for fans who demand substance over spectacle. We cover the
          NFL, NBA, MLB, and NHL with the depth of a newsroom and the passion of a fan forum.
        </p>

        <h2 className="text-lg font-bold text-surface-text">The Team</h2>
        <p>
          UNDRAFTED is built by a team of sports journalists, product engineers, and community
          builders who believe sports media can be smarter, more inclusive, and more engaging.
        </p>
      </section>

      <p className="text-xs text-surface-muted italic">
        Note: UNDRAFTED is a demonstration platform built for portfolio and educational purposes.
        All data is fictional.
      </p>
    </div>
  );
}
