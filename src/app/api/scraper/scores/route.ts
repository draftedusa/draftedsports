import { scrapeScores } from "@/lib/scraper";

// ISR: revalidate every 30 seconds for live scores
export const revalidate = 30;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get("league") ?? undefined;
  const data = await scrapeScores(league);
  return Response.json({ data, updatedAt: new Date().toISOString() });
}
