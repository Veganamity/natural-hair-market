/*
  # Remove label column from saved_addresses

  1. Changes
    - Drop the `label` column from `saved_addresses` table as it's no longer needed
    - User's full name will be used as the identifier in the UI
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_addresses' AND column_name = 'label'
  ) THEN
    ALTER TABLE saved_addresses DROP COLUMN label;
  END IF;
END $$;