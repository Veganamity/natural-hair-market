/*
  # Add Instant Buy Support to Listings

  1. Changes
    - Add `accept_offers` column to listings table (boolean, default true)
    - Add `instant_buy_enabled` column to listings table (boolean, default true)
    - Both features are enabled by default to maintain backwards compatibility

  2. Important Notes
    - `accept_offers`: When true, buyers can make offers below the listing price
    - `instant_buy_enabled`: When true, buyers can purchase at the listed price immediately
    - Sellers can control these options when creating/editing listings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'accept_offers'
  ) THEN
    ALTER TABLE listings ADD COLUMN accept_offers boolean DEFAULT true NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'instant_buy_enabled'
  ) THEN
    ALTER TABLE listings ADD COLUMN instant_buy_enabled boolean DEFAULT true NOT NULL;
  END IF;
END $$;