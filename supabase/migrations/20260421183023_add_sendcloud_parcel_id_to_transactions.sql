/*
  # Add sendcloud_parcel_id to transactions

  Adds the sendcloud_parcel_id column to store the Sendcloud parcel reference
  returned after label creation.

  1. Changes
    - `transactions`: add `sendcloud_parcel_id` (text, nullable)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'sendcloud_parcel_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN sendcloud_parcel_id text;
  END IF;
END $$;
