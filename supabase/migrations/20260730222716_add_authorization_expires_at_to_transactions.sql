-- Add authorization_expires_at column to track real card authorization expiry
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'authorization_expires_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN authorization_expires_at timestamptz;
  END IF;
END $$;

-- Backfill existing manual-capture transactions that don't have the value yet.
-- For transactions already in a terminal state (completed/cancelled/refunded/failed)
-- the exact value doesn't matter, so we only fill pending/processing ones.
-- We assume the standard 7-day authorization window (no extension) as a safe default.
UPDATE transactions
SET authorization_expires_at = created_at + INTERVAL '6 days'
WHERE authorization_expires_at IS NULL
  AND capture_method = 'manual'
  AND status IN ('pending', 'processing');
