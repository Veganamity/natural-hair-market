/*
  # Add Shipping Information for Mondial Relay and Chronopost Integration

  1. New Tables
    - `shipping_addresses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text, recipient name)
      - `phone` (text, contact phone)
      - `address_line1` (text, street address)
      - `address_line2` (text, optional additional address)
      - `postal_code` (text, postal code)
      - `city` (text, city name)
      - `country` (text, country code)
      - `is_default` (boolean, default address)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Modifications to Existing Tables
    - Add shipping columns to `transactions` table
      - `shipping_method` (text, 'mondial_relay' or 'chronopost')
      - `shipping_cost` (decimal, shipping cost in euros)
      - `shipping_address_id` (uuid, foreign key to shipping_addresses)
      - `relay_point_id` (text, for Mondial Relay pickup point)
      - `relay_point_name` (text, name of relay point)
      - `relay_point_address` (text, address of relay point)
      - `tracking_number` (text, carrier tracking number)
      - `shipped_at` (timestamptz, when item was shipped)
      - `delivered_at` (timestamptz, when item was delivered)

  3. Security
    - Enable RLS on `shipping_addresses` table
    - Add policies for users to manage their own addresses
    - Update policies for transactions to include shipping data

  4. Notes
    - Mondial Relay: For pickup at relay points
    - Chronopost: For home delivery
    - Shipping costs will be calculated based on weight and destination
*/

-- Create shipping_addresses table
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  postal_code text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'FR',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add shipping columns to transactions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipping_method'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_method text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipping_cost'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_cost decimal(10, 2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipping_address_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_address_id uuid REFERENCES shipping_addresses(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'relay_point_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN relay_point_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'relay_point_name'
  ) THEN
    ALTER TABLE transactions ADD COLUMN relay_point_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'relay_point_address'
  ) THEN
    ALTER TABLE transactions ADD COLUMN relay_point_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'tracking_number'
  ) THEN
    ALTER TABLE transactions ADD COLUMN tracking_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipped_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipped_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'delivered_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN delivered_at timestamptz;
  END IF;
END $$;

-- Enable RLS on shipping_addresses
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Policies for shipping_addresses
CREATE POLICY "Users can view own shipping addresses"
  ON shipping_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own shipping addresses"
  ON shipping_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shipping addresses"
  ON shipping_addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shipping addresses"
  ON shipping_addresses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_shipping_address ON transactions(shipping_address_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tracking_number ON transactions(tracking_number);