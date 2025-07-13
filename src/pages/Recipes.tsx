import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { 
  Search, 
  Clock, 
  Users, 
  ChefHat, 
  Star, 
  Filter,
  Sparkles,
  Euro,
  TrendingDown,
  ShoppingCart,
  Zap,
  RefreshCw,
  Calendar,
  Database
} from 'lucide-react';
import { Recipe, FridgeItem } from '../types';
import { ahBonusService } from '../services/ahBonusService';

interface RecipeWithSavings extends Recipe {
  matchScore?: number;
  matchingIngredients?: string[];
  missingIngredients?: string[];
  totalSavings?: number;
  bonusItems?: Array<{
    name: string;
    originalPrice: number;
    bonusPrice: number;
    savings: number;
  }>;
}

export const Recipes: React.FC = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<RecipeWithSavings[]>([]);
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [showPersonalized, setShowPersonalized] = useState(false);
  const [showBonusOnly, setShowBonusOnly] = useState(false);
  const [loadingBonuses, setLoadingBonuses] = useState(false);
  const [bonusStatus, setBonusStatus] = useState<{
    lastUpdate: Date | null;
    itemCount: number;
    source: string;
  }>({ lastUpdate: null, itemCount: 0, source: 'none' });

  // Mock Albert Heijn bonus data
  const ahBonusItems = [
    { name: 'Kip', originalPrice: 8.99, bonusPrice: 6.99, category: 'vlees' },
    { name: 'Pasta', originalPrice: 1.49, bonusPrice: 0.99, category: 'pasta' },
    { name: 'Tomaten', originalPrice: 2.99, bonusPrice: 1.99, category: 'groenten' },
    { name: 'Mozzarella', originalPrice: 3.49, bonusPrice: 2.49, category: 'zuivel' },
    { name: 'Olijfolie', originalPrice: 4.99, bonusPrice: 3.99, category: 'olie' },
    { name: 'Paprika', originalPrice: 2.49, bonusPrice: 1.49, category: 'groenten' },
    { name: 'Uien', originalPrice: 1.99, bonusPrice: 1.29, category: 'groenten' },
    { name: 'Champignons', originalPrice: 2.29, bonusPrice: 1.59, category: 'groenten' },
    { name: 'Kaas', originalPrice: 4.99, bonusPrice: 3.49, category: 'zuivel' },
    { name: 'Brood', originalPrice: 1.89, bonusPrice: 1.29, category: 'bakkerij' },
    { name: 'Eieren', originalPrice: 2.99, bonusPrice: 2.19, category: 'zuivel' },
    { name: 'Melk', originalPrice: 1.49, bonusPrice: 0.99, category: 'zuivel' },
    { name: 'Yoghurt', originalPrice: 2.49, bonusPrice: 1.79, category: 'zuivel' },
    { name: 'Quinoa', originalPrice: 3.99, bonusPrice: 2.99, category: 'granen' },
    { name: 'Avocado', originalPrice: 1.99, bonusPrice: 1.49, category: 'fruit' },
    { name: 'Zalm', originalPrice: 12.99, bonusPrice: 9.99, category: 'vis' },
    { name: 'Rundvlees', originalPrice: 15.99, bonusPrice: 11.99, category: 'vlees' },
    { name: 'Rode wijn', originalPrice: 8.99, bonusPrice: 5.99, category: 'dranken' }
  ];

  const mockRecipes: RecipeWithSavings[] = [
    {
      id: '1',
      title: 'Mediterrane Pasta Salade',
      description: 'Frisse pasta salade met tomaten, olijven en fetakaas',
      ingredients: ['Pasta', 'Tomaten', 'Olijven', 'Fetakaas', 'Komkommer', 'Olijfolie'],
      instructions: [
        'Kook de pasta volgens de verpakking',
        'Snijd de tomaten en komkommer in stukjes',
        'Meng alle ingrediënten in een grote kom',
        'Voeg olijfolie en kruiden toe naar smaak'
      ],
      prep_time: 20,
      cook_time: 15,
      servings: 4,
      difficulty: 'makkelijk',
      image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Vegetarisch', 'Mediterraan', 'Gezond']
    },
    {
      id: '2',
      title: 'Aziatische Groene Curry',
      description: 'Pittige groene curry met kip en verse groenten',
      ingredients: ['Kip', 'Groene curry pasta', 'Kokosmelk', 'Paprika', 'Aubergine', 'Basilicum'],
      instructions: [
        'Snijd de kip en groenten in stukjes',
        'Bak de curry pasta kort aan',
        'Voeg kokosmelk toe en laat sudderen',
        'Voeg kip en groenten toe tot gaar'
      ],
      prep_time: 15,
      cook_time: 25,
      servings: 3,
      difficulty: 'gemiddeld',
      image_url: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Aziatisch', 'Pittig', 'Glutenvrij']
    },
    {
      id: '3',
      title: 'Caesar Salade met Kip',
      description: 'Klassieke Caesar salade met gegrilde kip',
      ingredients: ['Romeinse sla', 'Kip', 'Parmezaan', 'Brood', 'Caesar dressing', 'Ansjovis'],
      instructions: [
        'Grill de kip tot gaar',
        'Maak croutons van het brood',
        'Meng de sla met dressing',
        'Garneer met kip, parmezaan en croutons'
      ],
      prep_time: 10,
      cook_time: 15,
      servings: 2,
      difficulty: 'makkelijk',
      image_url: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Salade', 'Proteïne', 'Lunch']
    },
    {
      id: '4',
      title: 'Zelfgemaakte Pizza Margherita',
      description: 'Klassieke Italiaanse pizza met tomaat, mozzarella en basilicum',
      ingredients: ['Pizzadeeg', 'Tomatensaus', 'Mozzarella', 'Basilicum', 'Olijfolie', 'Zout'],
      instructions: [
        'Rol het pizzadeeg uit',
        'Besmeer met tomatensaus',
        'Verdeel mozzarella over de pizza',
        'Bak in voorverwarmde oven op 250°C',
        'Garneer met verse basilicum'
      ],
      prep_time: 30,
      cook_time: 12,
      servings: 2,
      difficulty: 'gemiddeld',
      image_url: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Italiaans', 'Vegetarisch', 'Comfort food']
    },
    {
      id: '5',
      title: 'Quinoa Bowl met Avocado',
      description: 'Gezonde quinoa bowl met verse groenten en avocado',
      ingredients: ['Quinoa', 'Avocado', 'Wortelen', 'Komkommer', 'Radijs', 'Limoen', 'Olijfolie'],
      instructions: [
        'Kook quinoa volgens verpakking',
        'Snijd alle groenten in stukjes',
        'Maak een dressing van limoen en olijfolie',
        'Verdeel alles in een kom en garneer'
      ],
      prep_time: 25,
      cook_time: 15,
      servings: 1,
      difficulty: 'makkelijk',
      image_url: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Veganistisch', 'Gezond', 'Glutenvrij']
    },
    {
      id: '6',
      title: 'Beef Bourguignon',
      description: 'Klassiek Frans gerecht met rundvlees in rode wijn',
      ingredients: ['Rundvlees', 'Rode wijn', 'Champignons', 'Wortelen', 'Uien', 'Tijm', 'Laurier'],
      instructions: [
        'Braad het rundvlees rondom bruin',
        'Voeg groenten toe en fruit aan',
        'Blus af met rode wijn',
        'Voeg kruiden toe en stoof 2 uur zachtjes',
        'Serveer met aardappelpuree'
      ],
      prep_time: 45,
      cook_time: 120,
      servings: 6,
      difficulty: 'moeilijk',
      image_url: 'https://images.pexels.com/photos/4113717/pexels-photo-4113717.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Frans', 'Vlees', 'Feestelijk']
    },
    {
      id: '7',
      title: 'Kip Paprika Stoofpot',
      description: 'Hartige stoofpot met kip, paprika en champignons',
      ingredients: ['Kip', 'Paprika', 'Champignons', 'Uien', 'Tomaten', 'Bouillon'],
      instructions: [
        'Braad de kip rondom bruin',
        'Voeg groenten toe en fruit aan',
        'Voeg bouillon toe en laat sudderen',
        'Serveer met rijst of aardappelen'
      ],
      prep_time: 20,
      cook_time: 40,
      servings: 4,
      difficulty: 'makkelijk',
      image_url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Comfort food', 'Gezinsvriendelijk', 'Eenpansgerecht']
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch fridge items
        const { data: fridgeData } = await supabase
          .from('fridge_items')
          .select('*')
          .eq('user_id', user.id);

        setFridgeItems(fridgeData || []);
        
        // Fetch AH bonuses
        const bonusResponse = await ahBonusService.getBonuses();
        setBonusStatus({
          lastUpdate: new Date(bonusResponse.lastUpdated),
          itemCount: bonusResponse.bonuses.length,
          source: bonusResponse.source
        });
        
        // Calculate recipe matches and savings with real bonus data
        const recipesWithAnalysis = calculateRecipeAnalysis(mockRecipes, fridgeData || [], bonusResponse.bonuses);
        setRecipes(recipesWithAnalysis);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if AH service fails
        const recipesWithAnalysis = calculateRecipeAnalysis(mockRecipes, fridgeData || []);
        setRecipes(recipesWithAnalysis);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const calculateRecipeAnalysis = (recipes: Recipe[], fridgeItems: FridgeItem[], bonusItems?: any[]): RecipeWithSavings[] => {
    const availableIngredients = fridgeItems.map(item => item.name.toLowerCase());
    
    return recipes.map(recipe => {
      // Calculate ingredient matches
      const matchingIngredients = recipe.ingredients.filter(ingredient =>
        availableIngredients.some(available => 
          available.includes(ingredient.toLowerCase()) || 
          ingredient.toLowerCase().includes(available)
        )
      );

      const missingIngredients = recipe.ingredients.filter(ingredient =>
        !matchingIngredients.includes(ingredient)
      );

      // Calculate Albert Heijn bonus savings using real data
      const recipeBonusItems = missingIngredients
        .map(ingredient => {
          // Use real bonus data if available, otherwise fall back to mock data
          const bonusData = bonusItems || ahBonusItems;
          const bonusItem = bonusData.find((bonus: any) => 
            bonus.name.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(bonus.name.toLowerCase())
          );
          
          if (bonusItem) {
            return {
              name: bonusItem.name,
              originalPrice: bonusItem.originalPrice,
              bonusPrice: bonusItem.bonusPrice,
              savings: bonusItem.originalPrice - bonusItem.bonusPrice,
              description: bonusItem.description || `Van €${bonusItem.originalPrice} voor €${bonusItem.bonusPrice}`,
              validUntil: bonusItem.validUntil
            };
          }
          return null;
        })
        .filter(Boolean) as Array<{
          name: string;
          originalPrice: number;
          bonusPrice: number;
          savings: number;
        }>;

      const totalSavings = recipeBonusItems.reduce((sum, item) => sum + item.savings, 0);

      return {
        ...recipe,
        matchScore: matchingIngredients.length,
        matchingIngredients,
        missingIngredients,
        bonusItems: recipeBonusItems,
        totalSavings
      };
    });
  };

  const getPersonalizedRecipes = () => {
    let filteredRecipes = recipes;

    if (showPersonalized) {
      filteredRecipes = recipes
        .filter(recipe => recipe.matchScore && recipe.matchScore > 0)
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    if (showBonusOnly) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.bonusItems && recipe.bonusItems.length > 0
      );
    }

    return filteredRecipes;
  };

  const filteredRecipes = getPersonalizedRecipes().filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === '' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const refreshBonuses = async () => {
    setLoadingBonuses(true);
    
    try {
      // Use real AH bonus service to refresh data
      const bonusResponse = await ahBonusService.refreshBonuses();
      setBonusStatus({
        lastUpdate: new Date(bonusResponse.lastUpdated),
        itemCount: bonusResponse.bonuses.length,
        source: bonusResponse.source
      });
    
      // Recalculate with updated bonus data
      const recipesWithAnalysis = calculateRecipeAnalysis(mockRecipes, fridgeItems, bonusResponse.bonuses);
      setRecipes(recipesWithAnalysis);
    } catch (error) {
      console.error('Error refreshing bonuses:', error);
    } finally {
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recepten</h1>
            <p className="mt-2 text-gray-600">
              Ontdek heerlijke recepten voor elke gelegenheid
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshBonuses}
              disabled={loadingBonuses}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                loadingBonuses
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <RefreshCw className={`h-5 w-5 ${loadingBonuses ? 'animate-spin' : ''}`} />
              <span>{loadingBonuses ? 'Vernieuwen...' : 'Vernieuw Bonussen'}</span>
            </button>
            <button
              onClick={() => setShowPersonalized(!showPersonalized)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showPersonalized
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span>Gepersonaliseerd</span>
            </button>
          </div>
        </div>

        {/* Bonus Status Info */}
        {bonusStatus.lastUpdate && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  AH Bonussen Status
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-blue-700">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Laatste update: {bonusStatus.lastUpdate.toLocaleDateString('nl-NL')} om {bonusStatus.lastUpdate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span>{bonusStatus.itemCount} bonusartikelen</span>
                <span className={`px-2 py-1 rounded-full ${
                  bonusStatus.source === 'fresh_scrape' ? 'bg-green-100 text-green-800' :
                  bonusStatus.source === 'cache' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {bonusStatus.source === 'fresh_scrape' ? 'Vers opgehaald' :
                   bonusStatus.source === 'cache' ? 'Uit cache' : 'Onbekend'}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek recepten..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Alle moeilijkheden</option>
                <option value="makkelijk">Makkelijk</option>
                <option value="gemiddeld">Gemiddeld</option>
                <option value="moeilijk">Moeilijk</option>
              </select>
            </div>
          </div>

          {/* Filter toggles */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowBonusOnly(!showBonusOnly)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showBonusOnly
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Euro className="h-4 w-4" />
              <span>Alleen met AH bonus</span>
            </button>
          </div>

          {showPersonalized && fridgeItems.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-medium text-orange-900 mb-2">
                Recepten gebaseerd op uw koelkast ingrediënten:
              </h3>
              <div className="flex flex-wrap gap-2">
                {fridgeItems.slice(0, 8).map(item => (
                  <span key={item.id} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">
                    {item.name}
                  </span>
                ))}
                {fridgeItems.length > 8 && (
                  <span className="text-orange-600 text-sm">+{fridgeItems.length - 8} meer</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Geen recepten gevonden
            </h3>
            <p className="text-gray-600">
              Probeer een andere zoekterm of pas uw filters aan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe: RecipeWithSavings) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    {showPersonalized && recipe.matchScore && recipe.matchScore > 0 && (
                      <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {recipe.matchScore} match{recipe.matchScore > 1 ? 'es' : ''}
                      </div>
                    )}
                    {recipe.totalSavings && recipe.totalSavings > 0 && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        €{recipe.totalSavings.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{recipe.prep_time + recipe.cook_time} min</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{recipe.servings} personen</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.difficulty === 'makkelijk' ? 'bg-green-100 text-green-800' :
                      recipe.difficulty === 'gemiddeld' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {recipe.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {showPersonalized && recipe.matchingIngredients && recipe.matchingIngredients.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-orange-600 font-medium mb-1">
                        Ingrediënten die u heeft:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.matchingIngredients.slice(0, 3).map((ingredient: string) => (
                          <span key={ingredient} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs">
                            {ingredient}
                          </span>
                        ))}
                        {recipe.matchingIngredients.length > 3 && (
                          <span className="text-orange-600 text-xs">+{recipe.matchingIngredients.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {recipe.bonusItems && recipe.bonusItems.length > 0 && (
                    <div className="mb-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700 font-medium mb-2 flex items-center">
                        <Euro className="h-3 w-3 mr-1" />
                        Albert Heijn Bonus besparingen:
                      </p>
                      <div className="space-y-1">
                        {recipe.bonusItems.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <div className="flex-1">
                              <span className="text-green-800">{item.name}</span>
                              {item.description && (
                                <div className="text-green-600 text-xs">{item.description}</div>
                              )}
                            </div>
                            <span className="text-green-600 font-medium">-€{item.savings.toFixed(2)}</span>
                          </div>
                        ))}
                        {recipe.bonusItems.length > 2 && (
                          <p className="text-xs text-green-600">+{recipe.bonusItems.length - 2} meer items</p>
                        )}
                        <div className="border-t border-green-200 pt-1 mt-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-green-800">Totaal bespaard:</span>
                            <span className="text-green-600">€{recipe.totalSavings?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
                      Bekijk Recept
                    </button>
                    {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                      <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};