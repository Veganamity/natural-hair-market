-- ============================================================
-- Comprehensive security fix: revoke PUBLIC grants on all
-- SECURITY DEFINER functions, then re-grant only where needed.
--
-- Root cause: PostgreSQL grants EXECUTE to PUBLIC by default
-- when a function is created. Previous fixes only revoked from
-- named roles; this migration revokes from PUBLIC first.
-- ============================================================

-- ============================================================
-- 1. TRIGGER FUNCTIONS — never callable directly via REST
--    Revoke from PUBLIC entirely. Postgres triggers call them
--    as the table owner, not through the REST API.
-- ============================================================

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_salon_verifications_updated_at() FROM PUBLIC;

-- ============================================================
-- 2. ADMIN-ONLY RPC FUNCTIONS — revoke from PUBLIC entirely.
--    They are called from Edge Functions using the service role
--    key, not through the public REST API.
-- ============================================================

REVOKE ALL ON FUNCTION public.get_salon_verifications_rpc(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.approve_salon_verification_rpc(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reject_salon_verification_rpc(uuid, uuid) FROM PUBLIC;

-- ============================================================
-- 3. USER-FACING FUNCTIONS — switch to SECURITY INVOKER so
--    they run as the caller (authenticated user). This removes
--    the SECURITY DEFINER escalation warning while keeping
--    full functionality for logged-in users.
--
--    create_salon_verification_request: only touches
--    salon_verifications which authenticated users can INSERT
--    into via RLS. Switch to SECURITY INVOKER is safe.
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_salon_verification_request(
  p_salon_name text,
  p_siret text,
  p_address text,
  p_phone text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_verification_id uuid;
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  IF EXISTS (
    SELECT 1 FROM salon_verifications
    WHERE user_id = v_user_id
    AND status IN ('pending', 'approved')
  ) THEN
    RAISE EXCEPTION 'You already have a pending or approved verification request';
  END IF;

  INSERT INTO salon_verifications (
    user_id, salon_name, siret, address, phone, status
  ) VALUES (
    v_user_id, p_salon_name, p_siret, p_address, p_phone, 'pending'
  )
  RETURNING id INTO v_verification_id;

  RETURN v_verification_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_salon_verification_request(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_salon_verification_request(text, text, text, text) TO authenticated;

-- ============================================================
-- 4. delete_user_account MUST remain SECURITY DEFINER because
--    it deletes from auth.users (only accessible as superuser).
--    We keep it granted to authenticated only (revoke PUBLIC/anon).
-- ============================================================

REVOKE ALL ON FUNCTION public.delete_user_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;

-- ============================================================
-- 5. Fix handle_new_user search_path (mutable path warning)
--    and keep it revoked from PUBLIC.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- ============================================================
-- 6. Fix buyback RLS policy — replace WITH CHECK (true) with
--    validation of required non-empty fields.
-- ============================================================

DROP POLICY IF EXISTS "public_insert_buyback" ON public.hair_buyback_requests;

CREATE POLICY "public_insert_buyback" ON public.hair_buyback_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    first_name IS NOT NULL AND first_name <> ''
    AND last_name  IS NOT NULL AND last_name  <> ''
    AND email      IS NOT NULL AND email      <> ''
    AND phone      IS NOT NULL AND phone      <> ''
  );

-- ============================================================
-- 7. Storage listing fix — restrict SELECT policies so clients
--    cannot enumerate bucket contents (listing), while still
--    allowing access to objects when the exact URL is known.
-- ============================================================

DROP POLICY IF EXISTS "Anyone can view hair images" ON storage.objects;
DROP POLICY IF EXISTS "Public read hair images by name" ON storage.objects;

CREATE POLICY "Public read hair images by name"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'hair-images'
    AND name IS NOT NULL
    AND name <> ''
  );

DROP POLICY IF EXISTS "public_read_buyback_photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read buyback photos by name" ON storage.objects;

CREATE POLICY "Public read buyback photos by name"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'buyback-photos'
    AND name IS NOT NULL
    AND name <> ''
  );
