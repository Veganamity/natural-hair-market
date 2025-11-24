/*
  # Create Transactions and Payouts Tables

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `listing_id` (uuid, references listings)
      - `buyer_id` (uuid, references auth.users)
      - `seller_id` (uuid, references auth.users)
      - `amount` (numeric, total amount paid by buyer)
      - `seller_amount` (numeric, amount seller receives after commission)
      - `platform_fee` (numeric, platform commission - 0.99€)
      - `stripe_payment_intent_id` (text, unique, Stripe payment ID)
      - `status` (text, pending/completed/failed/refunded)
      - `payment_method` (text, sepa_debit/card/etc)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `seller_bank_accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `stripe_account_id` (text, Stripe Connect account ID)
      - `account_status` (text, pending/active/restricted)
      - `iban` (text, encrypted or last 4 digits only)
      - `bank_name` (text)
      - `account_holder_name` (text)
      - `is_verified` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Buyers can view their purchase transactions
    - Sellers can view their sale transactions
    - Users can view and manage their own bank accounts
    - Only authenticated users can access their own data

  3. Important Notes
    - Platform takes 0.99€ fixed commission per sale
    - Transactions track the complete payment flow
    - Bank accounts store seller payout information
    - All amounts in euros (numeric type for precision)
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  seller_id uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  seller_amount numeric NOT NULL CHECK (seller_amount >= 0),
  platform_fee numeric NOT NULL DEFAULT 0.99,
  stripe_payment_intent_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'processing')),
  payment_method text DEFAULT 'sepa_debit',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS seller_bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  stripe_account_id text UNIQUE,
  account_status text NOT NULL DEFAULT 'pending' CHECK (account_status IN ('pending', 'active', 'restricted', 'disabled')),
  iban_last4 text,
  bank_name text,
  account_holder_name text,
  is_verified boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their purchase transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view their sale transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can view own bank account"
  ON seller_bank_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank account"
  ON seller_bank_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bank account"
  ON seller_bank_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_listing_id ON transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payment_intent ON transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_seller_bank_accounts_user_id ON seller_bank_accounts(user_id);