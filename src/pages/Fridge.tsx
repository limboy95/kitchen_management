import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { 
  Plus, 
  Search, 
  Calendar, 
  Package, 
  Trash2, 
  Edit,
  AlertTriangle
} from 'lucide-react';
import { FridgeItem } from '../types';

export const Fridge: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    unit: 'stuks',
    expiry_date: ''
  });

  const commonIngredients = [
    'Melk', 'Brood', 'Eieren', 'Kaas', 'Boter', 'Yoghurt', 'Appels', 'Bananen',
    'Tomaten', 'Uien', 'Aardappelen', 'Wortelen', 'Paprika', 'Komkommer',
    'Kip', 'Gehakt', 'Vis', 'Rijst', 'Pasta', 'Olijfolie', 'Zout', 'Peper'
  ];

  const units = ['stuks', 'kg', 'gram', 'liter', 'ml', 'pakken', 'blikken'];

  useEffect(() => {
    fetchFridgeItems();
  }, [user]);

  const fetchFridgeItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching fridge items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .insert([
          {
            user_id: user.id,
            name: newItem.name,
            quantity: newItem.quantity,
            unit: newItem.unit,
            expiry_date: newItem.expiry_date || null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setItems([data, ...items]);
      setNewItem({ name: '', quantity: 1, unit: 'stuks', expiry_date: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fridge_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
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
            <h1 className="text-2xl font-bold text-gray-900">Mijn Koelkast</h1>
            <p className="mt-2 text-gray-600">
              Beheer uw ingrediënten en voorraad
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Toevoegen</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek ingrediënten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Nieuw Ingrediënt Toevoegen
              </h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingrediënt
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    list="ingredients"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Bijv. melk, brood, eieren..."
                  />
                  <datalist id="ingredients">
                    {commonIngredients.map(ingredient => (
                      <option key={ingredient} value={ingredient} />
                    ))}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aantal
                    </label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                      min="1"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eenheid
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Houdbaarheidsdatum (optioneel)
                  </label>
                  <input
                    type="date"
                    value={newItem.expiry_date}
                    onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                  >
                    Toevoegen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Fridge Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Geen ingrediënten gevonden
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Probeer een andere zoekterm' : 'Voeg uw eerste ingrediënt toe om te beginnen'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Eerste ingrediënt toevoegen
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-sm border p-4 transition-all hover:shadow-md ${
                  isExpired(item.expiry_date || '') ? 'border-red-300 bg-red-50' :
                  isExpiringSoon(item.expiry_date || '') ? 'border-yellow-300 bg-yellow-50' :
                  'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {item.expiry_date && (
                  <div className={`flex items-center space-x-2 text-sm ${
                    isExpired(item.expiry_date) ? 'text-red-600' :
                    isExpiringSoon(item.expiry_date) ? 'text-yellow-600' :
                    'text-gray-500'
                  }`}>
                    {(isExpired(item.expiry_date) || isExpiringSoon(item.expiry_date)) && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <Calendar className="h-4 w-4" />
                    <span>
                      {isExpired(item.expiry_date) ? 'Verlopen op' :
                       isExpiringSoon(item.expiry_date) ? 'Verloopt op' :
                       'Houdbaar tot'} {new Date(item.expiry_date).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
