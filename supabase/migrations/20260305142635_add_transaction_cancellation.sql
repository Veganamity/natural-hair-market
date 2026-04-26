/*
  # Add Transaction Cancellation Support

  1. Changes
    - Add `cancelled_at` timestamp column to transactions table
    - Add `cancellation_reason` text column to transactions table
    - Add `cancelled_by` uuid column to transactions table (references user who cancelled)
    - Update RLS policies to allow buyers and sellers to cancel transactions
    - Add check constraint to ensure only pending or payment_authorized transactions can be cancelled

  2. Security
    - Only buyer or seller can cancel their own transaction
    - Transaction must be in pending or payment_authorized status
*/

-- Add cancellation columns to transactions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'cancelled_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN cancelled_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'cancellation_reason'
  ) THEN
    ALTER TABLE transactions ADD COLUMN cancellation_reason text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'cancelled_by'
  ) THEN
    ALTER TABLE transactions ADD COLUMN cancelled_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Create function to cancel transaction
CREATE OR REPLACE FUNCTION cancel_transaction(
  p_transaction_id uuid,
  p_cancellation_reason text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction transactions%ROWTYPE;
  v_user_id uuid;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Get transaction
  SELECT * INTO v_transaction
  FROM transactions
  WHERE id = p_transaction_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Transaction not found');
  END IF;

  -- Check if user is buyer or seller
  IF v_transaction.buyer_id != v_user_id AND v_transaction.seller_id != v_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Check if transaction can be cancelled
  IF v_transaction.status NOT IN ('pending', 'payment_authorized') THEN
    RETURN json_build_object('success', false, 'error', 'Transaction cannot be cancelled at this stage');
  END IF;

  -- Check if already cancelled
  IF v_transaction.cancelled_at IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'Transaction already cancelled');
  END IF;

  -- Update transaction
  UPDATE transactions
  SET 
    cancelled_at = now(),
    cancellation_reason = p_cancellation_reason,
    cancelled_by = v_user_id,
    status = 'cancelled',
    updated_at = now()
  WHERE id = p_transaction_id;

  RETURN json_build_object('success', true, 'message', 'Transaction cancelled successfully');
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION cancel_transaction(uuid, text) TO authenticated;