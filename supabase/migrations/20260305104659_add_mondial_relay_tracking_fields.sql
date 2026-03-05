/*
  # Add Mondial Relay Tracking Fields

  1. Changes to Tables
    
    **transactions table:**
    - Add `mondial_relay_point_id` (text, optional) - ID of selected Mondial Relay point
    - Add `mondial_relay_point_name` (text, optional) - Name of the relay point
    - Add `mondial_relay_point_address` (text, optional) - Full address of relay point
    
  2. Purpose
    - Store Mondial Relay pickup point information for buyer
    - Allow buyers to track their relay point selection
    - Enable sellers to see which relay point to send to
    
  3. Shipping Method Tracking
    - `shipping_carrier` field will store: "Mondial Relay ({POINT_ID})"
    - `shipping_label_tracking_number` stores Mondial Relay expedition number
    - `shipping_carrier_reference` also stores the expedition number
    
  4. Notes
    - Fields are optional as not all transactions use Mondial Relay
    - Colissimo and Chronopost use different fields (recipient_address)
    - Mondial Relay uses relay points instead of home delivery
*/

-- Add Mondial Relay fields to transactions table
DO $$
BEGIN
  -- Add mondial_relay_point_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'mondial_relay_point_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN mondial_relay_point_id text;
  END IF;

  -- Add mondial_relay_point_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'mondial_relay_point_name'
  ) THEN
    ALTER TABLE transactions ADD COLUMN mondial_relay_point_name text;
  END IF;

  -- Add mondial_relay_point_address if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'mondial_relay_point_address'
  ) THEN
    ALTER TABLE transactions ADD COLUMN mondial_relay_point_address text;
  END IF;
END $$;

-- Add helpful comments
COMMENT ON COLUMN transactions.mondial_relay_point_id IS 'Mondial Relay point ID (e.g., MR001)';
COMMENT ON COLUMN transactions.mondial_relay_point_name IS 'Name of the Mondial Relay pickup point';
COMMENT ON COLUMN transactions.mondial_relay_point_address IS 'Full address of the relay point for display';

-- Create index for filtering transactions by relay point
CREATE INDEX IF NOT EXISTS idx_transactions_mondial_relay_point ON transactions(mondial_relay_point_id) WHERE mondial_relay_point_id IS NOT NULL;
