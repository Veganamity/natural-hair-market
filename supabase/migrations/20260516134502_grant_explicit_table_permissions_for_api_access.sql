/*
  # Grant explicit table permissions for Supabase API access

  ## Context
  Starting May 30, 2026, Supabase enforces explicit GRANT permissions on all
  public schema tables. Without these grants, the PostgREST API (used by
  supabase-js) cannot access the tables even if RLS policies allow it.

  ## Tables covered
  - profiles
  - listings
  - favorites
  - offers
  - transactions
  - seller_bank_accounts
  - shipping_addresses
  - listing_reports
  - salon_verifications

  ## Roles
  - anon: unauthenticated visitors (read-only public data via RLS)
  - authenticated: logged-in users
  - service_role: backend / edge functions (bypasses RLS)

  ## Notes
  - RLS policies remain in place and continue to restrict actual row access
  - These GRANTs only enable the API layer to reach the tables
  - anon is granted SELECT only where public visibility makes sense;
    RLS policies further restrict which rows are visible
*/

-- profiles
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO service_role;

-- listings
GRANT SELECT ON TABLE public.listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.listings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.listings TO service_role;

-- favorites
GRANT SELECT, INSERT, DELETE ON TABLE public.favorites TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.favorites TO service_role;

-- offers
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.offers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.offers TO service_role;

-- transactions
GRANT SELECT, INSERT, UPDATE ON TABLE public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.transactions TO service_role;

-- seller_bank_accounts
GRANT SELECT, INSERT, UPDATE ON TABLE public.seller_bank_accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.seller_bank_accounts TO service_role;

-- shipping_addresses
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shipping_addresses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shipping_addresses TO service_role;

-- listing_reports
GRANT SELECT, INSERT ON TABLE public.listing_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.listing_reports TO service_role;

-- salon_verifications
GRANT SELECT, INSERT, UPDATE ON TABLE public.salon_verifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.salon_verifications TO service_role;
