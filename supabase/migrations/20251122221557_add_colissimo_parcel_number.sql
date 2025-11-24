/*
  # Add Colissimo Parcel Number Field

  1. Changes
    - Add `colissimo_parcel_number` column to store Colissimo-specific tracking reference
    - This field is used when Colissimo API is used instead of Sendcloud

  2. Notes
    - The existing `tracking_number` field is used for all carriers
    - This field provides additional Colissimo-specific reference if needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'colissimo_parcel_number'
  ) THEN
    ALTER TABLE transactions ADD COLUMN colissimo_parcel_number text;
  END IF;
END $$;