/*
  # Create AH Bonus Cache Table

  1. New Tables
    - `ah_bonus_cache`
      - `id` (uuid, primary key)
      - `name` (text)
      - `originalPrice` (decimal)
      - `bonusPrice` (decimal)
      - `category` (text)
      - `description` (text, optional)
      - `validUntil` (date, optional)
      - `scraped_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Allow authenticated users to read
    - Only allow service role to write (for scraper)

  3. Indexes
    - Add indexes on frequently queried columns
*/

CREATE TABLE IF NOT EXISTS ah_bonus_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  originalPrice decimal(10,2) NOT NULL,
  bonusPrice decimal(10,2) NOT NULL,
  category text NOT NULL,
  description text,
  validUntil date,
  scraped_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ah_bonus_cache ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read bonus data
CREATE POLICY "Anyone can view AH bonus cache"
  ON ah_bonus_cache
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert/update/delete (for the scraper)
CREATE POLICY "Service role can manage AH bonus cache"
  ON ah_bonus_cache
  FOR ALL
  TO service_role
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ah_bonus_cache_category ON ah_bonus_cache(category);
CREATE INDEX IF NOT EXISTS idx_ah_bonus_cache_name ON ah_bonus_cache(name);
CREATE INDEX IF NOT EXISTS idx_ah_bonus_cache_valid_until ON ah_bonus_cache(validUntil);
CREATE INDEX IF NOT EXISTS idx_ah_bonus_cache_created_at ON ah_bonus_cache(created_at DESC);