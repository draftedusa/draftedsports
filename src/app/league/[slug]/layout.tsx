import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { leagues } from "@/data/leagues";
import { BetSlipProvider } from "@/components/betting/BetSlipContext";
import LeagueTabs from "@/components/betting/LeagueTabs";

interface Props {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function LeagueLayout({ children, params }: Props) {
  const { slug } = await params;
  const league = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  return (
    <BetSlipProvider>
      <LeagueTabs slug={slug} leagueName={league.name} />
      {children}
    </BetSlipProvider>
  );
}
