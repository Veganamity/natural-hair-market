/*
  # Add missing columns to transactions table

  ## Changes
  - Add `marketplace_commission_rate` (numeric) - stores the commission rate used (e.g. 0.10)
  - Add `marketplace_commission_amount` (numeric) - stores the commission amount in euros
  - Add `shipping_address` (text) - stores shipping address as JSON string for non-relay shipments
  - Add `shipping_label_pdf_url` (text) - URL of the generated shipping label PDF
  - Add `shipping_label_tracking_number` (text) - tracking number from shipping label
  - Add `shipping_price` (numeric) - alias/display field for shipping cost
  - Add `shipping_carrier` (text) - name of the shipping carrier used

  These columns were referenced in the codebase but missing from the database,
  causing silent INSERT failures in the create-payment-intent edge function.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'marketplace_commission_rate') THEN
    ALTER TABLE transactions ADD COLUMN marketplace_commission_rate numeric DEFAULT 0.10;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'marketplace_commission_amount') THEN
    ALTER TABLE transactions ADD COLUMN marketplace_commission_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'shipping_address') THEN
    ALTER TABLE transactions ADD COLUMN shipping_address text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'shipping_label_pdf_url') THEN
    ALTER TABLE transactions ADD COLUMN shipping_label_pdf_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'shipping_label_tracking_number') THEN
    ALTER TABLE transactions ADD COLUMN shipping_label_tracking_number text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'shipping_price') THEN
    ALTER TABLE transactions ADD COLUMN shipping_price numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'shipping_carrier') THEN
    ALTER TABLE transactions ADD COLUMN shipping_carrier text;
  END IF;
END $$;
