/*
  # Add Admin Policies for Listings Management

  1. New Policies
    - Admin can view all listings (including inactive)
    - Admin can delete any listing
    - Admin can update any listing status

  2. Security
    - Policies check for admin email in JWT metadata
    - Only stephaniebuisson1115@gmail.com has admin access
    - Existing user policies remain unchanged
*/

-- Admin can view all listings (including inactive ones)
CREATE POLICY "Admin can view all listings"
  ON listings
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com'
  );

-- Admin can delete any listing
CREATE POLICY "Admin can delete any listing"
  ON listings
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com'
  );

-- Admin can update any listing
CREATE POLICY "Admin can update any listing"
  ON listings
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com'
  )
  WITH CHECK (
    (auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com'
  );
