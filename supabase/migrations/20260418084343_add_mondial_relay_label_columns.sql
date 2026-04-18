/*
  # Add Mondial Relay label generation columns

  1. New columns on `transactions`:
    - `sender_address` (jsonb) - Seller's address used as sender for the shipment
    - `shipping_carrier_reference` (text) - Carrier-specific shipment reference
    - `label_generated_at` (timestamptz) - Timestamp when the shipping label was generated
    - `shipping_status` (text) - Current shipping status (e.g., label_created, shipped, delivered)
    - `label_generation_error` (text) - Error message if label generation failed

  2. Notes:
    - All columns are nullable and optional
    - No RLS changes required (these are additional data columns on existing table)
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'sender_address') THEN
    ALTER TABLE transactions ADD COLUMN sender_address jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'shipping_carrier_reference') THEN
    ALTER TABLE transactions ADD COLUMN shipping_carrier_reference text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'label_generated_at') THEN
    ALTER TABLE transactions ADD COLUMN label_generated_at timestamptz;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'shipping_status') THEN
    ALTER TABLE transactions ADD COLUMN shipping_status text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'label_generation_error') THEN
    ALTER TABLE transactions ADD COLUMN label_generation_error text;
  END IF;
END $$;
