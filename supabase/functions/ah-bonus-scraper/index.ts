import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface BonusItem {
  name: string
  originalPrice: number
  bonusPrice: number
  category: string
  validUntil?: string
  description?: string
}

// Simulated scraping function (in real implementation, this would scrape AH website)
async function scrapeAHBonus(): Promise<BonusItem[]> {
  // In a real implementation, this would use the Python scraper logic
  // For now, we'll simulate with realistic data
  
  const mockBonusItems: BonusItem[] = [
    { name: "Kip filet", originalPrice: 8.99, bonusPrice: 6.99, category: "vlees", description: "2 voor €6.99" },
    { name: "Pasta penne", originalPrice: 1.49, bonusPrice: 0.99, category: "pasta", description: "Van €1.49 voor €0.99" },
    { name: "Tomaten cherry", originalPrice: 2.99, bonusPrice: 1.99, category: "groenten", description: "33% korting" },
    { name: "Mozzarella", originalPrice: 3.49, bonusPrice: 2.49, category: "zuivel", description: "€1 korting" },
    { name: "Olijfolie extra virgin", originalPrice: 4.99, bonusPrice: 3.99, category: "olie", description: "20% korting" },
    { name: "Paprika rood", originalPrice: 2.49, bonusPrice: 1.49, category: "groenten", description: "2e gratis" },
    { name: "Uien", originalPrice: 1.99, bonusPrice: 1.29, category: "groenten", description: "Van €1.99 voor €1.29" },
    { name: "Champignons", originalPrice: 2.29, bonusPrice: 1.59, category: "groenten", description: "30% korting" },
    { name: "Oude kaas", originalPrice: 4.99, bonusPrice: 3.49, category: "zuivel", description: "€1.50 korting" },
    { name: "Volkoren brood", originalPrice: 1.89, bonusPrice: 1.29, category: "bakkerij", description: "Van €1.89 voor €1.29" },
    { name: "Eieren vrije uitloop", originalPrice: 2.99, bonusPrice: 2.19, category: "zuivel", description: "€0.80 korting" },
    { name: "Melk halfvol", originalPrice: 1.49, bonusPrice: 0.99, category: "zuivel", description: "2 voor €1.99" },
    { name: "Griekse yoghurt", originalPrice: 2.49, bonusPrice: 1.79, category: "zuivel", description: "Van €2.49 voor €1.79" },
    { name: "Quinoa", originalPrice: 3.99, bonusPrice: 2.99, category: "granen", description: "25% korting" },
    { name: "Avocado", originalPrice: 1.99, bonusPrice: 1.49, category: "fruit", description: "3 voor €4" },
    { name: "Zalm filet", originalPrice: 12.99, bonusPrice: 9.99, category: "vis", description: "€3 korting" },
    { name: "Rundvlees", originalPrice: 15.99, bonusPrice: 11.99, category: "vlees", description: "25% korting" },
    { name: "Rode wijn", originalPrice: 8.99, bonusPrice: 5.99, category: "dranken", description: "33% korting" },
    { name: "Basilicum vers", originalPrice: 1.99, bonusPrice: 1.29, category: "kruiden", description: "Van €1.99 voor €1.29" },
    { name: "Courgette", originalPrice: 2.19, bonusPrice: 1.49, category: "groenten", description: "€0.70 korting" }
  ]

  // Add random valid until dates (next week)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  
  return mockBonusItems.map(item => ({
    ...item,
    validUntil: nextWeek.toISOString().split('T')[0]
  }))
}

async function getCachedBonuses() {
  try {
    // In a real implementation, this would read from a database or file storage
    // For now, we'll simulate cache logic
    const cacheKey = 'ah_bonus_cache'
    const lastUpdate = 'ah_bonus_last_update'
    
    // Check if we need to refresh (simulate weekly refresh on Saturday 6 AM)
    const now = new Date()
    const isWeekend = now.getDay() === 6 // Saturday
    const isAfter6AM = now.getHours() >= 6
    
    // For demo purposes, always return fresh data
    console.log('🔄 Fetching fresh AH bonus data...')
    const bonuses = await scrapeAHBonus()
    
    return {
      bonuses,
      lastUpdated: now.toISOString(),
      source: 'fresh_scrape'
    }
  } catch (error) {
    console.error('Error fetching bonuses:', error)
    throw error
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'get'

    if (action === 'get') {
      const result = await getCachedBonuses()
      
      return new Response(
        JSON.stringify(result),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    } else if (action === 'refresh') {
      // Force refresh bonuses
      console.log('🔄 Force refreshing AH bonuses...')
      const bonuses = await scrapeAHBonus()
      
      return new Response(
        JSON.stringify({
          bonuses,
          lastUpdated: new Date().toISOString(),
          source: 'force_refresh'
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('Error in AH bonus scraper:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch AH bonuses',
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})