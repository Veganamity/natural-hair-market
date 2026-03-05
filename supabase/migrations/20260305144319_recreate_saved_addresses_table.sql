/*
  # Recreate saved_addresses table

  1. New Tables
    - `saved_addresses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `label` (text) - Name/label for the address (e.g., "Home", "Work")
      - `full_name` (text) - Recipient's full name
      - `address_line1` (text) - Primary address line
      - `address_line2` (text, optional) - Secondary address line
      - `postal_code` (text) - Postal/ZIP code
      - `city` (text) - City name
      - `country` (text) - Country code (default: 'FR')
      - `phone` (text) - Contact phone number
      - `is_default` (boolean) - Whether this is the default address
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `saved_addresses` table
    - Add policies for authenticated users to manage their own addresses

  3. Functions & Triggers
    - Function to ensure only one default address per user
    - Trigger to update timestamps automatically
*/

-- Drop existing table if it exists (to clean up)
DROP TABLE IF EXISTS saved_addresses CASCADE;

-- Create the saved_addresses table
CREATE TABLE saved_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  full_name text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  postal_code text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'FR',
  phone text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own addresses"
  ON saved_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses"
  ON saved_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON saved_addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON saved_addresses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE saved_addresses
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single default address
CREATE TRIGGER trigger_ensure_single_default_address
  BEFORE INSERT OR UPDATE ON saved_addresses
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_address();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_saved_addresses_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_saved_addresses_timestamp
  BEFORE UPDATE ON saved_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_addresses_timestamp();

-- Create indexes for faster queries
CREATE INDEX idx_saved_addresses_user_id ON saved_addresses(user_id);
CREATE INDEX idx_saved_addresses_is_default ON saved_addresses(user_id, is_default) WHERE is_default = true;