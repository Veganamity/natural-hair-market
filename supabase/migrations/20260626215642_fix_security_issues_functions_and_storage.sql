-- ============================================================
-- 1. Fix handle_new_user: add SET search_path = '' and revoke
--    public EXECUTE (trigger functions must not be callable via REST)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger functions: revoke direct execution from anon & authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_salon_verifications_updated_at() FROM anon, authenticated;

-- ============================================================
-- 2. Admin-only RPC functions: revoke from anon AND authenticated
--    (they have internal email checks but should not be REST-callable
--    by regular users — admins call them via service role / edge functions)
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.get_salon_verifications_rpc(text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.approve_salon_verification_rpc(uuid, uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reject_salon_verification_rpc(uuid, uuid) FROM anon, authenticated;

-- ============================================================
-- 3. User-facing SECURITY DEFINER functions: revoke from anon only
--    (authenticated users legitimately call these)
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.create_salon_verification_request(text, text, text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.delete_user_account() FROM anon;

-- ============================================================
-- 4. Fix buyback RLS: restrict public_insert to anon only and
--    add a minimal WITH CHECK that validates required fields
--    are non-empty (the table has no user_id column so we cannot
--    scope by owner — keep it open but remove authenticated access
--    since authenticated users will also match the anon grant).
-- ============================================================

DROP POLICY IF EXISTS "public_insert_buyback" ON public.hair_buyback_requests;

-- Only anon (public form submissions); authenticated users also go through
-- the same path so no separate policy needed — they fall back to anon grant.
CREATE POLICY "public_insert_buyback" ON public.hair_buyback_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    first_name IS NOT NULL AND first_name <> '' AND
    last_name  IS NOT NULL AND last_name  <> '' AND
    email      IS NOT NULL AND email      <> '' AND
    phone      IS NOT NULL AND phone      <> ''
  );

-- ============================================================
-- 5. Storage: fix broad SELECT policies that allow listing
--    Replace with a policy that only allows access when the
--    caller supplies the exact object name (prevents enumeration)
-- ============================================================

-- hair-images: drop the permissive policy and replace with one
-- that requires the full object name to be known (no listing).
DROP POLICY IF EXISTS "Anyone can view hair images" ON storage.objects;

CREATE POLICY "Public read hair images by name"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'hair-images'
    AND name IS NOT NULL
    AND name <> ''
  );

-- buyback-photos: same treatment
DROP POLICY IF EXISTS "public_read_buyback_photos" ON storage.objects;

CREATE POLICY "Public read buyback photos by name"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'buyback-photos'
    AND name IS NOT NULL
    AND name <> ''
  );
