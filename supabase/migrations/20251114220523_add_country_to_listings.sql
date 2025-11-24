/*
  # Add Country Field to Listings

  1. Changes to listings table
    - Add `country` (text) - country of origin for the hair
    - Default value is 'France'
  
  2. Important Notes
    - Country field helps buyers know the origin of the hair
    - European hair is highly valued for quality
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'country'
  ) THEN
    ALTER TABLE listings ADD COLUMN country text DEFAULT 'France' NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_listings_country ON listings(country);