/*
  # Create RPC function to get salon verifications

  1. New Functions
    - `get_salon_verifications_rpc` - Returns salon verifications with profile info
      - Bypasses schema cache issues
      - Admin-only access via email check
      - Optional status filter
  
  2. Security
    - Only accessible by admin email (stephaniebuisson1115@gmail.com)
    - Returns empty array if not admin
*/

CREATE OR REPLACE FUNCTION get_salon_verifications_rpc(status_filter text DEFAULT 'all')
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  user_email text;
BEGIN
  -- Get current user's email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid();

  -- Check if user is admin
  IF user_email != 'stephaniebuisson1115@gmail.com' THEN
    RETURN '[]'::json;
  END IF;

  -- Get verifications with profile info
  IF status_filter = 'all' THEN
    SELECT json_agg(row_to_json(t))
    INTO result
    FROM (
      SELECT 
        sv.id,
        sv.user_id,
        sv.salon_name,
        sv.siret,
        sv.address,
        sv.phone,
        sv.status,
        sv.created_at,
        json_build_object(
          'email', p.email,
          'full_name', p.full_name
        ) as profiles
      FROM salon_verifications sv
      LEFT JOIN profiles p ON p.id = sv.user_id
      ORDER BY sv.created_at DESC
    ) t;
  ELSE
    SELECT json_agg(row_to_json(t))
    INTO result
    FROM (
      SELECT 
        sv.id,
        sv.user_id,
        sv.salon_name,
        sv.siret,
        sv.address,
        sv.phone,
        sv.status,
        sv.created_at,
        json_build_object(
          'email', p.email,
          'full_name', p.full_name
        ) as profiles
      FROM salon_verifications sv
      LEFT JOIN profiles p ON p.id = sv.user_id
      WHERE sv.status = status_filter
      ORDER BY sv.created_at DESC
    ) t;
  END IF;

  -- Return empty array if no results
  RETURN COALESCE(result, '[]'::json);
END;
$$;