/*
  # Marketplace Architecture - Seller Fees & Commission

  1. Changes to Tables
    
    **listings table:**
    - Add `seller_shipping_fee` (decimal) - Custom shipping fee set by each seller
    - Add `seller_address_city` (text) - Seller's city for shipping origin
    - Add `seller_address_postal_code` (text) - Seller's postal code
    
    **transactions table:**
    - Add `marketplace_commission_rate` (decimal) - Platform commission percentage (e.g., 0.10 for 10%)
    - Add `marketplace_commission_amount` (decimal) - Actual commission amount deducted
    - Add `seller_shipping_fee` (decimal) - Track shipping fee in transaction
    
    **profiles table:**
    - Add `default_shipping_fee` (decimal) - Default shipping fee for new listings
    - Add `accepts_marketplace_terms` (boolean) - Seller accepts marketplace commission terms

  2. Migration Strategy
    - Use IF NOT EXISTS to safely add columns
    - Set sensible defaults: 10% commission rate, 4.99€ default shipping
    - Maintain backwards compatibility with existing data

  3. Marketplace Payment Model
    - Platform takes a percentage commission from item price only
    - Sellers set their own shipping fees and handle shipping
    - Payment split: 
      - Total charged to buyer = Item Price + Seller Shipping Fee
      - Seller receives = Item Price * (1 - Commission Rate) + Seller Shipping Fee
      - Platform receives = Item Price * Commission Rate
*/

-- Add marketplace columns to listings table
DO $$
BEGIN
  -- Seller shipping fee (seller sets this, they handle shipping)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'seller_shipping_fee'
  ) THEN
    ALTER TABLE listings ADD COLUMN seller_shipping_fee decimal(10,2) DEFAULT 4.99;
  END IF;
  
  -- Seller address information for shipping origin
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'seller_address_city'
  ) THEN
    ALTER TABLE listings ADD COLUMN seller_address_city text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'seller_address_postal_code'
  ) THEN
    ALTER TABLE listings ADD COLUMN seller_address_postal_code text;
  END IF;
END $$;

-- Add marketplace commission columns to transactions table
DO $$
BEGIN
  -- Marketplace commission rate (e.g., 0.10 = 10%)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'marketplace_commission_rate'
  ) THEN
    ALTER TABLE transactions ADD COLUMN marketplace_commission_rate decimal(5,4) DEFAULT 0.10;
  END IF;
  
  -- Actual commission amount deducted from seller
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'marketplace_commission_amount'
  ) THEN
    ALTER TABLE transactions ADD COLUMN marketplace_commission_amount decimal(10,2) DEFAULT 0;
  END IF;
  
  -- Store seller's shipping fee in transaction for record keeping
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'seller_shipping_fee'
  ) THEN
    ALTER TABLE transactions ADD COLUMN seller_shipping_fee decimal(10,2) DEFAULT 0;
  END IF;
END $$;

-- Add default shipping settings to profiles
DO $$
BEGIN
  -- Default shipping fee for new listings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'default_shipping_fee'
  ) THEN
    ALTER TABLE profiles ADD COLUMN default_shipping_fee decimal(10,2) DEFAULT 4.99;
  END IF;
  
  -- Marketplace terms acceptance
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'accepts_marketplace_terms'
  ) THEN
    ALTER TABLE profiles ADD COLUMN accepts_marketplace_terms boolean DEFAULT false;
  END IF;
END $$;

-- Update existing transactions to have marketplace commission calculated
-- Commission is 10% of the item price (amount minus shipping)
UPDATE transactions
SET 
  marketplace_commission_rate = 0.10,
  marketplace_commission_amount = ROUND((amount - COALESCE(shipping_cost, 0)) * 0.10, 2),
  seller_shipping_fee = COALESCE(shipping_cost, 4.99)
WHERE marketplace_commission_amount = 0 OR marketplace_commission_amount IS NULL;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_listings_seller_shipping_fee ON listings(seller_shipping_fee);
CREATE INDEX IF NOT EXISTS idx_transactions_marketplace_commission ON transactions(marketplace_commission_amount);