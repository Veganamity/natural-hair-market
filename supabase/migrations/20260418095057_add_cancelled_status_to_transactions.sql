/*
  # Add 'cancelled' to transactions status check constraint

  1. Changes
    - Update the status check constraint on `transactions` to include 'cancelled'

  2. Notes
    - Previously the constraint only allowed: pending, completed, failed, refunded, processing
    - This was inconsistent with the cancel_transaction RPC function which sets status = 'cancelled'
*/

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

ALTER TABLE transactions ADD CONSTRAINT transactions_status_check
  CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text, 'processing'::text, 'cancelled'::text]));
