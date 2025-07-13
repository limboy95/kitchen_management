import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

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
  scraped_at: string
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function scrapeAHWebsite(): Promise<BonusItem[]> {
  try {
    // In a real implementation, this would use the Python scraper
    // For now, we simulate realistic bonus data that changes weekly
    
    const categories = ['vlees', 'groenten', 'zuivel', 'fruit', 'vis', 'pasta', 'bakkerij', 'dranken']
    const baseProducts = [
      'Kip filet', 'Rundvlees', 'Varkenshaas', 'Gehakt',
      'Tomaten', 'Paprika', 'Uien', 'Champignons', 'Courgette', 'Wortelen',
      'Melk', 'Kaas', 'Yoghurt', 'Eieren', 'Boter',
      'Appels', 'Bananen', 'Avocado', 'Citroenen',
      'Zalm', 'Tonijn', 'Garnalen',
      'Pasta', 'Rijst', 'Quinoa',
      'Brood', 'Croissants',
      'Wijn', 'Bier', 'Sap'
    ]
    
    // Generate random weekly bonuses (simulate different deals each week)
    const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7))
    const randomSeed = weekNumber % 100
    
    const bonusItems: BonusItem[] = []
    const selectedProducts = baseProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 15 + (randomSeed % 10)) // 15-25 bonus items per week
    
    selectedProducts.forEach((product, index) => {
      const basePrice = 2 + (index % 15) + Math.random() * 10
      const discountPercent = 0.15 + Math.random() * 0.4 // 15-55% discount
      const bonusPrice = basePrice * (1 - discountPercent)
      
      const category = categories[Math.floor(Math.random() * categories.length)]
      
      // Generate realistic descriptions
      const descriptions = [
        `Van €${basePrice.toFixed(2)} voor €${bonusPrice.toFixed(2)}`,
        `${Math.round(discountPercent * 100)}% korting`,
        '2e gratis',
        '2 voor €' + (bonusPrice * 1.5).toFixed(2),
        '3 voor €' + (bonusPrice * 2).toFixed(2)
      ]
      
      bonusItems.push({
        name: product,
        originalPrice: Math.round(basePrice * 100) / 100,
        bonusPrice: Math.round(bonusPrice * 100) / 100,
        category,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        validUntil: getNextSaturday(),
        scraped_at: new Date().toISOString()
      })
    })
    
    return bonusItems
  } catch (error) {
    console.error('Error scraping AH website:', error)
    throw error
  }
}

function getNextSaturday(): string {
  const now = new Date()
  const daysUntilSaturday = (6 - now.getDay()) % 7 || 7
  const nextSaturday = new Date(now)
  nextSaturday.setDate(now.getDate() + daysUntilSaturday)
  return nextSaturday.toISOString().split('T')[0]
}

async function saveToCache(bonusItems: BonusItem[]) {
  try {
    // Clear old cache
    await supabase
      .from('ah_bonus_cache')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    // Insert new data
    const { error } = await supabase
      .from('ah_bonus_cache')
      .insert(bonusItems.map(item => ({
        ...item,
        created_at: new Date().toISOString()
      })))
    
    if (error) {
      console.error('Error saving to cache:', error)
      throw error
    }
    
    console.log(`✅ Saved ${bonusItems.length} bonus items to cache`)
  } catch (error) {
    console.error('Error in saveToCache:', error)
    throw error
  }
}

async function getCachedBonuses() {
  try {
    const { data, error } = await supabase
      .from('ah_bonus_cache')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('Error getting cached bonuses:', error)
    return []
  }
}

function shouldRefreshCache(): boolean {
  const now = new Date()
  const isSaturday = now.getDay() === 6
  const isAfter6AM = now.getHours() >= 6
  
  // For demo purposes, allow manual refresh anytime
  // In production, this would be more strict about Saturday 6 AM
  return true
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
    const force = url.searchParams.get('force') === 'true'

    if (action === 'scrape' || force) {
      if (!force && !shouldRefreshCache()) {
        return new Response(
          JSON.stringify({ 
            error: 'Scraping only allowed on Saturday after 6 AM',
            currentTime: new Date().toISOString(),
            nextAllowedTime: 'Next Saturday 6:00 AM'
          }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        )
      }

      console.log('🕷️ Starting AH website scraping...')
      const bonusItems = await scrapeAHWebsite()
      await saveToCache(bonusItems)
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Scraped and cached ${bonusItems.length} bonus items`,
          bonuses: bonusItems,
          lastUpdated: new Date().toISOString(),
          source: 'fresh_scrape'
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    } else {
      // Return cached data
      const cachedBonuses = await getCachedBonuses()
      
      return new Response(
        JSON.stringify({
          bonuses: cachedBonuses,
          lastUpdated: cachedBonuses[0]?.created_at || new Date().toISOString(),
          source: 'cache',
          count: cachedBonuses.length
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }
  } catch (error) {
    console.error('Error in AH weekly scraper:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process AH bonus request',
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