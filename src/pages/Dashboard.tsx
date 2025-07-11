import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { 
  Refrigerator, 
  ChefHat, 
  ShoppingCart, 
  TrendingUp,
  Plus,
  Clock,
  Star
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    fridgeItems: 0,
    favoriteRecipes: 0,
    weeklyMeals: 0
  });
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Get fridge items count
        const { count: fridgeCount } = await supabase
          .from('fridge_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setStats({
          fridgeItems: fridgeCount || 0,
          favoriteRecipes: 12, // Mock data
          weeklyMeals: 5 // Mock data
        });

        // Mock recent recipes
        setRecentRecipes([
          {
            id: 1,
            title: 'Mediterrane Pasta',
            prep_time: 15,
            difficulty: 'makkelijk',
            image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300'
          },
          {
            id: 2,
            title: 'Groene Curry',
            prep_time: 25,
            difficulty: 'gemiddeld',
            image_url: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=300'
          },
          {
            id: 3,
            title: 'Caesar Salade',
            prep_time: 10,
            difficulty: 'makkelijk',
            image_url: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=300'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welkom terug, {user?.email}!
          </h1>
          <p className="mt-2 text-gray-600">
            Hier is uw keuken overzicht voor vandaag
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Refrigerator className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Koelkast Items</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.fridgeItems}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/koelkast"
                className="text-sm text-orange-600 hover:text-orange-500 font-medium"
              >
                Beheer koelkast →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <ChefHat className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Favoriete Recepten</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.favoriteRecipes}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/recepten"
                className="text-sm text-green-600 hover:text-green-500 font-medium"
              >
                Bekijk recepten →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Deze Week</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.weeklyMeals}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-blue-600 font-medium">
                maaltijden gepland
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Snelle Acties</h3>
            <div className="space-y-3">
              <Link
                to="/koelkast"
                className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <Plus className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Ingrediënt toevoegen</span>
              </Link>
              <Link
                to="/recepten"
                className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <ChefHat className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Recept zoeken</span>
              </Link>
              <button className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full">
                <ShoppingCart className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Boodschappenlijst maken</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recente Recepten</h3>
            <div className="space-y-3">
              {recentRecipes.map((recipe) => (
                <div key={recipe.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{recipe.title}</h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{recipe.prep_time} min</span>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Suggestions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vandaag's Suggesties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Breakfast suggestion"
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium text-gray-900">Avocado Toast</h4>
              <p className="text-sm text-gray-600">Perfect voor een gezond ontbijt</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                <span>4.8 • 10 min</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <img
                src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Lunch suggestion"
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium text-gray-900">Quinoa Bowl</h4>
              <p className="text-sm text-gray-600">Gezonde lunch met verse groenten</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                <span>4.6 • 20 min</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <img
                src="https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Dinner suggestion"
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium text-gray-900">Zalm met Groenten</h4>
              <p className="text-sm text-gray-600">Lekker diner vol omega-3</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                <span>4.9 • 25 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};