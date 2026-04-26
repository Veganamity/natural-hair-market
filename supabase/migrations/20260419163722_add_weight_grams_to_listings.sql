/*
  # Add weight_grams column to listings

  1. Changes
    - Add `weight_grams` integer column to `listings` table
    - Populate existing rows by parsing `hair_weight` text field (e.g. "100g", "500 g", "1kg")
    - Add default of 100 grams for future rows where not specified

  2. Notes
    - hair_weight is a free-text field like "100g", "250g", "500g", "1kg", "1.5kg"
    - We extract the numeric value and unit and convert to grams
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'weight_grams'
  ) THEN
    ALTER TABLE listings ADD COLUMN weight_grams integer NOT NULL DEFAULT 100;
  END IF;
END $$;

UPDATE listings
SET weight_grams = CASE
  WHEN lower(hair_weight) ~ '^[0-9]+(\.[0-9]+)?\s*kg$' THEN
    round(cast(regexp_replace(lower(hair_weight), '[^0-9.]', '', 'g') as numeric) * 1000)::integer
  WHEN lower(hair_weight) ~ '^[0-9]+(\.[0-9]+)?\s*g$' THEN
    round(cast(regexp_replace(lower(hair_weight), '[^0-9.]', '', 'g') as numeric))::integer
  ELSE 100
END
WHERE hair_weight IS NOT NULL AND hair_weight != '';
