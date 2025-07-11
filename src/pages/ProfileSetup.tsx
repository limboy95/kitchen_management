import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { ChefHat, Plus, X } from 'lucide-react';

export const ProfileSetup: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [kitchenPreferences, setKitchenPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const commonDietaryPreferences = [
    'Vegetarisch', 'Veganistisch', 'Pescetariër', 'Glutenvrij', 'Lactosevrij', 
    'Koolhydraatarm', 'Keto', 'Paleo', 'Mediterraan', 'Halal', 'Kosher'
  ];

  const commonAllergens = [
    'Noten', 'Pinda\'s', 'Lactose', 'Gluten', 'Soja', 'Eieren', 
    'Vis', 'Schaaldieren', 'Sesam', 'Selderij', 'Mosterd', 'Sulfiet'
  ];

  const commonKitchenPreferences = [
    'Snelle maaltijden', 'Uitgebreide kook sessies', 'Gezonde recepten', 
    'Comfort food', 'Internationale keuken', 'Traditionele gerechten',
    'Baking & desserts', 'Meal prep', 'Familie maaltijden'
  ];

  const togglePreference = (preference: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(preference)) {
      setList(list.filter(p => p !== preference));
    } else {
      setList([...list, preference]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: user?.id,
            first_name: firstName,
            last_name: lastName,
            dietary_preferences: dietaryPreferences,
            allergens: allergens,
            kitchen_preferences: kitchenPreferences
          }
        ]);

      if (error) throw error;

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden bij het opslaan van uw profiel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <ChefHat className="mx-auto h-12 w-12 text-orange-500" />
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Vertel ons over uzelf
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Help ons uw perfecte keukenervaring te creëren
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Voornaam
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Achternaam
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dieetvoorkeuren
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonDietaryPreferences.map((preference) => (
                  <button
                    key={preference}
                    type="button"
                    onClick={() => togglePreference(preference, dietaryPreferences, setDietaryPreferences)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      dietaryPreferences.includes(preference)
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    } border`}
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Allergieën
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonAllergens.map((allergen) => (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => togglePreference(allergen, allergens, setAllergens)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      allergens.includes(allergen)
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    } border`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Keukenvoorkeuren
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonKitchenPreferences.map((preference) => (
                  <button
                    key={preference}
                    type="button"
                    onClick={() => togglePreference(preference, kitchenPreferences, setKitchenPreferences)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      kitchenPreferences.includes(preference)
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    } border`}
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Profiel opslaan...' : 'Profiel opslaan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};