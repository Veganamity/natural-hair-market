/*
  # Add User Contact and Address Information

  1. Modifications to Existing Tables
    - Add contact and address fields to `profiles` table
      - `phone` (text, phone number)
      - `address_line1` (text, street address)
      - `address_line2` (text, optional additional address)
      - `postal_code` (text, postal code)
      - `city` (text, city name)
      - `country` (text, country code, default 'FR')
      - `stripe_account_id` (text, Stripe Connect account ID for receiving payments)
      - `stripe_account_status` (text, status of Stripe account: 'pending', 'active', 'restricted')
      - `stripe_onboarding_completed` (boolean, whether onboarding is complete)

  2. Notes
    - These fields are optional and can be filled by users in their profile settings
    - Stripe Connect account ID will be used for direct payouts to sellers
    - Phone and address are required for sellers to receive payments
*/

-- Add contact and address columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'address_line1'
  ) THEN
    ALTER TABLE profiles ADD COLUMN address_line1 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'address_line2'
  ) THEN
    ALTER TABLE profiles ADD COLUMN address_line2 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE profiles ADD COLUMN postal_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE profiles ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'country'
  ) THEN
    ALTER TABLE profiles ADD COLUMN country text DEFAULT 'FR';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_account_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_account_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_account_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_account_status text DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Create index for Stripe account lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_id ON profiles(stripe_account_id);