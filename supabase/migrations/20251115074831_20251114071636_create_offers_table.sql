/*
  # Create Offers Table

  1. New Tables
    - `offers`
      - `id` (uuid, primary key, auto-generated)
      - `listing_id` (uuid, references listings)
      - `buyer_id` (uuid, references auth.users)
      - `amount` (numeric, the offered amount)
      - `message` (text, optional message from buyer)
      - `status` (text, pending/accepted/rejected/withdrawn)
      - `created_at` (timestamptz, auto-generated)
      - `updated_at` (timestamptz, auto-generated)

  2. Security
    - Enable RLS on `offers` table
    - Buyers can view their own offers
    - Sellers can view offers on their listings
    - Buyers can create offers
    - Buyers can withdraw their pending offers
    - Sellers can update offer status (accept/reject)

  3. Important Notes
    - Offers allow buyers to propose a different price
    - Sellers can accept or reject offers
    - When an offer is accepted, the listing status should be updated separately
*/

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own offers"
  ON offers FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view offers on their listings"
  ON offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = offers.listing_id
      AND listings.seller_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can create offers"
  ON offers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can withdraw pending offers"
  ON offers FOR UPDATE
  TO authenticated
  USING (auth.uid() = buyer_id AND status = 'pending')
  WITH CHECK (auth.uid() = buyer_id AND status = 'withdrawn');

CREATE POLICY "Sellers can update offer status"
  ON offers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = offers.listing_id
      AND listings.seller_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = offers.listing_id
      AND listings.seller_id = auth.uid()
    )
    AND status IN ('accepted', 'rejected')
  );

CREATE INDEX IF NOT EXISTS idx_offers_listing_id ON offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);