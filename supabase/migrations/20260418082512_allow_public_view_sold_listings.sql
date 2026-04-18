/*
  # Allow public view of sold listings

  1. Changes
    - Update the "Public can view active listings" policy to also allow viewing sold listings
    - Update the "Authenticated users can view active listings" policy to also allow viewing sold listings

  2. Security
    - Public (anon) users can now see both active and sold listings
    - Authenticated users can see active and sold listings, plus all their own listings
*/

DROP POLICY IF EXISTS "Public can view active listings" ON listings;
DROP POLICY IF EXISTS "Authenticated users can view active listings" ON listings;

CREATE POLICY "Public can view active and sold listings"
  ON listings
  FOR SELECT
  TO anon
  USING (status IN ('active', 'sold'));

CREATE POLICY "Authenticated users can view active and sold listings"
  ON listings
  FOR SELECT
  TO authenticated
  USING (status IN ('active', 'sold') OR seller_id = auth.uid());
