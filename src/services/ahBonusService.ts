interface BonusItem {
  name: string;
  originalPrice: number;
  bonusPrice: number;
  category: string;
  validUntil?: string;
  description?: string;
}

interface BonusResponse {
  bonuses: BonusItem[];
  lastUpdated: string;
  source: 'cache' | 'fresh_scrape' | 'force_refresh';
}

class AHBonusService {
  private baseUrl: string;
  private cache: BonusItem[] | null = null;
  private lastCacheUpdate: Date | null = null;
  private cacheValidityHours = 24; // Cache is valid for 24 hours

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ah-weekly-scraper`;
  }

  private async makeRequest(action: 'get' | 'refresh' = 'get'): Promise<BonusResponse> {
    const headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    const url = `${this.baseUrl}?action=${action}`;
    
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update local cache
      this.cache = data.bonuses;
      this.lastCacheUpdate = new Date();
      
      return data;
    } catch (error) {
      console.error('Error fetching AH bonuses:', error);
      
      // Return cached data if available
      if (this.cache) {
        console.log('Returning cached AH bonus data due to error');
        return {
          bonuses: this.cache,
          lastUpdated: this.lastCacheUpdate?.toISOString() || '',
          source: 'cache'
        };
      }
      
      throw error;
    }
  }

  private isCacheValid(): boolean {
    if (!this.cache || !this.lastCacheUpdate) {
      return false;
    }
    
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - this.lastCacheUpdate.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceUpdate < this.cacheValidityHours;
  }

  async getBonuses(forceRefresh = false): Promise<BonusResponse> {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.isCacheValid() && this.cache) {
      return {
        bonuses: this.cache,
        lastUpdated: this.lastCacheUpdate!.toISOString(),
        source: 'cache'
      };
    }

    // Fetch fresh data
    const action = forceRefresh ? 'refresh' : 'get';
    return await this.makeRequest(action);
  }

  async refreshBonuses(): Promise<BonusResponse> {
    // Force a fresh scrape
    return await this.makeRequest('scrape');
  }

  findBonusForIngredient(ingredientName: string): BonusItem | null {
    if (!this.cache) {
      return null;
    }

    const ingredient = ingredientName.toLowerCase();
    
    return this.cache.find(bonus => {
      const bonusName = bonus.name.toLowerCase();
      return bonusName.includes(ingredient) || ingredient.includes(bonusName);
    }) || null;
  }

  calculateSavingsForIngredients(ingredients: string[]): {
    totalSavings: number;
    bonusItems: Array<BonusItem & { savings: number }>;
  } {
    if (!this.cache) {
      return { totalSavings: 0, bonusItems: [] };
    }

    const bonusItems: Array<BonusItem & { savings: number }> = [];
    let totalSavings = 0;

    ingredients.forEach(ingredient => {
      const bonus = this.findBonusForIngredient(ingredient);
      if (bonus) {
        const savings = bonus.originalPrice - bonus.bonusPrice;
        bonusItems.push({ ...bonus, savings });
        totalSavings += savings;
      }
    });

    return { totalSavings, bonusItems };
  }

  getLastUpdateTime(): Date | null {
    return this.lastCacheUpdate;
  }

  getCacheStatus(): {
    hasCache: boolean;
    isValid: boolean;
    lastUpdate: Date | null;
    itemCount: number;
  } {
    return {
      hasCache: !!this.cache,
      isValid: this.isCacheValid(),
      lastUpdate: this.lastCacheUpdate,
      itemCount: this.cache?.length || 0
    };
  }
}

// Export singleton instance
export const ahBonusService = new AHBonusService();