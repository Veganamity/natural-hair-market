/*
  # Add Delayed Payment Fields

  1. Changes to transactions table
    - Add `capture_method` (manual/automatic) - indicates if payment requires manual capture
    - Add `delivery_status` (pending/shipped/delivered/cancelled) - tracks delivery
    - Add `delivery_confirmed_at` (timestamptz) - when delivery was confirmed
    - Add `captured_at` (timestamptz) - when payment was captured
    - Add `cancelled_at` (timestamptz) - when payment was cancelled
    - Add `transfer_id` (text) - Stripe transfer ID to seller
    
  2. Important Notes
    - Manual capture allows holding funds until delivery confirmation
    - Delivery status tracks order fulfillment
    - Transfer ID links to Stripe Connect payout to seller
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'capture_method'
  ) THEN
    ALTER TABLE transactions ADD COLUMN capture_method text DEFAULT 'automatic' CHECK (capture_method IN ('automatic', 'manual'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'delivery_status'
  ) THEN
    ALTER TABLE transactions ADD COLUMN delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'shipped', 'delivered', 'cancelled'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'delivery_confirmed_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN delivery_confirmed_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'captured_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN captured_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'cancelled_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN cancelled_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'transfer_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN transfer_id text;
  END IF;
END $$;