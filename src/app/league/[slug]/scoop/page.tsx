import TheScoop from "@/components/editorial/TheScoop";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LeagueScoopPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="container mx-auto pt-24">
      <TheScoop leagueFilter={slug.toUpperCase()} />
    </main>
  );
}
