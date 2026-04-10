interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class ScraperBase {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  /**
   * Fetch a URL with exponential backoff retries.
   * Returns the Response on success, or null after all retries are exhausted.
   */
  async fetchWithRetry(
    url: string,
    retries: number = 3
  ): Promise<Response | null> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "UNDRAFTED-Scraper/1.0",
            Accept: "text/html,application/json",
          },
        });

        if (response.ok) {
          return response;
        }

        // Don't retry on 4xx client errors (except 429 rate limit)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          console.warn(
            `[ScraperBase] Non-retryable status ${response.status} for ${url}`
          );
          return null;
        }
      } catch (error) {
        console.warn(
          `[ScraperBase] Fetch attempt ${attempt + 1}/${retries + 1} failed for ${url}:`,
          error instanceof Error ? error.message : error
        );
      }

      // Exponential backoff: 1s, 2s, 4s...
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    console.error(`[ScraperBase] All ${retries + 1} attempts failed for ${url}`);
    return null;
  }

  /**
   * Stub HTML parser. In production, this would use Cheerio or a similar
   * library to parse HTML into a traversable DOM structure.
   * For now, returns the raw HTML string.
   */
  parseHtml(html: string): string {
    return html;
  }

  /**
   * Generate a cache key from a source identifier and league.
   */
  getCacheKey(source: string, league: string): string {
    return `${source}:${league}`.toLowerCase();
  }

  /**
   * Retrieve a value from the in-memory cache if it exists and hasn't expired.
   */
  getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Store a value in the in-memory cache with a TTL in milliseconds.
   */
  setInCache<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Clear all entries from the cache.
   */
  clearCache(): void {
    this.cache.clear();
  }
}
