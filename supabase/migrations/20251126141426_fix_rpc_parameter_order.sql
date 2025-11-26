/*
  # Fix RPC Function Parameter Order
  
  The frontend calls the functions with parameters named:
  - verification_id
  - user_id
  
  But Supabase expects them in this exact order for the schema cache.
  We need to drop and recreate the functions with the correct parameter order.
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS approve_salon_verification_rpc(uuid, uuid);
DROP FUNCTION IF EXISTS reject_salon_verification_rpc(uuid, uuid);

-- Recreate with correct parameter names (matching frontend calls)
CREATE OR REPLACE FUNCTION approve_salon_verification_rpc(
  verification_id uuid,
  user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_admin_email text;
BEGIN
  -- Get current user's email
  v_admin_email := (select auth.jwt()->>'email');
  
  -- Check if user is admin
  IF v_admin_email != 'stephaniebuisson1115@gmail.com' THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  -- Validate inputs
  IF verification_id IS NULL OR user_id IS NULL THEN
    RAISE EXCEPTION 'verification_id and user_id are required';
  END IF;

  -- Update salon_verifications status
  UPDATE salon_verifications
  SET 
    status = 'approved',
    updated_at = now()
  WHERE id = verification_id;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Verification request not found';
  END IF;

  -- Update profile to mark as certified salon
  UPDATE profiles
  SET is_certified_salon = true
  WHERE id = user_id;

  -- Return success
  RETURN json_build_object(
    'success', true,
    'message', 'Salon verification approved successfully'
  );
END;
$$;

COMMENT ON FUNCTION approve_salon_verification_rpc IS 'Admin function to approve salon verification requests';

-- Recreate reject function with correct parameter names
CREATE OR REPLACE FUNCTION reject_salon_verification_rpc(
  verification_id uuid,
  user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_admin_email text;
BEGIN
  -- Get current user's email
  v_admin_email := (select auth.jwt()->>'email');
  
  -- Check if user is admin
  IF v_admin_email != 'stephaniebuisson1115@gmail.com' THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  -- Validate inputs
  IF verification_id IS NULL OR user_id IS NULL THEN
    RAISE EXCEPTION 'verification_id and user_id are required';
  END IF;

  -- Update salon_verifications status
  UPDATE salon_verifications
  SET 
    status = 'rejected',
    updated_at = now()
  WHERE id = verification_id;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Verification request not found';
  END IF;

  -- Update profile to remove certified salon status
  UPDATE profiles
  SET is_certified_salon = false
  WHERE id = user_id;

  -- Return success
  RETURN json_build_object(
    'success', true,
    'message', 'Salon verification rejected successfully'
  );
END;
$$;

COMMENT ON FUNCTION reject_salon_verification_rpc IS 'Admin function to reject salon verification requests';

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION approve_salon_verification_rpc TO authenticated;
GRANT EXECUTE ON FUNCTION reject_salon_verification_rpc TO authenticated;