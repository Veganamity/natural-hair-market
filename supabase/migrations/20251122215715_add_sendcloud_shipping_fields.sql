/*
  # Add Sendcloud Shipping Fields to Transactions Table

  1. Changes
    - Add `shipping_label_url` column to store the PDF label URL from Sendcloud
    - Add `sendcloud_parcel_id` column to store the Sendcloud parcel ID
    - Add `shipping_status` column to track shipment status (pending, label_created, shipped, in_transit, delivered, exception)
    - Update `tracking_number` if not already present (it exists in the schema)

  2. Security
    - No changes to RLS policies
    - These fields are managed by Edge Functions and viewable by buyer/seller
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipping_label_url'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_label_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'sendcloud_parcel_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN sendcloud_parcel_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipping_status'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_status text DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'label_created', 'shipped', 'in_transit', 'delivered', 'exception', 'cancelled'));
  END IF;
END $$;