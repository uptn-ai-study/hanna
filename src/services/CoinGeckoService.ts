export interface AvaxPriceInfo {
  krw: number;
  usd: number;
  lastUpdated: Date;
}

class CoinGeckoService {
  private cache: AvaxPriceInfo | null = null;
  private lastFetchTime: number = 0;
  private CACHE_DURATION_MS = 10000; // 10 seconds cache to respect rate limits

  async getAvaxPrice(): Promise<AvaxPriceInfo> {
    const now = Date.now();
    
    // Return cached value if it is still valid
    if (this.cache && (now - this.lastFetchTime < this.CACHE_DURATION_MS)) {
      return this.cache;
    }

    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=krw,usd'
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API returned status ${response.status}`);
      }

      const data = await response.json();
      const avaxData = data['avalanche-2'];

      if (!avaxData || avaxData.krw === undefined || avaxData.usd === undefined) {
        throw new Error('Invalid response structure from CoinGecko API');
      }

      this.cache = {
        krw: avaxData.krw,
        usd: avaxData.usd,
        lastUpdated: new Date(),
      };
      this.lastFetchTime = now;

      return this.cache;
    } catch (error) {
      console.error('Failed to fetch AVAX price from CoinGecko:', error);
      
      // Fallback to cached data if available even if expired, otherwise rethrow
      if (this.cache) {
        console.warn('Using expired cached AVAX price as fallback');
        return this.cache;
      }
      throw error;
    }
  }
}

export const coinGeckoService = new CoinGeckoService();
