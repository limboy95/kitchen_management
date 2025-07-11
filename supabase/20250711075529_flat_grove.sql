 /*
  # Create Kitchen Management Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `dietary_preferences` (text array)
      - `allergens` (text array)
      - `kitchen_preferences` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `fridge_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `quantity` (integer)
      - `unit` (text)
      - `expiry_date` (date, optional)
      - `image_url` (text, optional)
      - `created_at` (timestamp)

    - `recipes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `ingredients` (text array)
      - `instructions` (text array)
      - `prep_time` (integer)
      - `cook_time` (integer)
      - `servings` (integer)
      - `difficulty` (text)
      - `image_url` (text, optional)
      - `tags` (text array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policy for admins to access all data

  3. Indexes
    - Add indexes on frequently queried columns
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dietary_preferences text[] DEFAULT '{}',
  allergens text[] DEFAULT '{}',
  kitchen_preferences text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create fridge_items table
CREATE TABLE IF NOT EXISTS fridge_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  quantity integer DEFAULT 1,
  unit text DEFAULT 'stuks',
  expiry_date date,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  ingredients text[] NOT NULL DEFAULT '{}',
  instructions text[] NOT NULL DEFAULT '{}',
  prep_time integer NOT NULL DEFAULT 0,
  cook_time integer NOT NULL DEFAULT 0,
  servings integer NOT NULL DEFAULT 1,
  difficulty text NOT NULL DEFAULT 'makkelijk',
  image_url text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fridge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fridge items policies
CREATE POLICY "Users can view own fridge items"
  ON fridge_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fridge items"
  ON fridge_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fridge items"
  ON fridge_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fridge items"
  ON fridge_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Recipe policies (public read, admin write)
CREATE POLICY "Anyone can view recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin policies
CREATE POLICY "Admins can manage all user profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage all fridge items"
  ON fridge_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage all recipes"
  ON recipes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_fridge_items_user_id ON fridge_items(user_id);
CREATE INDEX IF NOT EXISTS idx_fridge_items_expiry_date ON fridge_items(expiry_date);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);

-- Create updated_at trigger for user_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Allow policies that reference auth.users to run for authenticated sessions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON TABLE auth.users TO authenticated;
