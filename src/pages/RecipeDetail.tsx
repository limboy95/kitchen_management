import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { 
  Clock, 
  Users, 
  ChefHat, 
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  CheckCircle,
  Circle,
  Euro,
  TrendingDown
} from 'lucide-react';
import { Recipe } from '../types';

// Mock recipe data - in real app this would come from database
const mockRecipes: Recipe[] = [
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
    image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image_url: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image_url: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image_url: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image_url: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image_url: 'https://images.pexels.com/photos/4113717/pexels-photo-4113717.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image_url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Comfort food', 'Gezinsvriendelijk', 'Eenpansgerecht']
  }
];

export const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [checkedInstructions, setCheckedInstructions] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [servings, setServings] = useState(4);

  useEffect(() => {
    // Find recipe by ID
    const foundRecipe = mockRecipes.find(r => r.id === id);
    if (foundRecipe) {
      setRecipe(foundRecipe);
      setServings(foundRecipe.servings);
    }
  }, [id]);

  const toggleIngredient = (ingredient: string) => {
    setCheckedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const toggleInstruction = (index: number) => {
    setCheckedInstructions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const adjustServings = (newServings: number) => {
    if (newServings > 0 && newServings <= 20) {
      setServings(newServings);
    }
  };

  const getAdjustedQuantity = (originalQuantity: string) => {
    if (!recipe) return originalQuantity;
    const multiplier = servings / recipe.servings;
    // Simple quantity adjustment - in real app this would be more sophisticated
    const numbers = originalQuantity.match(/\d+/g);
    if (numbers) {
      return originalQuantity.replace(/\d+/g, (match) => 
        Math.round(parseInt(match) * multiplier).toString()
      );
    }
    return originalQuantity;
  };

  if (!recipe) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ChefHat className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Recept niet gevonden
            </h3>
            <Link to="/recepten" className="text-orange-600 hover:text-orange-500">
              Terug naar recepten
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/recepten" 
            className="inline-flex items-center text-orange-600 hover:text-orange-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar recepten
          </Link>
        </div>

        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
          <div className="relative">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                } hover:bg-red-500 hover:text-white transition-colors`}
              >
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((tag) => (
                <span key={tag} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Bereidingstijd</div>
                <div className="font-semibold">{recipe.prep_time + recipe.cook_time} min</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Porties</div>
                <div className="font-semibold">{servings} personen</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <ChefHat className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Moeilijkheid</div>
                <div className="font-semibold capitalize">{recipe.difficulty}</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Star className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Waardering</div>
                <div className="font-semibold">4.8/5</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Ingrediënten</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustServings(servings - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">{servings}</span>
                  <button
                    onClick={() => adjustServings(servings + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleIngredient(ingredient)}
                      className="flex-shrink-0"
                    >
                      {checkedIngredients.includes(ingredient) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <span className={`${
                      checkedIngredients.includes(ingredient) 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-900'
                    }`}>
                      {getAdjustedQuantity(ingredient)}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <ShoppingCart className="h-4 w-4" />
                <span>Voeg toe aan boodschappenlijst</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Bereidingswijze</h2>
              
              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-4">
                    <button
                      onClick={() => toggleInstruction(index)}
                      className="flex-shrink-0 mt-1"
                    >
                      {checkedInstructions.includes(index) ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`text-gray-900 leading-relaxed ${
                        checkedInstructions.includes(index) 
                          ? 'line-through text-gray-500' 
                          : ''
                      }`}>
                        {instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Voedingswaarde (per portie)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">320</div>
                  <div className="text-sm text-gray-600">Calorieën</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">12g</div>
                  <div className="text-sm text-gray-600">Eiwitten</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">45g</div>
                  <div className="text-sm text-gray-600">Koolhydraten</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">8g</div>
                  <div className="text-sm text-gray-600">Vetten</div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Chef's Tips</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Gebruik verse ingrediënten voor de beste smaak</li>
                <li>• Laat het gerecht 5 minuten rusten voor het serveren</li>
                <li>• Bewaar restjes maximaal 3 dagen in de koelkast</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};