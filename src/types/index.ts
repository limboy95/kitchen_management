export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  profile_completed: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  dietary_preferences: string[];
  allergens: string[];
  kitchen_preferences: string[];
  created_at: string;
  updated_at: string;
}

export interface FridgeItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date?: string;
  image_url?: string;
  created_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'makkelijk' | 'gemiddeld' | 'moeilijk';
  image_url?: string;
  tags: string[];
}