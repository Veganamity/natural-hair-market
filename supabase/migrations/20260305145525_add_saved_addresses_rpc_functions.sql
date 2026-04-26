/*
  # Add RPC functions for saved_addresses table access

  1. New Functions
    - `get_saved_addresses` - Get all saved addresses for current user
    - `create_saved_address` - Create a new saved address
    - `update_saved_address` - Update an existing saved address
    - `delete_saved_address` - Delete a saved address
    - `set_default_address` - Set an address as default

  2. Purpose
    - Bypass PostgREST cache issues by using RPC functions
    - Provide direct database access through stored procedures

  3. Security
    - All functions check auth.uid() for authorization
    - Only users can access their own addresses
*/

-- Function to get all saved addresses for current user
CREATE OR REPLACE FUNCTION get_saved_addresses()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  label text,
  full_name text,
  address_line1 text,
  address_line2 text,
  postal_code text,
  city text,
  country text,
  phone text,
  is_default boolean,
  created_at timestamptz,
  updated_at timestamptz
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.id,
    sa.user_id,
    sa.label,
    sa.full_name,
    sa.address_line1,
    sa.address_line2,
    sa.postal_code,
    sa.city,
    sa.country,
    sa.phone,
    sa.is_default,
    sa.created_at,
    sa.updated_at
  FROM saved_addresses sa
  WHERE sa.user_id = auth.uid()
  ORDER BY sa.is_default DESC, sa.created_at DESC;
END;
$$;

-- Function to create a new saved address
CREATE OR REPLACE FUNCTION create_saved_address(
  p_label text,
  p_full_name text,
  p_address_line1 text,
  p_address_line2 text,
  p_postal_code text,
  p_city text,
  p_country text,
  p_phone text,
  p_is_default boolean
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_address_id uuid;
BEGIN
  -- If this is set as default, unset all other defaults
  IF p_is_default THEN
    UPDATE saved_addresses
    SET is_default = false
    WHERE user_id = auth.uid();
  END IF;

  INSERT INTO saved_addresses (
    user_id,
    label,
    full_name,
    address_line1,
    address_line2,
    postal_code,
    city,
    country,
    phone,
    is_default
  ) VALUES (
    auth.uid(),
    p_label,
    p_full_name,
    p_address_line1,
    p_address_line2,
    p_postal_code,
    p_city,
    p_country,
    p_phone,
    COALESCE(p_is_default, false)
  )
  RETURNING id INTO v_address_id;

  RETURN v_address_id;
END;
$$;

-- Function to update a saved address
CREATE OR REPLACE FUNCTION update_saved_address(
  p_id uuid,
  p_label text,
  p_full_name text,
  p_address_line1 text,
  p_address_line2 text,
  p_postal_code text,
  p_city text,
  p_country text,
  p_phone text,
  p_is_default boolean
)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check ownership
  IF NOT EXISTS (
    SELECT 1 FROM saved_addresses
    WHERE id = p_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Address not found or unauthorized';
  END IF;

  -- If this is set as default, unset all other defaults
  IF p_is_default THEN
    UPDATE saved_addresses
    SET is_default = false
    WHERE user_id = auth.uid() AND id != p_id;
  END IF;

  UPDATE saved_addresses
  SET
    label = p_label,
    full_name = p_full_name,
    address_line1 = p_address_line1,
    address_line2 = p_address_line2,
    postal_code = p_postal_code,
    city = p_city,
    country = p_country,
    phone = p_phone,
    is_default = COALESCE(p_is_default, false),
    updated_at = now()
  WHERE id = p_id AND user_id = auth.uid();

  RETURN true;
END;
$$;

-- Function to delete a saved address
CREATE OR REPLACE FUNCTION delete_saved_address(p_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM saved_addresses
  WHERE id = p_id AND user_id = auth.uid();

  RETURN true;
END;
$$;

-- Function to set an address as default
CREATE OR REPLACE FUNCTION set_default_address(p_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check ownership
  IF NOT EXISTS (
    SELECT 1 FROM saved_addresses
    WHERE id = p_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Address not found or unauthorized';
  END IF;

  -- Unset all defaults for this user
  UPDATE saved_addresses
  SET is_default = false
  WHERE user_id = auth.uid();

  -- Set the specified address as default
  UPDATE saved_addresses
  SET is_default = true, updated_at = now()
  WHERE id = p_id AND user_id = auth.uid();

  RETURN true;
END;
$$;
