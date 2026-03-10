/*
  # Add buyer_read_status column to offers table

  1. Changes
    - Add `buyer_read_status` column to `offers` table
    - Default value is false (unread)
    - Allows tracking if buyers have read the status update of their offers

  2. Notes
    - This column tracks whether the buyer has seen the seller's response
    - Used for notification badges in the UI
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'offers' AND column_name = 'buyer_read_status'
  ) THEN
    ALTER TABLE offers ADD COLUMN buyer_read_status boolean DEFAULT false;
  END IF;
END $$;