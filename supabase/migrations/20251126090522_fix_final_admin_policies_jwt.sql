/*
  # Fix Final 3 Admin Policies with auth.jwt()
  
  Replace the admin policies to use properly optimized (select auth.jwt())
  format to eliminate per-row re-evaluation warnings.
*/

-- =====================================================
-- FIX PROFILES ADMIN POLICY
-- =====================================================
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (((select auth.jwt())->>'email') = 'stephaniebuisson1115@gmail.com');

-- =====================================================
-- FIX SALON_VERIFICATIONS ADMIN POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Admin can view all verification requests" ON salon_verifications;
DROP POLICY IF EXISTS "Admin can update all verification requests" ON salon_verifications;

CREATE POLICY "Admin can view all verification requests"
  ON salon_verifications FOR SELECT
  TO authenticated
  USING (((select auth.jwt())->>'email') = 'stephaniebuisson1115@gmail.com');

CREATE POLICY "Admin can update all verification requests"
  ON salon_verifications FOR UPDATE
  TO authenticated
  USING (((select auth.jwt())->>'email') = 'stephaniebuisson1115@gmail.com')
  WITH CHECK (((select auth.jwt())->>'email') = 'stephaniebuisson1115@gmail.com');

-- =====================================================
-- DOCUMENT ALL UNUSED INDEXES (KEPT FOR FUTURE SCALING)
-- =====================================================
COMMENT ON INDEX idx_listings_created_at IS 'Index for sorting listings by creation date - will be used for pagination and filtering';
COMMENT ON INDEX idx_listings_country IS 'Index for filtering listings by country - critical for multi-country scaling';
COMMENT ON INDEX idx_transactions_status IS 'Index for filtering transactions by status - used in admin dashboard and reports';
COMMENT ON INDEX idx_transactions_stripe_payment_intent IS 'Index for Stripe webhook lookups - CRITICAL for payment processing';
COMMENT ON INDEX idx_profiles_stripe_account_id IS 'Index for Stripe account lookups - CRITICAL for seller onboarding checks';
COMMENT ON INDEX idx_listing_reports_listing_id IS 'Index for viewing all reports for a specific listing - admin moderation';
COMMENT ON INDEX idx_listing_reports_reporter_id IS 'Index for viewing user report history - fraud detection';
COMMENT ON INDEX idx_listing_reports_status IS 'Index for filtering reports by status - admin queue management';
COMMENT ON INDEX idx_transactions_tracking_number IS 'Index for tracking number searches - customer support queries';
COMMENT ON INDEX idx_offers_status IS 'Index for filtering offers by status - used in offer management';
COMMENT ON INDEX idx_salon_verifications_user_id IS 'Index for user verification lookups - certification system';
COMMENT ON INDEX idx_salon_verifications_status IS 'Index for filtering verifications by status - admin approval queue';

-- =====================================================
-- DOCUMENT MULTIPLE PERMISSIVE POLICIES (INTENTIONAL)
-- =====================================================
COMMENT ON TABLE listing_reports IS 'Multiple SELECT policies are intentional: reporters see their own reports, sellers see reports on their listings';
COMMENT ON TABLE offers IS 'Multiple policies are intentional: buyers see their offers, sellers see offers on their listings, both can update (different conditions)';
COMMENT ON TABLE profiles IS 'Multiple SELECT policies are intentional: everyone can view profiles, admin has unrestricted access';
COMMENT ON TABLE salon_verifications IS 'Multiple SELECT policies are intentional: users see their own requests, admin sees all requests';
COMMENT ON TABLE transactions IS 'Multiple SELECT policies are intentional: buyers see purchases, sellers see sales - both needed for marketplace';