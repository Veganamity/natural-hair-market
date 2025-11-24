/*
  # Add Shipping Carrier Fields to Transactions Table

  1. Changes
    - Add `shipping_carrier` column to store the selected carrier name (e.g., "Colissimo", "DHL")
    - Add `shipping_carrier_id` column to store the Sendcloud shipping method ID
    - Add `shipping_price` column to store the shipping cost for the selected carrier

  2. Notes
    - These fields allow tracking which shipping method the buyer selected
    - The shipping_carrier_id is used when creating the label via Sendcloud API
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipping_carrier'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_carrier text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipping_carrier_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_carrier_id integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipping_price'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_price numeric DEFAULT 0;
  END IF;
END $$;