/*
  # Add read status to offers

  1. Changes
    - Add `seller_read` boolean column to track if seller has viewed the offer
    - Defaults to false for new offers
    - True when seller views the offer in the OffersView

  2. Purpose
    - Allow sellers to see which offers they haven't reviewed yet
    - Display notification badge count for unread offers
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'offers' AND column_name = 'seller_read'
  ) THEN
    ALTER TABLE offers ADD COLUMN seller_read boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_offers_seller_read ON offers(seller_read) WHERE seller_read = false;