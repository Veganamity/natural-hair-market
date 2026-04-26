/*
  # Add certified salon column to profiles

  1. Changes
    - Add `is_certified_salon` column to profiles table
    - Add `is_verified_salon` column to profiles table
    - Both default to false

  2. Notes
    - These columns track salon certification and verification status
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_certified_salon'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_certified_salon boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_verified_salon'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_verified_salon boolean DEFAULT false;
  END IF;
END $$;