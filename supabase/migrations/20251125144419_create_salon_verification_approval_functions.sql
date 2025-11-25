/*
  # Create RPC Functions for Salon Verification Approval/Rejection

  This migration creates PostgreSQL functions to approve or reject salon verifications.
  These functions bypass the Supabase client schema cache issue.

  ## New Functions
  1. `approve_salon_verification(verification_id uuid, user_id uuid)` 
     - Approves a salon verification request
     - Sets is_certified_salon to true in profiles
     - Only accessible to admin users

  2. `reject_salon_verification(verification_id uuid, user_id uuid)`
     - Rejects a salon verification request
     - Sets is_certified_salon to false in profiles
     - Only accessible to admin users

  ## Security
  - Functions use SECURITY DEFINER to run with elevated privileges
  - Check that caller's email matches admin email before executing
  - Throw exception if caller is not admin
*/

-- Function to approve salon verification
CREATE OR REPLACE FUNCTION approve_salon_verification(
  verification_id uuid,
  user_id uuid
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if caller is admin
  IF (auth.jwt()->>'email') != 'stephaniebuisson1115@gmail.com' THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  -- Update verification status
  UPDATE salon_verifications
  SET 
    status = 'approved',
    updated_at = now()
  WHERE id = verification_id;

  -- Update profile
  UPDATE profiles
  SET is_certified_salon = true
  WHERE id = user_id;
END;
$$;

-- Function to reject salon verification
CREATE OR REPLACE FUNCTION reject_salon_verification(
  verification_id uuid,
  user_id uuid
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if caller is admin
  IF (auth.jwt()->>'email') != 'stephaniebuisson1115@gmail.com' THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  -- Update verification status
  UPDATE salon_verifications
  SET 
    status = 'rejected',
    updated_at = now()
  WHERE id = verification_id;

  -- Update profile
  UPDATE profiles
  SET is_certified_salon = false
  WHERE id = user_id;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION approve_salon_verification(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_salon_verification(uuid, uuid) TO authenticated;
