/*
  # Fix RLS Permissions for Auth Users Table Access

  1. Security Function
    - Create `is_admin()` function with SECURITY DEFINER privileges
    - This function can access auth.users table with elevated permissions

  2. Policy Updates
    - Update all admin policies to use the new `is_admin()` function
    - Remove direct auth.users table queries from RLS policies

  3. Permissions
    - Ensure proper grants for authenticated users
*/

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  );
END;
$$;

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all fridge items" ON fridge_items;
DROP POLICY IF EXISTS "Admins can manage all recipes" ON recipes;

-- Recreate admin policies using the new function
CREATE POLICY "Admins can manage all user profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage all fridge items"
  ON fridge_items
  FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage all recipes"
  ON recipes
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Ensure proper permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON TABLE auth.users TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;