/*
  # Add sendcloud_method_id to transactions

  Stores the Sendcloud shipping method ID chosen by the buyer at checkout,
  so the label creation function uses the exact method selected (e.g., UPS,
  Chronopost, Mondial Relay) rather than a hardcoded fallback.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'sendcloud_method_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN sendcloud_method_id integer;
  END IF;
END $$;
