/*
  # Allow all authenticated users to create listings

  ## Change
  - Drop the restrictive INSERT policy on listings that required salon verification
  - Replace with a policy that allows any authenticated user to create a listing
    (particuliers can now sell their hair without SIRET/SIREN)

  ## Security
  - Still requires authentication (auth.uid() = seller_id)
  - Users can only create listings where they are the seller
*/

DROP POLICY IF EXISTS "Certified or verified salons can create listings" ON listings;

CREATE POLICY "Authenticated users can create listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);
