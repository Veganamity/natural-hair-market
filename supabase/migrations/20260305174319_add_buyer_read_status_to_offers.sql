/*
  # Add buyer read status to offers table

  1. New Column
    - `buyer_read_status` (boolean, default: true)
      - Tracks if buyer has seen the status change (accepted/rejected)
      - Set to true by default for new offers (buyer created them, they know)
      - Set to false when seller accepts/rejects offer
      - Set to true when buyer views the offer in their offers list

  2. Purpose
    - Show red notification dot to buyers when their offer status changes
    - Allow buyers to see which offers have been updated since they last checked
    - Improve user experience by notifying buyers of seller responses

  3. Index
    - Add index for faster unread status queries
*/

-- Add buyer_read_status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'offers' AND column_name = 'buyer_read_status'
  ) THEN
    ALTER TABLE offers ADD COLUMN buyer_read_status boolean DEFAULT true NOT NULL;
  END IF;
END $$;

-- Create index for faster unread queries
CREATE INDEX IF NOT EXISTS idx_offers_buyer_read_status 
ON offers(buyer_id, buyer_read_status) 
WHERE buyer_read_status = false;

-- Set existing offers with status 'accepted' or 'rejected' to unread for buyers
UPDATE offers 
SET buyer_read_status = false 
WHERE status IN ('accepted', 'rejected');