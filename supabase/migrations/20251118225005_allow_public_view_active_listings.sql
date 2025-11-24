/*
  # Allow public access to view active listings

  1. Changes
    - Drop the existing "Anyone can view active listings" policy that only allows authenticated users
    - Create a new policy that allows anonymous (public) users to view active listings
    - Authenticated users can still view their own listings regardless of status

  2. Security
    - Public users can only see listings with status = 'active'
    - Sellers can still see all their own listings
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can view active listings" ON listings;

-- Create a new policy for public access to active listings
CREATE POLICY "Public can view active listings"
  ON listings
  FOR SELECT
  TO anon
  USING (status = 'active');

-- Create a policy for authenticated users to view active listings or their own
CREATE POLICY "Authenticated users can view active listings"
  ON listings
  FOR SELECT
  TO authenticated
  USING (status = 'active' OR seller_id = auth.uid());
