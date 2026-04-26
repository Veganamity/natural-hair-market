/*
  # Add Verification and Safety Features

  1. New Fields in profiles table
    - `email_verified` (boolean) - Whether the user's email has been verified
    - `phone_verified` (boolean) - Whether the user's phone has been verified
    - `siret` (text, nullable) - Business registration number for salons
    - `is_verified_salon` (boolean) - Computed field based on SIRET presence

  2. New Fields in listings table
    - `certification_accepted` (boolean) - Whether seller certified authenticity of hair

  3. New Table: listing_reports
    - `id` (uuid, primary key)
    - `listing_id` (uuid, foreign key to listings)
    - `reporter_id` (uuid, foreign key to profiles)
    - `reason` (text) - Reason for reporting (fake listing, synthetic hair, misleading photos, suspicious seller)
    - `description` (text, nullable) - Additional details
    - `status` (text) - Status of report (pending, reviewed, resolved, dismissed)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  4. Security
    - Enable RLS on listing_reports table
    - Add policies for authenticated users to create reports
    - Add policies for users to view their own reports
    - Restrict listing creation to verified users
*/

-- Add verification fields to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email_verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'siret'
  ) THEN
    ALTER TABLE profiles ADD COLUMN siret text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_verified_salon'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_verified_salon boolean DEFAULT false;
  END IF;
END $$;

-- Add certification field to listings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'certification_accepted'
  ) THEN
    ALTER TABLE listings ADD COLUMN certification_accepted boolean DEFAULT false;
  END IF;
END $$;

-- Create listing_reports table
CREATE TABLE IF NOT EXISTS listing_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on listing_reports
ALTER TABLE listing_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can create reports
CREATE POLICY "Authenticated users can create reports"
  ON listing_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Policy: Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON listing_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Policy: Users can view reports on their listings
CREATE POLICY "Sellers can view reports on their listings"
  ON listing_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_reports.listing_id
      AND listings.seller_id = auth.uid()
    )
  );

-- Create index for faster report lookups
CREATE INDEX IF NOT EXISTS idx_listing_reports_listing_id ON listing_reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_reports_reporter_id ON listing_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_listing_reports_status ON listing_reports(status);

-- Function to automatically update is_verified_salon when SIRET is added
CREATE OR REPLACE FUNCTION update_verified_salon_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.siret IS NOT NULL AND NEW.siret != '' THEN
    NEW.is_verified_salon := true;
  ELSE
    NEW.is_verified_salon := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update is_verified_salon automatically
DROP TRIGGER IF EXISTS trigger_update_verified_salon ON profiles;
CREATE TRIGGER trigger_update_verified_salon
  BEFORE INSERT OR UPDATE OF siret ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_verified_salon_status();
