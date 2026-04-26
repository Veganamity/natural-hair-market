/*
  # Fix listings RLS policies for certified salons

  ## Problem
  The INSERT policies on the listings table only check `is_verified_salon`,
  but the admin certification process sets `is_certified_salon = true`.
  This causes certified salons to get a row-level security error when creating listings.

  ## Changes
  - Drop the two existing INSERT policies that only check `is_verified_salon`
  - Create a new unified INSERT policy that accepts either `is_verified_salon` OR `is_certified_salon`
*/

DROP POLICY IF EXISTS "Only verified salons can create listings" ON listings;
DROP POLICY IF EXISTS "Verified salons can create listings" ON listings;

CREATE POLICY "Certified or verified salons can create listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = seller_id AND (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND (profiles.is_verified_salon = true OR profiles.is_certified_salon = true)
      )
    )
  );
