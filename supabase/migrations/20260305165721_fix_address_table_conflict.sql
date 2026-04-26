/*
  # Fix Address Table Conflict
  
  1. Problem
    - Two similar tables exist: `saved_addresses` and `shipping_addresses`
    - This causes PostgREST schema cache confusion
    - Application code expects `saved_addresses` but it's not properly registered
    
  2. Solution
    - Drop the problematic `saved_addresses` table
    - Rename `shipping_addresses` to `saved_addresses`
    - Update all policies, functions, and triggers to use the new name
    - Force PostgREST to reload the schema
    
  3. Data Safety
    - Check if data exists in `saved_addresses` before dropping
    - If data exists, migrate it to `shipping_addresses` first
*/

-- First, check if saved_addresses has any data and migrate it if needed
DO $$
DECLARE
  saved_count integer;
BEGIN
  -- Count rows in saved_addresses
  SELECT COUNT(*) INTO saved_count FROM saved_addresses;
  
  IF saved_count > 0 THEN
    -- Migrate data from saved_addresses to shipping_addresses
    INSERT INTO shipping_addresses (
      id, user_id, full_name, phone, address_line1, address_line2,
      postal_code, city, country, is_default, created_at, updated_at
    )
    SELECT 
      id, user_id, full_name, phone, address_line1, address_line2,
      postal_code, city, country, is_default, created_at, updated_at
    FROM saved_addresses
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Drop the problematic saved_addresses table
DROP TABLE IF EXISTS saved_addresses CASCADE;

-- Rename shipping_addresses to saved_addresses
ALTER TABLE shipping_addresses RENAME TO saved_addresses;

-- Update the policies (they should have been recreated automatically, but let's be explicit)
-- The policies on shipping_addresses are automatically transferred to saved_addresses

-- Recreate the functions and triggers with the correct table name
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE saved_addresses
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ensure_single_default_address ON saved_addresses;
CREATE TRIGGER trigger_ensure_single_default_address
  BEFORE INSERT OR UPDATE ON saved_addresses
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_address();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_saved_addresses_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_saved_addresses_timestamp ON saved_addresses;
CREATE TRIGGER trigger_update_saved_addresses_timestamp
  BEFORE UPDATE ON saved_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_addresses_timestamp();

-- Recreate indexes
DROP INDEX IF EXISTS idx_saved_addresses_user_id;
DROP INDEX IF EXISTS idx_saved_addresses_is_default;

CREATE INDEX idx_saved_addresses_user_id ON saved_addresses(user_id);
CREATE INDEX idx_saved_addresses_is_default ON saved_addresses(user_id, is_default) WHERE is_default = true;

-- Add table comment
COMMENT ON TABLE saved_addresses IS 'User saved shipping addresses (renamed from shipping_addresses)';

-- Force PostgREST to reload the schema
NOTIFY pgrst, 'reload schema';
