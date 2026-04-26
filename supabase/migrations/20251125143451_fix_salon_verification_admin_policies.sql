/*
  # Fix Admin Policies for Salon Verifications

  This migration fixes the admin policies for the salon_verifications table.
  The existing policies check if the user's email matches the admin email,
  but they don't work correctly with Supabase's client-side queries.

  ## Changes
  1. Drop existing admin policies
  2. Create new simplified admin policies that check email directly via auth.jwt()
  3. Ensure profiles table policies allow admin to read all profiles

  ## Security
  - Only users with the admin email can view and update all verification requests
  - Regular users can only view and create their own requests
*/

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admin can view all verification requests" ON salon_verifications;
DROP POLICY IF EXISTS "Admin can update all verification requests" ON salon_verifications;

-- Create new admin policies using auth.jwt() which is more reliable
CREATE POLICY "Admin can view all verification requests"
  ON salon_verifications FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com'
  );

CREATE POLICY "Admin can update all verification requests"
  ON salon_verifications FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com'
  )
  WITH CHECK (
    (auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com'
  );

-- Ensure profiles table allows admin to read all profiles for joins
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com'
  );
