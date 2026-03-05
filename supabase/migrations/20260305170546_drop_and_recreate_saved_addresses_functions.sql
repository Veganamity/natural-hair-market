/*
  # Recreate RPC Functions for Saved Addresses
  
  1. Changes
    - Drop existing functions first to avoid conflicts
    - Recreate with consistent parameter naming
    
  2. Functions
    - get_user_saved_addresses(): Get all addresses for current user
    - add_saved_address(): Insert a new address
    - update_saved_address(): Update an existing address
    - delete_saved_address(): Delete an address
    - get_saved_address(): Get a specific address by ID
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_user_saved_addresses();
DROP FUNCTION IF EXISTS add_saved_address(text, text, text, text, text, text, text, boolean);
DROP FUNCTION IF EXISTS update_saved_address(uuid, text, text, text, text, text, text, text, boolean);
DROP FUNCTION IF EXISTS delete_saved_address(uuid);
DROP FUNCTION IF EXISTS get_saved_address(uuid);

-- Function to get all saved addresses for the current user
CREATE FUNCTION get_user_saved_addresses()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  address_line1 text,
  address_line2 text,
  city text,
  postal_code text,
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
    sa.full_name,
    sa.address_line1,
    sa.address_line2,
    sa.city,
    sa.postal_code,
    sa.country,
    sa.phone,
    sa.is_default,
    sa.created_at,
    sa.updated_at
  FROM saved_addresses sa
  WHERE sa.user_id = auth.uid()
  ORDER BY sa.is_default DESC, sa.updated_at DESC;
END;
$$;

-- Function to add a new saved address
CREATE FUNCTION add_saved_address(
  p_full_name text,
  p_address_line1 text,
  p_address_line2 text,
  p_city text,
  p_postal_code text,
  p_country text,
  p_phone text,
  p_is_default boolean DEFAULT false
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_address_id uuid;
BEGIN
  -- If setting as default, unset other defaults
  IF p_is_default THEN
    UPDATE saved_addresses
    SET is_default = false
    WHERE user_id = auth.uid();
  END IF;

  -- Insert new address
  INSERT INTO saved_addresses (
    user_id,
    full_name,
    address_line1,
    address_line2,
    city,
    postal_code,
    country,
    phone,
    is_default
  ) VALUES (
    auth.uid(),
    p_full_name,
    p_address_line1,
    p_address_line2,
    p_city,
    p_postal_code,
    p_country,
    p_phone,
    p_is_default
  )
  RETURNING id INTO v_address_id;

  RETURN v_address_id;
END;
$$;

-- Function to update a saved address
CREATE FUNCTION update_saved_address(
  p_address_id uuid,
  p_full_name text,
  p_address_line1 text,
  p_address_line2 text,
  p_city text,
  p_postal_code text,
  p_country text,
  p_phone text,
  p_is_default boolean DEFAULT false
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
    WHERE id = p_address_id AND user_id = auth.uid()
  ) THEN
    RETURN false;
  END IF;

  -- If setting as default, unset other defaults
  IF p_is_default THEN
    UPDATE saved_addresses
    SET is_default = false
    WHERE user_id = auth.uid() AND id != p_address_id;
  END IF;

  -- Update address
  UPDATE saved_addresses
  SET
    full_name = p_full_name,
    address_line1 = p_address_line1,
    address_line2 = p_address_line2,
    city = p_city,
    postal_code = p_postal_code,
    country = p_country,
    phone = p_phone,
    is_default = p_is_default,
    updated_at = now()
  WHERE id = p_address_id AND user_id = auth.uid();

  RETURN true;
END;
$$;

-- Function to delete a saved address
CREATE FUNCTION delete_saved_address(p_address_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM saved_addresses
  WHERE id = p_address_id AND user_id = auth.uid();

  RETURN FOUND;
END;
$$;

-- Function to get a specific saved address
CREATE FUNCTION get_saved_address(p_address_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  address_line1 text,
  address_line2 text,
  city text,
  postal_code text,
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
    sa.full_name,
    sa.address_line1,
    sa.address_line2,
    sa.city,
    sa.postal_code,
    sa.country,
    sa.phone,
    sa.is_default,
    sa.created_at,
    sa.updated_at
  FROM saved_addresses sa
  WHERE sa.id = p_address_id AND sa.user_id = auth.uid();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_saved_addresses() TO authenticated;
GRANT EXECUTE ON FUNCTION add_saved_address(text, text, text, text, text, text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION update_saved_address(uuid, text, text, text, text, text, text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_saved_address(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_saved_address(uuid) TO authenticated;
