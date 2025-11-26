/*
  # Create Missing RPC Functions for Salon Verifications
  
  1. get_salon_verifications_rpc - Get verifications with optional status filter
  2. create_salon_verification_request - Create verification request
  3. update_salon_verifications_updated_at - Trigger function for timestamps
*/

-- Function: Get salon verifications with optional status filter
CREATE OR REPLACE FUNCTION get_salon_verifications_rpc(status_filter text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  salon_name text,
  siret text,
  address text,
  phone text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Check if user is admin
  IF (select auth.jwt()->>'email') != 'stephaniebuisson1115@gmail.com' THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  -- Return filtered or all verifications
  IF status_filter IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      sv.id,
      sv.user_id,
      sv.salon_name,
      sv.siret,
      sv.address,
      sv.phone,
      sv.status,
      sv.created_at,
      sv.updated_at
    FROM salon_verifications sv
    WHERE sv.status = status_filter
    ORDER BY sv.created_at DESC;
  ELSE
    RETURN QUERY
    SELECT 
      sv.id,
      sv.user_id,
      sv.salon_name,
      sv.siret,
      sv.address,
      sv.phone,
      sv.status,
      sv.created_at,
      sv.updated_at
    FROM salon_verifications sv
    ORDER BY sv.created_at DESC;
  END IF;
END;
$$;

COMMENT ON FUNCTION get_salon_verifications_rpc IS 'Admin function to retrieve salon verification requests with optional status filter';

-- Function: Create salon verification request
CREATE OR REPLACE FUNCTION create_salon_verification_request(
  p_salon_name text,
  p_siret text,
  p_address text,
  p_phone text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_verification_id uuid;
  v_user_id uuid;
BEGIN
  -- Get current user ID
  v_user_id := (select auth.uid());
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if user already has a pending or approved request
  IF EXISTS (
    SELECT 1 FROM salon_verifications 
    WHERE user_id = v_user_id 
    AND status IN ('pending', 'approved')
  ) THEN
    RAISE EXCEPTION 'You already have a pending or approved verification request';
  END IF;

  -- Insert new verification request
  INSERT INTO salon_verifications (
    user_id,
    salon_name,
    siret,
    address,
    phone,
    status
  ) VALUES (
    v_user_id,
    p_salon_name,
    p_siret,
    p_address,
    p_phone,
    'pending'
  )
  RETURNING id INTO v_verification_id;

  RETURN v_verification_id;
END;
$$;

COMMENT ON FUNCTION create_salon_verification_request IS 'Creates a new salon verification request for the authenticated user';

-- Function: Update timestamp trigger
CREATE OR REPLACE FUNCTION update_salon_verifications_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_salon_verifications_updated_at IS 'Automatically updates the updated_at timestamp on salon_verifications table';

-- Ensure trigger exists
DROP TRIGGER IF EXISTS set_salon_verifications_updated_at ON salon_verifications;
CREATE TRIGGER set_salon_verifications_updated_at
  BEFORE UPDATE ON salon_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_salon_verifications_updated_at();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_salon_verifications_rpc TO authenticated;
GRANT EXECUTE ON FUNCTION create_salon_verification_request TO authenticated;