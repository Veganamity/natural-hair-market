/*
# Add admin SELECT policy on offers table

1. Purpose
   - The "Gestion des Offres" admin section needs to display ALL offers in the system.
   - Currently, RLS only allows buyers to see their own offers and sellers to see offers on their listings.
   - The admin account (stephaniebuisson1115@gmail.com) is neither buyer nor seller on most offers, so zero rows are returned.
   - This migration adds a SELECT policy for the admin email, matching the existing pattern used for listings, salon verifications, and buyback requests.

2. Security changes
   - New SELECT policy "Admin can view all offers" on offers table, scoped TO authenticated, checking (auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com'.
   - No INSERT/UPDATE/DELETE changes — admin only needs read access.
   - GRANT SELECT already exists from the 20260516134502 migration.
*/

DROP POLICY IF EXISTS "Admin can view all offers" ON offers;

CREATE POLICY "Admin can view all offers"
  ON offers FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'email') = 'stephaniebuisson1115@gmail.com');
