-- Add 'disputed' to transaction status and dispute tracking fields
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS dispute_opened_at timestamptz,
  ADD COLUMN IF NOT EXISTS dispute_reason    text,
  ADD COLUMN IF NOT EXISTS dispute_resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS dispute_resolution text; -- 'refund_buyer' | 'pay_seller'

-- Allow 'disputed' as a valid status value
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_status_check;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_status_check
  CHECK (status IN ('pending','processing','completed','failed','refunded','cancelled','disputed'));
