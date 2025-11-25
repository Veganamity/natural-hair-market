/*
  # Create RPC functions to approve/reject salon verifications

  1. New Functions
    - `approve_salon_verification_rpc` - Approves a salon verification
    - `reject_salon_verification_rpc` - Rejects a salon verification
  
  2. Security
    - Only accessible by admin email (stephaniebuisson1115@gmail.com)
    - Updates both salon_verifications and profiles tables
*/

CREATE OR REPLACE FUNCTION approve_salon_verification_rpc(
  verification_id uuid,
  user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  -- Get current user's email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid();

  -- Check if user is admin
  IF user_email != 'stephaniebuisson1115@gmail.com' THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Update verification status
  UPDATE salon_verifications
  SET status = 'approved', updated_at = now()
  WHERE id = verification_id;

  -- Update profile
  UPDATE profiles
  SET is_certified_salon = true
  WHERE id = user_id;

  RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION reject_salon_verification_rpc(
  verification_id uuid,
  user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  -- Get current user's email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid();

  -- Check if user is admin
  IF user_email != 'stephaniebuisson1115@gmail.com' THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Update verification status
  UPDATE salon_verifications
  SET status = 'rejected', updated_at = now()
  WHERE id = verification_id;

  -- Update profile
  UPDATE profiles
  SET is_certified_salon = false
  WHERE id = user_id;

  RETURN json_build_object('success', true);
END;
$$;