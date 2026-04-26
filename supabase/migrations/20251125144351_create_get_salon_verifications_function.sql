/*
  # Create RPC Function for Salon Verifications

  This migration creates a PostgreSQL function to retrieve salon verifications
  with profile information. This bypasses the Supabase client schema cache issue.

  ## New Functions
  1. `get_salon_verifications(status_filter text)` - Returns salon verifications with profile data
     - Accepts an optional status filter ('pending', 'approved', 'rejected', or null for all)
     - Returns JSON array with verification data and associated profile information
     - Only accessible to admin users

  ## Security
  - Function uses SECURITY DEFINER to run with elevated privileges
  - Checks that caller's email matches admin email before returning data
  - Returns empty array if caller is not admin
*/

-- Create function to get salon verifications with profile data
CREATE OR REPLACE FUNCTION get_salon_verifications(status_filter text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  salon_name text,
  siret text,
  address text,
  phone text,
  status text,
  created_at timestamptz,
  profiles jsonb
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if caller is admin
  IF (auth.jwt()->>'email') != 'stephaniebuisson1115@gmail.com' THEN
    RETURN;
  END IF;

  -- Return verifications with profile data
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
    jsonb_build_object(
      'email', p.email,
      'full_name', p.full_name
    ) as profiles
  FROM salon_verifications sv
  LEFT JOIN profiles p ON sv.user_id = p.id
  WHERE status_filter IS NULL OR sv.status = status_filter
  ORDER BY sv.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_salon_verifications(text) TO authenticated;
