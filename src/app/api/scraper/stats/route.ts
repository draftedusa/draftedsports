import { scrapeLeagueLeaders } from "@/lib/scraper";

// ISR: revalidate every 5 minutes
export const revalidate = 300;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get("league");

  if (!league) {
    return Response.json(
      { error: "Missing required 'league' query parameter" },
      { status: 400 }
    );
  }

  const data = await scrapeLeagueLeaders(league);
  return Response.json({ data, updatedAt: new Date().toISOString() });
}
