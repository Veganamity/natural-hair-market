/*
  # Create RPC Functions for Salon Verification Approval/Rejection
  
  1. approve_salon_verification_rpc - Approve a salon verification request
  2. reject_salon_verification_rpc - Reject a salon verification request
  
  Both functions:
  - Admin only (check email = stephaniebuisson1115@gmail.com)
  - Update salon_verifications table status
  - Update profiles table is_certified_salon flag
  - Return success status
*/

-- Function: Approve salon verification
CREATE OR REPLACE FUNCTION approve_salon_verification_rpc(
  p_verification_id uuid,
  p_user_id uuid
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
  IF p_verification_id IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'verification_id and user_id are required';
  END IF;

  -- Update salon_verifications status
  UPDATE salon_verifications
  SET 
    status = 'approved',
    updated_at = now()
  WHERE id = p_verification_id;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Verification request not found';
  END IF;

  -- Update profile to mark as certified salon
  UPDATE profiles
  SET is_certified_salon = true
  WHERE id = p_user_id;

  -- Return success
  RETURN json_build_object(
    'success', true,
    'message', 'Salon verification approved successfully'
  );
END;
$$;

COMMENT ON FUNCTION approve_salon_verification_rpc IS 'Admin function to approve salon verification requests';

-- Function: Reject salon verification
CREATE OR REPLACE FUNCTION reject_salon_verification_rpc(
  p_verification_id uuid,
  p_user_id uuid
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
  IF p_verification_id IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'verification_id and user_id are required';
  END IF;

  -- Update salon_verifications status
  UPDATE salon_verifications
  SET 
    status = 'rejected',
    updated_at = now()
  WHERE id = p_verification_id;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Verification request not found';
  END IF;

  -- Update profile to remove certified salon status
  UPDATE profiles
  SET is_certified_salon = false
  WHERE id = p_user_id;

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