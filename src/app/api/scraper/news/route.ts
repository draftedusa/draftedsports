import { scrapeNews } from "@/lib/scraper";

// ISR: revalidate every 2 minutes
export const revalidate = 120;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get("league") ?? undefined;
  const data = await scrapeNews(league);
  return Response.json({ data, updatedAt: new Date().toISOString() });
}
