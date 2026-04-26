/*
  # Create RPC functions for user salon verification requests

  1. New Functions
    - `get_my_salon_verification_rpc` - Returns user's latest salon verification request
    - `submit_salon_verification_rpc` - Submits a new salon verification request
  
  2. Security
    - Users can only access their own verification requests
    - Validates SIRET format before insertion
*/

CREATE OR REPLACE FUNCTION get_my_salon_verification_rpc()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Get user's latest verification request
  SELECT row_to_json(sv)
  INTO result
  FROM salon_verifications sv
  WHERE sv.user_id = auth.uid()
  ORDER BY sv.created_at DESC
  LIMIT 1;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION submit_salon_verification_rpc(
  p_salon_name text,
  p_siret text,
  p_address text,
  p_phone text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cleaned_siret text;
  verification_id uuid;
BEGIN
  -- Remove spaces from SIRET
  cleaned_siret := regexp_replace(p_siret, '\s', '', 'g');
  
  -- Validate SIRET format (14 digits)
  IF NOT (cleaned_siret ~ '^\d{14}$') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Le SIRET doit contenir exactement 14 chiffres'
    );
  END IF;

  -- Insert new verification request
  INSERT INTO salon_verifications (
    user_id,
    salon_name,
    siret,
    address,
    phone,
    status
  )
  VALUES (
    auth.uid(),
    p_salon_name,
    cleaned_siret,
    p_address,
    p_phone,
    'pending'
  )
  RETURNING id INTO verification_id;

  RETURN json_build_object(
    'success', true,
    'id', verification_id
  );
END;
$$;